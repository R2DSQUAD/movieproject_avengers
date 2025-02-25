import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/ScreeningSeat.css";
import jwtAxios from "../../util/jwtUtil";

const ScreeningSeat = () => {
    const { screeningId } = useParams();
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = Array.from({ length: 24 }, (_, i) => i + 1);

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [disabledSeats, setDisabledSeats] = useState([]);

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


    useEffect(() => {
        fetchDisabledSeats();
    }, [screeningId]);

    // 좌석 클릭 시 선택/해제
    const toggleSeat = (seatNumber) => {
        if (disabledSeats.includes(seatNumber)) return; // 이미 선택된 좌석은 클릭 불가
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


    const cartFn = () => {

    }

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