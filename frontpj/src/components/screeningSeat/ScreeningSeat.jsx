import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/ScreeningSeat.css";
import jwtAxios from "../../util/jwtUtil";
import { getCookie } from "../../util/cookieUtil";

const ScreeningSeat = () => {
    const { screeningId } = useParams();
    const navigate = useNavigate();
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({ length: 24 }, (_, i) => i + 1);

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [disabledSeats, setDisabledSeats] = useState([]);


    useEffect(() => {
        const memberInfo = getCookie("member"); // 쿠키에서 JWT 가져오기
        if (!memberInfo) { // JWT가 없으면 로그인 페이지로 이동
            alert("로그인이 필요합니다.");
            navigate("/member/login", { replace: true });
            return;
        }
        fetchDisabledSeats();
    }, [screeningId, navigate]);

    const fetchDisabledSeats = async () => {
        try {
            const response = await jwtAxios.get(`http://localhost:8090/api/cart/disabledSeats/${screeningId}`);
            const seats = Array.isArray(response.data) ? response.data : [];
            setDisabledSeats(seats);
        } catch (error) {
            console.error("좌석 정보를 불러오는 중 오류 발생:", error);
            setDisabledSeats([]);
        }
    };

    const toggleSeat = (seatNumber) => {
        if (disabledSeats.includes(seatNumber)) return;
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seatNumber)
                ? prevSelectedSeats.filter((seat) => seat !== seatNumber)
                : [...prevSelectedSeats, seatNumber]
        );
    };

    const getSeatClass = (seatNumber) => {
        if (Array.isArray(disabledSeats) && disabledSeats.includes(seatNumber)) return "seat disabled";
        return selectedSeats.includes(seatNumber) ? "seat selected" : "seat available";
    };

    const cartFn = async () => {
        if (selectedSeats.length === 0) {
            alert("좌석을 선택해주세요");
            return;
        }

        const payload = {
            screeningId: Number(screeningId),
            seats: selectedSeats
        };
        console.log(" Payload to POST:", payload);

        try {
            const response = await jwtAxios.post("http://localhost:8090/api/cart/insert", payload);
            alert(response.data);
            navigate("/cart/myCartList");
        } catch (error) {
            console.error(" POST Error:", error.response?.data);
            alert(error.response?.data || "장바구니 추가 중 오류가 발생했습니다");
        }
    };



    return (
        <div className="seat-selection-page">
            <h1 className="seat-title">좌석 선택 (상영 스케줄: {screeningId})</h1>
            <div className="screen">SCREEN</div>
            <div className="seat-container">
                {rows.map((row) => (
                    <div key={row} className="seat-row">
                        {cols.map((col) => {
                            const seatNumber = `${row}${col}`;
                            return (
                                <div
                                    key={seatNumber}
                                    className={getSeatClass(seatNumber)}
                                    onClick={() => toggleSeat(seatNumber)}
                                >
                                    {seatNumber}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="selected-seats">
                <h2>선택된 좌석</h2>
                {selectedSeats.length > 0 ? (
                    <p>{selectedSeats.join(", ")}</p>
                ) : (
                    <p>선택된 좌석이 없습니다.</p>
                )}
            </div>
            <div className="cart-go">
                <button onClick={cartFn}>장바구니</button>
            </div>
        </div>
    );
};

export default ScreeningSeat;