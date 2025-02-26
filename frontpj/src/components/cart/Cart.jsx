import React, { useEffect, useState } from 'react';
import jwtAxios from '../../util/jwtUtil';
import "../../css/Cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await jwtAxios.get('http://localhost:8090/api/cart/myCartList');
                console.log('API 응답:', response.data);
                setCartItems(response.data);
            } catch (err) {
                setError('장바구니를 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchCartItems();
    }, []);


    const totalPrice = cartItems.length > 0 ? cartItems[0].totalPrice : 0;

    return (
        <>
            <h1>내 장바구니 리스트</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="cart">
                <div className="cart-con">
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <p>좌석 번호: {item.seatNumber}</p>
                                    <p>가격: {item.price.toLocaleString()}원</p>
                                    <p>상영 날짜: {item.screeningDate}</p>
                                    <p>상영 시간: {item.screeningTime}</p>
                                    <p>상영관: {item.theaterName}</p>
                                    <p>영화: {item.movieNm}</p>
                                </div>
                            ))}
                            <div className="total-price">
                                <h2>총 가격: {totalPrice.toLocaleString()}원</h2>
                            </div>
                        </>
                    ) : (
                        <p>장바구니에 담긴 항목이 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;
