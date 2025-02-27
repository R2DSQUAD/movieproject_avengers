import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../css/ScreeningSeat.css";
import jwtAxios from "../../util/jwtUtil";
import { getCookie } from "../../util/cookieUtil";

const ScreeningSeat = () => {
  const location = useLocation();
  const [movieEntity, setMovieEntity] = useState(location.state?.movieEntity || null);
  const { screeningId } = useParams();
  const navigate = useNavigate();
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = Array.from({ length: 24 }, (_, i) => i + 1);

  const [screening, setScreening] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState([]);


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

  const fetchScreeningInfo = async () => {
    try {
      const response = await jwtAxios.get(
        `http://localhost:8090/api/screening/info/${screeningId}`
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
        `http://localhost:8090/api/cart/disabledSeats/${screeningId}`
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
        "http://localhost:8090/api/cart/insert",
        payload
      );
      alert(response.data);
      navigate("/cart/myCartList");
    } catch (error) {
      console.error(" POST Error:", error.response?.data);
      alert(error.response?.data || "장바구니 추가 중 오류가 발생했습니다");
    }
  };

  console.log(movieEntity);

  return (
    <div className="content">
      <div className="main">
        <div className="main-con">
          <div className="leftBar">
            <div className="leftBar-con">
                <img
                  src={movieEntity.poster_path}
                  alt={movieEntity.movieNm}
                />
                <div className="movie-info">
                  <h3>제목</h3>
                  <span>{movieEntity.movieNm}</span>
                  <h3>개봉일</h3>
                  <span>{movieEntity.openDt}</span>
                  <h3>순위</h3>
                  <span>{movieEntity.rank}등</span>
                  <h3>누적 관객 수</h3>
                  {/* <span>{movieEntity.audiAcc.toLocaleString("ko-KR")}명</span> */}
                  <h3>장르</h3>
                  {/* <span>{screening.movieEntity.genre}</span>  아직 데이터 없음*/}
                </div>
            </div>
          </div>
          <div className="screening-content">
            <div className="movie-title">
              <h1>
                {movieEntity.movieNm}
              </h1>
            </div>
            <div className="seat-selection-con">
              <h1 className="seat-title">좌석 선택 (상영 스케줄: {screeningId})</h1>
              <div className="screen">SCREEN</div>
              <div className="seat-container">
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
    </div>
  );
};

export default ScreeningSeat;
