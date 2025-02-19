import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/Screening.css";

const Screening = () => {
    const { movieId } = useParams();
    const [screenings, setScreenings] = useState([]);
    const [filteredScreenings, setFilteredScreenings] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const fetchScreenings = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/screening/${movieId}`);
                const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식의 오늘 날짜

                // 과거 날짜 필터링
                const upcomingDates = [...new Set(response.data.map(item => item.screeningDate))]
                    .filter(date => date >= today);

                setDates(upcomingDates);
                setScreenings(response.data);

                // 기본 선택 날짜 설정 (오늘 날짜 또는 가장 가까운 날짜)
                if (upcomingDates.length > 0) {
                    setSelectedDate(upcomingDates[0]);
                    filterScreenings(upcomingDates[0], response.data);
                }
            } catch (error) {
                console.error("Error fetching screening data:", error);
            }
        };
        fetchScreenings();
    }, [movieId]);

    const filterScreenings = (date, allScreenings = screenings) => {
        const now = new Date();
        const filtered = allScreenings
            .filter(item => item.screeningDate === date)
            .filter(item => {
                const screeningTime = new Date(`${item.screeningDate}T${item.screeningTime}`);
                return screeningTime >= now; // 현재 시간 이후의 상영 정보만 필터링
            });

        setFilteredScreenings(filtered);
    };

    return (
        <div className="screening-page">
            <h2>상영 정보</h2>

            {/* 날짜 선택 버튼 */}
            <div className="date-selector">
                {dates.map(date => (
                    <button
                        key={date}
                        className={selectedDate === date ? "selected" : ""}
                        onClick={() => {
                            setSelectedDate(date);
                            filterScreenings(date);
                        }}
                    >
                        {date}
                    </button>
                ))}
            </div>

            {/* 상영 정보 표시 */}
            {filteredScreenings.length === 0 ? (
                <p>상영 정보가 없습니다.</p>
            ) : (
                <ul>
                    {filteredScreenings.map(screening => (
                        <li key={screening.id}>
                            <p>상영관: {screening.theaterEntity.name}</p>
                            <p>날짜: {screening.screeningDate}</p>
                            <p>시간: {screening.screeningTime} ~ {screening.screeningEndTime}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Screening;
