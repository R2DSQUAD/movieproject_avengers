import React, { useEffect, useState } from "react";
import jwtAxios from "../../util/jwtUtil";
import "../../css/Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await jwtAxios.get(
          "http://localhost:8090/api/cart/myCartList"
        );
        console.log("API 응답:", response.data);
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("장바구니 불러오기 오류:", err);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      return newSelectedItems;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set()); // 모든 선택 해제
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id))); // 전체 선택
    }
  };

  const handleDelete = async () => {
    if (selectedItems.size === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    try {
      const response = await jwtAxios.delete(
        "http://localhost:8090/api/cart/delete",
        {
          data: { ids: Array.from(selectedItems) },
        }
      );
      alert(response.data);

      setCartItems((prev) =>
        prev.filter((item) => !selectedItems.has(item.id))
      );
      setSelectedItems(new Set());
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const paymentFn = () => {
    if (selectedItems.size === 0) {
      alert("결제할 티켓을 선택하세요.");
      return;
    }

    const selectedCartItemIds = Array.from(selectedItems); // 선택된 ID 배열

    console.log("선택된 장바구니 ID:", selectedCartItemIds); // 디버깅용 콘솔 로그 추가

    // 선택한 항목 ID만 Payment 페이지로 전달
    navigate("/payment/orderSettlement", {
      state: { cartItemIds: selectedCartItemIds },
    });
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.has(item.id)) // 선택된 항목만 계산
    .reduce((acc, item) => acc + item.price, 0);

  const allSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;

  return (
    <div className="cart">
      <div className="cart-con">
        <h1>내 장바구니 리스트</h1>
        {error && <div style={{ color: "var(--color-red)" }}>{error}</div>}
        {cartItems.length > 0 ? (
          <>
            <div className="select-all">
              <span>{allSelected ? "전체선택해제" : "전체선택"}</span>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
              />
            </div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className={`cart-container ${selectedItems.has(item.id) ? "active" : ""}`}
              >
                <div className="cart-item">
                  <img
                    src={item.poster_path}
                    alt={item.movieNm}
                    style={{
                      width: "100px",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  />
                  <div className="cart-item-info">
                    <span>좌석 번호: {item.seatNumber}</span>
                    <span>가격: {item.price.toLocaleString()}원</span>
                    <span>상영 날짜: {item.screeningDate}</span>
                    <span>상영 시간: {item.screeningTime}</span>
                    <span>상영관: {item.theaterName}</span>
                    <span>영화: {item.movieNm}</span>
                    <span>영화관: {item.cinemaName}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </div>
            ))}
            <div className="cart-footer">
              <h2>총 가격: {totalPrice.toLocaleString()}원</h2>
              <div className="button-container">
                <button onClick={handleDelete}>선택 삭제</button>
                <button onClick={paymentFn}>결제하기</button>
              </div>
            </div>
          </>
        ) : (
          <span>장바구니에 담긴 항목이 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default Cart;
