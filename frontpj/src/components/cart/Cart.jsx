import React, { useEffect, useState } from 'react';
import jwtAxios from '../../util/jwtUtil';
import "../../css/Cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
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

    //체크박스 선택 및 해제
    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) => {
            const newSelectedItems = new Set(prev);
            if (newSelectedItems.has(id)) {
                newSelectedItems.delete(id)
            } else {
                newSelectedItems.add(id)
            }
            return newSelectedItems;
        })
    }

    const handleDelete = async () => {
        if (selectedItems.size === 0) {
            alert('삭제할 항목을 선택하세요.')
            return;
        }

        try {
            const response = await jwtAxios.delete('http://localhost:8090/api/cart/delete', {
                data: { ids: Array.from(selectedItems) }
            })
            alert(response.data)

            setCartItems((prev) => prev.filter((item) => !selectedItems.has(item.id)))
            setSelectedItems(new Set());
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');

        }
    }


    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

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
                                    <input type="checkbox"
                                        checked={selectedItems.has(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)} />
                                    <p>좌석 번호: {item.seatNumber}</p>
                                    <p>가격: {item.price.toLocaleString()}원</p>
                                    <p>상영 날짜: {item.screeningDate}</p>
                                    <p>상영 시간: {item.screeningTime}</p>
                                    <p>상영관: {item.theaterName}</p>
                                    <p>영화: {item.movieNm}</p>
                                </div>
                            ))}
                            <button onClick={handleDelete}>선택 삭제</button>
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