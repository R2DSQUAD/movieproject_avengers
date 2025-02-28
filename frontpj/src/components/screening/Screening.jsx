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
  const [allDates, setAllDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [cinemas, setCinemas] = useState([]); // 영화관 목록
  const [selectedCinema, setSelectedCinema] = useState(""); // 선택된 영화관
  const [regions, setRegions] = useState([]); // 추가된 부분
  const [selectedRegion, setSelectedRegion] = useState(""); // 추가된 부분
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

        const today = new Date().toISOString().split("T")[0];
        const upcomingDates = Array.isArray(response.data)
          ? [...new Set(response.data.map((item) => item.screeningDate))].filter(
              (date) => date >= today
            )
          : [];
        setAllDates(upcomingDates); // 모든 날짜 저장

        setScreenings(Array.isArray(response.data) ? response.data : []); // 배열인지 확인

        // 영화관 목록을 추출합니다.
        const cinemaList = [
          ...new Set(
            Array.isArray(response.data)
              ? response.data.map(
                  (item) => item.theaterEntity.cinemaEntity.cinemaName
                )
              : []
          ),
        ];
        setCinemas(cinemaList);
        //지역목록 추출
        const regionList = [
          ...new Set(
            Array.isArray(response.data)
              ? response.data.map(
                  (item) => item.theaterEntity.cinemaEntity.region
                )
              : []
          ),
        ];
        setRegions(regionList);

        // 초기 선택된 지역을 설정합니다.
        if (regionList.length > 0) {
          setSelectedRegion(regionList[0]);
        }
        // 초기값 설정
         if(upcomingDates.length > 0 && cinemaList.length > 0){
          setSelectedDate(upcomingDates[0]);
          setSelectedCinema(cinemaList[0]);
        }
      } catch (error) {
        console.error("Error fetching screening data:", error);
      }
    };
    fetchScreenings();
  }, [movieId]);

  useEffect(() => {
    if (selectedRegion && screenings.length > 0) {
      filterCinemasByRegion(selectedRegion);
    }
  }, [selectedRegion, screenings]);

  const filterCinemasByRegion = (region) => {
    const filteredCinemas = [
      ...new Set(
        screenings
          .filter(
            (item) => item.theaterEntity.cinemaEntity.region === region
          )
          .map((item) => item.theaterEntity.cinemaEntity.cinemaName)
      ),
    ];
    setCinemas(filteredCinemas);
      if(filteredCinemas.length > 0){
        setSelectedCinema(filteredCinemas[0]);
      }
  };

  useEffect(() => {
    if (selectedDate && selectedCinema) {
      filterScreenings(selectedDate, selectedCinema);
    }
  }, [selectedDate, selectedCinema, screenings]);

  const filterScreenings = (date, cinema) => {
    const now = new Date();
    const filtered = screenings
      .filter((item) => item.screeningDate === date)
      .filter((item) => item.theaterEntity.cinemaEntity.cinemaName === cinema)
      .filter((item) => {
        const screeningTime = new Date(
          `${item.screeningDate}T${item.screeningTime}`
        );
        return screeningTime >= now;
      });
    // 필터링된 결과가 없을 경우, 이전의 필터링 된 값으로 대체
    setFilteredScreenings(filtered.length > 0 ? filtered : filteredScreenings);
  };

  const handleSelectScreening = (screeningId) => {
    navigate(`/seatSelection/${screeningId}`, {
      state: { movieEntity: screenings[0]?.movieEntity },
    });
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };
    const handleCinemaClick = (cinema) => {
        setSelectedCinema(cinema);
        // 선택된 영화관에 맞는 날짜 필터링
        const cinemaDates = [
            ...new Set(
                screenings
                    .filter((item) => item.theaterEntity.cinemaEntity.cinemaName === cinema)
                    .map((item) => item.screeningDate)
            ),
        ].filter((date) => allDates.includes(date)) ;
        setDates(cinemaDates);
        setSelectedDate(cinemaDates[0]);//첫번째 날짜로 설정
    };

  const audiAcc = useCountUp(
    Number(screenings[0]?.movieEntity?.audiAcc) || 0,
    1500
  );

  return (
    <div className="content">
      <div className="main">
        <div className="main-con">
          <div className="leftBar">
            <div className="leftBar-con">
              {screenings.length > 0 && screenings[0]?.movieEntity ? (
                <>
                  <img
                    src={screenings[0].movieEntity.poster_path}
                    alt={screenings[0].movieEntity.movieNm}
                  />
                  <div className="movie-info">
                    <div>
                      <h3>제목</h3>
                      <span>{screenings[0].movieEntity.movieNm}</span>
                    </div>
                    <div>
                      <h3>개봉일</h3>
                      <span>{screenings[0].movieEntity.openDt}</span>
                    </div>
                    <div>
                      <h3>순위</h3>
                      <span>{screenings[0].movieEntity.rank}등</span>
                    </div>
                    <div>
                      <h3>누적 관객 수</h3>
                      <span>{audiAcc.toLocaleString("ko-KR")}명</span>
                    </div>
                    <div>
                      <h3>장르</h3>
                      <span>{screenings[0].movieEntity.genres}</span>
                    </div>
                    <div>
                      <h3>감독</h3>
                      <span>{screenings[0].movieEntity.director}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p>영화 정보가 없습니다.</p>
              )}
            </div>
          </div>
          <div className="screening-content">
            <div className="movie-title">
              <h1>
                {screenings.length > 0 && screenings[0]?.movieEntity?.movieNm}
              </h1>
            </div>

            <div className="date_type">
              <div className="region_select">
                {regions.map((region) => (
                  <button
                    key={region}
                    className={selectedRegion === region ? "selected" : ""}
                    onClick={() => handleRegionClick(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
              <div className="cinema_select">
                {cinemas.map((cinema) => (
                  <button
                    key={cinema}
                    className={selectedCinema === cinema ? "selected" : ""}
                    onClick={() => handleCinemaClick(cinema)}
                  >
                    {cinema}
                  </button>
                ))}
              </div>
              <div className="left_date">
                {dates.map((date) => (
                  <button
                    key={date}
                    className={selectedDate === date ? "selected" : ""}
                    onClick={() => {
                      setSelectedDate(date);
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
