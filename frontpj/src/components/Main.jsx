import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCountUp } from "../hooks/useCountup";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Main = () => {
  const containerRef = useRef(null);
  const scrollAmount = 500; // 한 번에 스크롤할 픽셀 값
  const [boxOfficeList, setBoxOfficeList] = useState([]);
  const [randomBoxOfficeList, setRandomBoxOfficeList] = useState([]);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // 데이터 fetch 함수
    const fetchData = async () => {
      try {
        const boxOfficeResponse = await axios.get(
          "http://localhost:8090/api/boxOfficeList"
        );
        const boxOfficeData = boxOfficeResponse.data;
        setBoxOfficeList(boxOfficeData);

        const randomIndex = Math.floor(Math.random() * boxOfficeData.length);
        const selectedBoxOffice = boxOfficeData[randomIndex];
        setRandomBoxOfficeList(selectedBoxOffice);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []); // 빈 배열: 마운트 시 한 번 실행

  // audiAcc 값이 없거나 숫자가 아니면 0으로 설정
  const audiAcc = useCountUp(Number(randomBoxOfficeList.audiAcc) || 0, 1500);

  console.log(randomBoxOfficeList);

  return (
    <div className="index">
      <div className="index-con">
        <div className="title">
          <img
            src={randomBoxOfficeList.backdrop_path}
            alt={randomBoxOfficeList.movieNm}
          />
          <div className="title-con">
            <h1 className="movie-title">{randomBoxOfficeList.movieNm}</h1>
            <h4 className="movie-plot">{randomBoxOfficeList.overview}</h4>
            <h6 className="movie-age-rating">연령 등급 (15)</h6>
            <h6 className="movie-people">
              누적 관객수: {audiAcc.toLocaleString("ko-KR")}명
            </h6>
            <h6 className="movie-genres">
              장르: {randomBoxOfficeList.genres}
            </h6>
            <h6 className="movie-director">
              감독: {randomBoxOfficeList.director}
            </h6>

            <div className="movieBtn">
              <button
                onClick={() =>
                  navigate(`/movie/detail/${randomBoxOfficeList.movieCd}`)
                }
              >
                상세정보
              </button>
            </div>
          </div>
        </div>
        <div className="main-content">
          <h3>인기 영화</h3>
          <div className="popular-movie">
            <div className="popular-movie-btn">
              <div className="left" onClick={() => scroll("left")}>
                <ChevronLeft className="w-6 h-6" />
              </div>
            </div>
            <ul ref={containerRef}>
              {boxOfficeList
                .sort((a, b) => a.rank - b.rank)
                .map((el, idx) => (
                  <li key={idx} data-id={el.id}>
                      <div className="item-front">
                        <img src={el.poster_path} alt={el.movieNm} />
                        <span className="movie-rank">{el.rank}</span>
                      </div>
                      <div className="item-back">
                        <img src={el.poster_path} alt={el.movieNm} />
                        <div className="boxOfficeDetail">
                          <h4>{el.movieNm}</h4>
                          <button
                            onClick={() => navigate(`/screening/${el.id}`)}
                          >
                            예매하기
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/movie/detail/${el.movieCd}`)
                            }
                          >
                            상세정보
                          </button>
                        </div>
                      </div>
                  </li>
                ))}
            </ul>
            <div className="popular-movie-btn">
              <div className="right" onClick={() => scroll("right")}>
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
