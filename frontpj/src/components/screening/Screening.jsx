import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../css/Screening.css";

const Screening = () => {
    const { movieId } = useParams();
    const [screenings, setScreenings] = useState([]);
    const [filteredScreenings, setFilteredScreenings] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedScreening, setSelectedScreening] = useState(null);
    const navigate = useNavigate();

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
        return `${month}/${day} (${dayOfWeek})`;
    };

    useEffect(() => {
        const fetchScreenings = async () => {
            try {
                const response = await axios.get(`http://localhost:8090/api/screening/${movieId}`);
                const today = new Date().toISOString().split("T")[0];

                const upcomingDates = [...new Set(response.data.map(item => item.screeningDate))]
                    .filter(date => date >= today);

                setDates(upcomingDates);
                setScreenings(response.data);

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
                return screeningTime >= now;
            });

        setFilteredScreenings(filtered);
    };


    const handleSelectScreening = (screeningId) => {
        navigate(`/seatSelection/${screeningId}`);
    }

    return (
        <div className="screening-page">

            <div className="left">
                {screenings.length > 0 && screenings[0]?.movieEntity ? (
                    <>
                        <img src={screenings[0].movieEntity.poster_path || ''} alt="영화 포스터" />
                        <div className="content">
                            <h6>{screenings[0].movieEntity.movieNm || '영화 제목 없음'}</h6>
                            <h6>관객수: {screenings[0].movieEntity.audiAcc || 0}명</h6>
                            <h6>개봉일자: {screenings[0].movieEntity.openDt || '개봉일자 없음'}</h6>
                        </div>
                    </>
                ) : (
                    <p>영화 정보가 없습니다.</p>
                )}
            </div>


            <div
                className="right"
                style={{ '--bg-image': `url(${screenings.length > 0 ? screenings[0].movieEntity.backdrop_path : ''})` }}
            >
                <div className="movie-title">
                    <h1>{screenings.length > 0 && screenings[0]?.movieEntity?.movieNm}</h1>
                </div>

                <div className="date_type">
                    <div className="left_date">
                        {dates.map(date => (
                            <button
                                key={date}
                                className={selectedDate === date ? "selected" : ""}
                                onClick={() => {
                                    setSelectedDate(date);
                                    filterScreenings(date);
                                }}
                            >
                                {getFormattedDate(date)}
                            </button>
                        ))}
                    </div>


                    <div className="right_time">
                        {filteredScreenings.length === 0 ? (
                            <p>상영 정보가 없습니다.</p>
                        ) : (
                            <ul>
                                {filteredScreenings.map(screening => (
                                    <li key={screening.id}>
                                        <button
                                            className={selectedScreening === screening.id ? 'selected' : ''}
                                            onClick={() => handleSelectScreening(screening.id)}
                                        >
                                            <span> {screening.theaterEntity.name}</span>
                                            <span> {getFormattedDate(screening.screeningDate)}</span>
                                            <span>{screening.screeningTime} ~ {screening.screeningEndTime}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Screening;