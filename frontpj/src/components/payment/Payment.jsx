import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwtAxios from '../../util/jwtUtil';
import '../../css/Payment.css';

const Payment = () => {
    const [paymentItems, setPaymentItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const cartItemIds = location.state?.cartItemIds || [];

    console.log("전달된 cartItemIds:", cartItemIds);

    useEffect(() => {
        const fetchPaymentItems = async () => {
            try {
                const response = await jwtAxios.post(
                    "http://localhost:8090/api/payment/orderSettlement",
                    cartItemIds,
                    { withCredentials: true }
                );
                console.log("결제 정보:", response.data);
                setPaymentItems(response.data);
            } catch (error) {
                console.error(" 결제 정보 가져오기 오류:", error);
            }
        };

        if (cartItemIds.length > 0) {
            fetchPaymentItems();
        }
    }, [cartItemIds]);

    const paymentGo = () => {
        if (!paymentMethod) {
            alert('결제수단을 선택하세요')
            return
        }

        alert(`결제 진행: ${paymentMethod}`);  //카카오페이만 허용
        navigate("/")  //아직 안만듦

    }


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
                            className={paymentMethod === 'kakao_pay' ? 'selected' : ''}
                            onClick={() => setPaymentMethod('kakao_pay')}
                        >
                            카카오페이
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
