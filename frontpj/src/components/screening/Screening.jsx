import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../css/Screening.css";
import { useCountUp } from "../../hooks/useCountup";

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
        const response = await axios.get(
          `http://localhost:8090/api/screening/${movieId}`
        );
        console.log("Response data:", response.data); // ✅ 응답 데이터 확인

        const today = new Date().toISOString().split("T")[0];
        const upcomingDates = Array.isArray(response.data)
          ? [
              ...new Set(response.data.map((item) => item.screeningDate)),
            ].filter((date) => date >= today)
          : [];

        setDates(upcomingDates);
        setScreenings(Array.isArray(response.data) ? response.data : []); // ✅ 배열인지 확인

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
      .filter((item) => item.screeningDate === date)
      .filter((item) => {
        const screeningTime = new Date(
          `${item.screeningDate}T${item.screeningTime}`
        );
        return screeningTime >= now;
      });

    setFilteredScreenings(filtered);
  };

  const handleSelectScreening = (screeningId) => {
    navigate(`/seatSelection/${screeningId}`);
  };

  const audiAcc = useCountUp(
    Number(screenings[0]?.movieEntity?.audiAcc) || 0,
    1500
  );

  const backOnclick = () => {
    navigate(-1);
  };

  return (
    <div className="content">
      <div className="screening">
        <div className="screening-con">
          <div className="leftBar">
            <div className="leftBar-con">
              {screenings.length > 0 && screenings[0]?.movieEntity ? (
                <>
                  <img src={screenings[0].movieEntity.poster_path} alt={screenings[0].movieEntity.movieNm} />
                  <div className="movie-info">
                    <h3>제목</h3>
                    <span>{screenings[0].movieEntity.movieNm}</span>
                    <h3>개봉일</h3>
                    <span>{screenings[0].movieEntity.openDt}</span>
                    <h3>순위</h3>
                    <span>{screenings[0].movieEntity.rank}등</span>
                    <h3>누적 관객 수</h3>
                    <span>{audiAcc.toLocaleString("ko-KR")}명</span>
                    <h3>장르</h3>
                    <span>{screenings[0].movieEntity.genre}</span>
                  </div>
                </>
              ) : (
                <p>영화 정보가 없습니다.</p>
              )}
            </div>
          </div>
          <div
            className="screening-content"
          >
            <div className="movie-title">
              <h1>
                {screenings.length > 0 && screenings[0]?.movieEntity?.movieNm}
              </h1>
            </div>

            <div className="date_type">
              <div className="left_date">
                {dates.map((date) => (
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
                    {filteredScreenings.map((screening) => (
                      <li key={screening.id}>
                        <button
                          className={
                            selectedScreening === screening.id ? "selected" : ""
                          }
                          onClick={() => handleSelectScreening(screening.id)}
                        >
                          <span> {screening.theaterEntity.name}</span>
                          <span>
                            {" "}
                            {getFormattedDate(screening.screeningDate)}
                          </span>
                          <span>
                            {screening.screeningTime} ~{" "}
                            {screening.screeningEndTime}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screening;
