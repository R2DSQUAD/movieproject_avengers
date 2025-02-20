import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [boxOfficeList, setBoxOfficeList] = useState([]);
  const [randomBoxOfficeList, setRandomBoxOfficeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 박스오피스 데이터 가져오기
        const boxOfficeResponse = await axios.get(
          "http://localhost:8090/api/boxOfficeList"
        );
        const boxOfficeData = boxOfficeResponse.data;
        setBoxOfficeList(boxOfficeData);
        console.log("BoxOffice Data:", boxOfficeData);

        // 랜덤 인덱스 선택 후 랜덤 박스오피스 데이터 저장
        const randomIndex = Math.floor(Math.random() * boxOfficeData.length);
        const selectedBoxOffice = boxOfficeData[randomIndex];
        setRandomBoxOfficeList(selectedBoxOffice);       
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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
              누적 관객수: {randomBoxOfficeList.audiAcc}
            </h6>
          </div>
        </div>
        <div className="content">
          <h3>인기 영화</h3>
          <div className="popular-movie">
            <ul>
              {boxOfficeList.map((el, idx) => {
                return (
                  <li key={idx} data-id={el.id}>
                    <div className="item-front">
                      <img src={el.poster_path} alt={el.movieNm}></img>
                      <span className="movie-rank">{el.rank}</span>
                    </div>
                    <div className="item-back">
                      <img src={el.poster_path} alt={el.movieNm}></img>
                      <div className="boxOfficeDetail">
                        <h4>{el.movieNm}</h4>
                        <button onClick={() => navigate(`/screening/${el.id}`)}>
                          예매하기
                        </button>
                        <button onClick={() => navigate(`/movie/detail/${el.movieCd}`)}>
                          상세정보
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Main;
