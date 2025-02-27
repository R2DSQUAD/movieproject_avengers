import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jwtAxios from '../../util/jwtUtil';
import '../../css/Payment.css'

const Payment = () => {
    const [paymentItems, setPaymentItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaymentItems = async () => {
            try {
                const response = await jwtAxios.get('http://localhost:8090/api/payment/orderSettlement');
                setPaymentItems(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPaymentItems();
    }, []);

    // 영화, 상영 날짜, 상영 시간을 기준으로 그룹화 -> 좌석번호만 다를경우 같이 묶음
    const groupedItems = paymentItems.reduce((acc, item) => {
        const key = `${item.movieNm}-${item.screeningDate}-${item.screeningTime}`;
        if (!acc[key]) {
            acc[key] = {
                movieNm: item.movieNm,
                screeningDate: item.screeningDate,
                screeningTime: item.screeningTime,
                theaterName: item.theaterName,
                poster_path: item.poster_path,
                seats: [],
                totalPrice: 0
            };
        }
        acc[key].seats.push(item.seatNumber);
        acc[key].totalPrice += item.price;
        return acc;
    }, {});

    const totalPrice = Object.values(groupedItems).reduce((acc, group) => acc + group.totalPrice, 0);


    const paymentGo = () => {
        if (!paymentMethod) {
            alert('결제수단을 선택하세요')
            return
        }

        alert(`결제 진행: ${paymentMethod}`);  //카카오페이만 허용
        navigate("/")  //아직 안만듦

    }

    return (
        <>
            <h1>결제 페이지</h1>
            <div className="payment">
                <div className="payment-con">
                    <div className="reservation">
                        <div className="reservation-info-top">
                            <h5>예매정보</h5>
                        </div>
                        <div className="reservation-info">
                            <ul>
                                {Object.values(groupedItems).length > 0 ? (
                                    Object.values(groupedItems).map((group, index) => (
                                        <li key={index}>
                                            <img src={group.poster_path} alt={group.movieNm} style={{ width: '100px', height: 'auto', borderRadius: '5px' }} />
                                            <p>영화: {group.movieNm}</p>
                                            <p>상영 날짜: {group.screeningDate}</p>
                                            <p>상영 시간: {group.screeningTime}</p>
                                            <p>상영관: {group.theaterName}</p>
                                            <p>좌석 번호: {group.seats.join(', ')}</p>
                                            <p>총 가격: {group.totalPrice.toLocaleString()}원</p>
                                        </li>
                                    ))
                                ) : (
                                    <p>예매된 내역이 없습니다.</p>
                                )}
                            </ul>
                        </div>
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
                            <h2>결제 금액:{totalPrice.toLocaleString()} 원</h2>
                        </div>
                        <button onClick={paymentGo}>결제하기</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Payment