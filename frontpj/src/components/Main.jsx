import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Main = () => {
  const [boxOfficeList, setBoxOfficeList] = useState([]);
  const [RandomBoxOfficeList, setRandomBoxOfficeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/boxOfficeList`
        );
        setBoxOfficeList(response.data);
        console.log(response.data);

        const randomIndex = Math.floor(Math.random() * response.data.length);
        setRandomBoxOfficeList(response.data[randomIndex]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    return () => {};
  }, []);

  return (
    <div className="index">
      <div className="index-con">
        <div className="title">
          <img
            src={RandomBoxOfficeList.backdrop_path}
            alt={RandomBoxOfficeList.movieNm}
          />
          <div className="title-con">
            <h1 className="movie-title">{RandomBoxOfficeList.movieNm}</h1>
            <h4 className="movie-plot">{RandomBoxOfficeList.overview}</h4>
            <h6 className="movie-age-rating">연령 등급 (15)</h6>
            <h6 className="movie-people">누적 관객수</h6>
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
                        <button onClick={() => navigate(`/screening/${el.id}`)}>예매하기</button>
                        <Link to="/">상세정보</Link>
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
