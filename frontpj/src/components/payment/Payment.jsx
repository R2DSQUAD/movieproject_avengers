import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwtAxios from '../../util/jwtUtil';
import '../../css/Payment.css';

const Payment = () => {
    const [paymentItems, setPaymentItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const cartItemIds = location.state?.cartItemIds || [];


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await jwtAxios.get("http://localhost:8090/api/myinfo/detail", {
                    withCredentials: true
                });
                console.log(" 사용자 정보:", response.data);
                setUserInfo(response.data);
            } catch (error) {
                console.error(" 사용자 정보 가져오기 오류:", error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchPaymentItems = async () => {
            try {
                const response = await jwtAxios.post(
                    "http://localhost:8090/api/payment/orderSettlement",
                    cartItemIds,
                    { withCredentials: true }
                );
                console.log(" 결제 정보:", response.data);
                setPaymentItems(response.data);
            } catch (error) {
                console.error("결제 정보 가져오기 오류:", error);
            }
        };

        if (cartItemIds.length > 0) {
            fetchPaymentItems();
        }
    }, [cartItemIds]);

    const groupedItems = paymentItems.reduce((acc, item) => {
        const key = `${item.movieNm}-${item.theaterName}-${item.screeningDate}-${item.screeningTime}`;

        if (!acc[key]) {
            acc[key] = {
                ...item,
                seatNumbers: [item.seatNumber]
            };
        } else {
            acc[key].seatNumbers.push(item.seatNumber);
        }

        return acc;
    }, {});

    const groupedList = Object.values(groupedItems);

    const totalPrice = groupedList.reduce((total, item) => {
        return total + item.price * item.seatNumbers.length;
    }, 0);

    const paymentGo = async () => {
        if (!paymentMethod) {
            alert("결제 수단을 선택하세요.");
            return;
        }

        if (!userInfo) {
            alert("로그인 정보가 없습니다. 다시 로그인하세요.");
            return;
        }

        if (cartItemIds.length === 0) {
            alert("결제할 항목이 없습니다.");
            return;
        }

        console.log(" 장바구니 항목 ID:", cartItemIds);

        const { IMP } = window;
        IMP.init("imp06751501");

        let pgProvider = "";
        switch (paymentMethod) {
            case "kakaopay":
                pgProvider = "kakaopay.TC0ONETIME";
                break;
            case "credit_card":
                pgProvider = "html5_inicis.INIBillTst";
                break;
            case "tosspay":
                pgProvider = "uplus.tlgdacomxpay";
                break;
            case "mobile":
                pgProvider = "danal_tpay.9810030929";
                break;
            default:
                alert("올바른 결제 수단을 선택하세요.");
                return;
        }

        console.log(" 선택한 PG사:", pgProvider);

        const merchantUid = `order_${new Date().getTime()}`;

        IMP.request_pay(
            {
                pg: pgProvider,
                pay_method: "card",
                merchant_uid: merchantUid,
                name: "영화 예매",
                amount: totalPrice,
                buyer_email: userInfo.email,
                buyer_name: userInfo.nickname,
            },
            async (response) => {
                if (response.success) {
                    console.log(" 결제 성공:", response);

                    try {
                        console.log(" 결제 검증 요청 시작:", response.imp_uid);
                        const verifyResponse = await jwtAxios.post("http://localhost:8090/api/payment/verify", {
                            imp_uid: response.imp_uid,
                            amount: totalPrice,
                        }, { withCredentials: true }); // ★ 이 설정이 없으면 CORS 에러 가능


                        console.log(" 결제 검증 결과:", verifyResponse.data);

                        if (verifyResponse.data === "결제 검증 성공") {
                            console.log(" 결제 정보 저장 요청 시작");
                            const saveResponse = await jwtAxios.post("http://localhost:8090/api/payment/save", {
                                cartItemIds: cartItemIds,
                                paymentMethod: paymentMethod,
                                totalPrice: totalPrice,
                            });

                            console.log(" 결제 저장 결과:", saveResponse.data);
                            alert("결제가 완료되었습니다.");
                            navigate("/");
                        } else {
                            alert(" 결제 검증 실패");
                        }
                    } catch (error) {
                        console.error(" 결제 검증 또는 저장 오류:", error);
                        alert("결제 처리 중 오류가 발생했습니다.");
                    }
                } else {
                    console.error(" 결제 실패:", response.error_msg);
                    alert(`결제 실패: ${response.error_msg}`);
                }
            }
        );
    };




    return (
        <div className="payment">
            <h1>결제 페이지</h1>
            <div className="payment-con">
                <div className="reservation">
                    <h5>예매 정보</h5>
                    {groupedList.length > 0 ? (
                        groupedList.map((item, index) => (
                            <div key={index} className="payment-item">
                                <img
                                    src={item.poster_path}
                                    alt={item.movieNm}
                                    style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                                />
                                <p> 영화: {item.movieNm}</p>
                                <p> 상영 날짜: {item.screeningDate}</p>
                                <p> 상영 시간: {item.screeningTime}</p>
                                <p> 상영관: {item.theaterName}</p>
                                <p> 좌석 번호: {item.seatNumbers.join(', ')}</p>
                                <p> 가격: {(item.price * item.seatNumbers.length).toLocaleString()} 원</p>
                                <p> 영화관: {item.cinemaName}</p>
                            </div>
                        ))
                    ) : (
                        <p>결제할 항목이 없습니다.</p>
                    )}
                </div>

                <div className="payment-selection">
                    <div className="payment-method-top">
                        <h5>결제수단</h5>
                    </div>
                    <div className="payment-method">
                        <button
                            className={paymentMethod === 'credit_card' ? 'selected' : ''}
                            onClick={() => setPaymentMethod('credit_card')}
                        >
                            신용카드
                        </button>

                        <button
                            className={paymentMethod === 'kakaopay' ? 'selected' : ''}
                            onClick={() => setPaymentMethod('kakaopay')}
                        >
                            카카오페이
                        </button>

                        <button
                            className={paymentMethod === 'tosspay' ? 'selected' : ''}
                            onClick={() => setPaymentMethod('tosspay')}
                        >
                            토스페이
                        </button>

                        <button
                            className={paymentMethod === 'mobile' ? 'selected' : ''}
                            onClick={() => setPaymentMethod('mobile')}
                        >
                            휴대폰
                        </button>
                    </div>
                </div>

                <div className="payment-go">
                    <div className="payment-go-top">
                        <h5>결제하기</h5>
                    </div>
                    <div className="total-price">
                        <h2>결제 금액: {totalPrice.toLocaleString()} 원</h2>
                    </div>
                    <button onClick={paymentGo}>결제하기</button>
                </div>
            </div>
        </div>
    );
};

export default Payment;