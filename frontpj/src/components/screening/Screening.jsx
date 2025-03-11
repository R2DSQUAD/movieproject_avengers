import React, { useEffect, useState, useRef } from "react";
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
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showCinemas, setShowCinemas] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const navigate = useNavigate();

  const regionOrder = [
    "서울",
    "경기",
    "인천",
    "강원",
    "대전/충청/세종",
    "대구/경상",
    "광주/전라",
    "부산",
    "제주",
  ];

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
  };

  // 이전 선택값을 저장하는 ref
  const prevSelectedRegionRef = useRef(selectedRegion);
  const prevSelectedCinemaRef = useRef(selectedCinema);

  useEffect(() => {
    const fetchDataAndFilter = async () => {
      // 데이터는 한 번만 패칭
      if (!dataFetched) {
        try {
          const response = await axios.get(
            `http://localhost:8090/api/screening/${movieId}`
          );
          const screeningData = Array.isArray(response.data)
            ? response.data
            : [];

          const today = new Date().toISOString().split("T")[0];
          const upcomingDates = [
            ...new Set(screeningData.map((item) => item.screeningDate)),
          ].filter((date) => date >= today);

          setAllDates(upcomingDates);
          setScreenings(screeningData);

          // 지역(영화) 목록 정렬
          const regionList = [
            ...new Set(
              screeningData.map(
                (item) => item.theaterEntity.cinemaEntity.region
              )
            ),
          ];
          const sortedRegions = regionOrder.filter((region) =>
            regionList.includes(region)
          );

          setRegions(sortedRegions);
          if (sortedRegions.length > 0 && !selectedRegion) {
            setSelectedRegion(sortedRegions[0]);
            setShowCinemas(true);
          }

          setDataFetched(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }

      // 필터링 로직
      if (selectedRegion && screenings.length > 0) {
        // 지역이 바뀌었을 때만 초기화
        if (prevSelectedRegionRef.current !== selectedRegion) {
          setSelectedCinema("");
          setSelectedDate("");
          setFilteredScreenings([]);
          prevSelectedRegionRef.current = selectedRegion;
        }

        const filteredCinemas = [
          ...new Set(
            screenings
              .filter(
                (item) =>
                  item.theaterEntity.cinemaEntity.region === selectedRegion
              )
              .map((item) => item.theaterEntity.cinemaEntity.cinemaName)
          ),
        ];
        setCinemas(filteredCinemas);
        setShowCinemas(true);
        setShowDates(false);
        setShowTimes(false);
      }

      if (selectedCinema && screenings.length > 0) {
        // 영화관이 바뀌었을 때만 초기화
        if (prevSelectedCinemaRef.current !== selectedCinema) {
          setSelectedDate("");
          setFilteredScreenings([]);
          prevSelectedCinemaRef.current = selectedCinema;
        }

        const cinemaDates = [
          ...new Set(
            screenings
              .filter(
                (item) =>
                  item.theaterEntity.cinemaEntity.cinemaName === selectedCinema
              )
              .map((item) => item.screeningDate)
          ),
        ].filter((date) => allDates.includes(date));

        setDates(cinemaDates);
        setShowDates(true);
        setShowTimes(false);
      }

      if (selectedDate && selectedCinema && screenings.length > 0) {
        const now = new Date();
        const filtered = screenings
          .filter((item) => item.screeningDate === selectedDate)
          .filter(
            (item) =>
              item.theaterEntity.cinemaEntity.cinemaName === selectedCinema
          )
          .filter((item) => {
            const screeningTime = new Date(
              `${item.screeningDate}T${item.screeningTime}`
            );
            return screeningTime >= now;
          });

        setFilteredScreenings(filtered);
        setShowTimes(true);
      }
    };

    // 의존성: movieId, selectedRegion, selectedCinema, selectedDate, dataFetched
    fetchDataAndFilter();
  }, [movieId, selectedRegion, selectedCinema, selectedDate, dataFetched]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };
  const handleCinemaClick = (cinema) => {
    setSelectedCinema(cinema);
  };
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  const handleSelectScreening = (screeningId) => {
    setSelectedScreening(screeningId);
    navigate(`/seatSelection/${screeningId}`, {
      state: { movieEntity: screenings[0]?.movieEntity },
    });
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
                    className="poster"
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
         

          {/* 4개 컬럼 레이아웃 */}
          <div className="screening-content">
            <div className="date_type">
              {/* 지역(Region) */}
              <div className="region_select">
                <h2>지역</h2>
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

              {/* (Cinema) */}
              <div className="cinema_select">
                <h2>영화관</h2>
                {showCinemas ? (
                  cinemas.map((cinema) => (
                    <button
                      key={cinema}
                      className={selectedCinema === cinema ? "selected" : ""}
                      onClick={() => handleCinemaClick(cinema)}
                    >
                      {cinema}
                    </button>
                  ))
                ) : (
                  <p>영화관을 선택하세요.</p>
                )}
              </div>

              {/* 날짜(Date) */}
              <div className="date_select">
                <h2>날짜</h2>
                {showDates ? (
                  dates.length > 0 ? (
                    dates.map((date) => (
                      <button
                        key={date}
                        className={selectedDate === date ? "selected" : ""}
                        onClick={() => handleDateClick(date)}
                      >
                        {getFormattedDate(date)}
                      </button>
                    ))
                  ) : (
                    <p>상영날짜가 없습니다.</p>
                  )
                ) : (
                  <p>날짜를 선택하세요.</p>
                )}
              </div>

              {/* 시간(Time) */}
              <div className="time_select">
                <h2>시간</h2>
                {showTimes ? (
                  filteredScreenings.length === 0 ? (
                    <p>상영 정보가 없습니다.</p>
                  ) : (
                    <ul>
                      {filteredScreenings.map((screening) => (
                        <li key={screening.id}>
                          <button
                            className={
                              selectedScreening === screening.id
                                ? "selected"
                                : ""
                            }
                            onClick={() => handleSelectScreening(screening.id)}
                          >
                            <span>{screening.theaterEntity.name}</span>
                            <span>{getFormattedDate(screening.screeningDate)}</span>
                            <span>
                              {screening.screeningTime} ~ {screening.screeningEndTime}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <p>시간을 선택하세요.</p>
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
