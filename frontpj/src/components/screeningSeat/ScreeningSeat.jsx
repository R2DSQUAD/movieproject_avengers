import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../css/ScreeningSeat.css";
import jwtAxios from "../../util/jwtUtil";
import { getCookie } from "../../util/cookieUtil";

const ScreeningSeat = () => {
  const [scale, setScale] = useState(1);
  const location = useLocation();
  const [movieEntity, setMovieEntity] = useState(
    location.state?.movieEntity || null
  );
  const { screeningId } = useParams();
  const navigate = useNavigate();
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = Array.from({ length: 24 }, (_, i) => i + 1);

  const [screening, setScreening] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);
  const seatContainerRef = useRef(null);

  useEffect(() => {
    const memberInfo = getCookie("member");
    if (!memberInfo) {
      alert("로그인이 필요합니다.");
      navigate("/member/login", { replace: true });
      return;
    }
    fetchScreeningInfo();
    fetchDisabledSeats();
  }, [screeningId, navigate]);

  useEffect(() => {
    if (isMobile && seatContainerRef.current) {
      seatContainerRef.current.scrollLeft = 0; // 초기 스크롤 위치를 0으로 설정
    }
  }, [isMobile]);

  const fetchScreeningInfo = async () => {
    try {
      const response = await jwtAxios.get(
        `http://43.201.20.172:8090/api/screening/info/${screeningId}`
      );
      setScreening(response.data);
      console.log("Screening info:", response.data);
    } catch (error) {
      console.error("상영 정보를 불러오는 중 오류 발생:", error);
      setScreening(null);
    }
  };

  const fetchDisabledSeats = async () => {
    try {
      const response = await jwtAxios.get(
        `http://43.201.20.172:8090/api/cart/disabledSeats/${screeningId}`
      );
      const seats = Array.isArray(response.data) ? response.data : [];
      console.log("Disabled seats:", seats);
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
    if (Array.isArray(disabledSeats) && disabledSeats.includes(seatNumber))
      return "seat disabled";
    return selectedSeats.includes(seatNumber)
      ? "seat selected"
      : "seat available";
  };

  const cartFn = async () => {
    if (selectedSeats.length === 0) {
      alert("좌석을 선택해주세요");
      return;
    }

    const payload = {
      screeningId: Number(screeningId),
      seats: selectedSeats,
    };
    console.log(" Payload to POST:", payload);

    try {
      const response = await jwtAxios.post(
        "http://43.201.20.172:8090/api/cart/insert",
        payload
      );
      alert(response.data);
      navigate("/cart/myCartList");
    } catch (error) {
      console.error(" POST Error:", error.response?.data);
      alert(error.response?.data || "장바구니 추가 중 오류가 발생했습니다");
    }
  };

  const audiAcc = Number(movieEntity?.audiAcc) || 0;

  return (
    <div className="content">
      <div className="main">
        <div className="main-con">
          <div className="leftBar">
            <div className="leftBar-con">
              <img
                src={movieEntity.poster_path}
                alt={movieEntity.movieNm}
                className="poster"
              />

              <div className="movie-info">
                <div>
                  <h3>제목</h3>
                  <span>{movieEntity.movieNm}</span>
                </div>
                <div>
                  <h3>개봉일</h3>
                  <span>{movieEntity.openDt}</span>
                </div>
                <div>
                  <h3>순위</h3>
                  <span>{movieEntity.rank}등</span>
                </div>
                <div>
                  <h3>누적 관객 수</h3>
                  <span>{audiAcc.toLocaleString("ko-KR")}명</span>
                </div>
                <div>
                  <h3>장르</h3>
                  <span>{movieEntity.genres}</span>
                </div>
                <div>
                  <h3>감독</h3>
                  <span>{movieEntity.director}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="screening-content">
            <div className="movie-title">
              <h1>{movieEntity.movieNm}</h1>
            </div>

            {!isMobile && (
              <div className="seat-selection-con">
                <h1 className="seat-title">
                  좌석 선택 (영화관:{" "}
                  {screening?.theaterEntity?.cinemaEntity?.cinemaName} / 상영관:{" "}
                  {screening?.theaterEntity?.name}) / 상영 날짜/시간:{" "}
                  {screening?.screeningDate} {screening?.screeningTime}
                </h1>
                <div className="screen">SCREEN</div>
                <div className="seat-container" ref={seatContainerRef}>
                  {rows.map((row) => (
                    <div className="row">
                      <span>{row}</span>
                      <div key={row} className="seat-row">
                        {cols.map((col) => {
                          const seatNumber = `${row}${col}`;
                          return (
                            <>
                              <div
                                key={seatNumber}
                                className={getSeatClass(seatNumber)}
                                onClick={() => toggleSeat(seatNumber)}
                              >
                                {col}
                              </div>
                            </>
                          );
                        })}
                      </div>
                      <span>{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isMobile && (
                <div
                  className="seat-selection-con"
                >
                  <h1 className="seat-title">
                    좌석 선택 (영화관:{" "}
                    {screening?.theaterEntity?.cinemaEntity?.cinemaName} /
                    상영관: {screening?.theaterEntity?.name}) / 상영 날짜/시간:{" "}
                    {screening?.screeningDate} {screening?.screeningTime}
                  </h1>
                  <div className="screen">SCREEN</div>
                  <div className="seat-container" ref={seatContainerRef}>
                    {rows.map((row) => (
                      <div className="row">
                        <div key={row} className="seat-row">
                          {cols.map((col) => {
                            const seatNumber = `${row}${col}`;
                            return (
                              <>
                                <div
                                  key={seatNumber}
                                  className={getSeatClass(seatNumber)}
                                  onClick={() => toggleSeat(seatNumber)}
                                >
                                  {col}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default ScreeningSeat;