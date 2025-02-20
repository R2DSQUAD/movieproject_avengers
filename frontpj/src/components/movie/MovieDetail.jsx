import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LiteYoutubeEmbed } from "react-lite-yt-embed";

const MovieDetail = () => {
  const { movieCd } = useParams();
  const [filteredTrailers, setFilteredTrailers] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/trailerList"
        );
        const trailerData = response.data;

        // id에 해당하는 트레일러 필터링
        const filtered = trailerData.filter(
          (trailer) => trailer.movieEntity.movieCd.toString() === movieCd
        );

        setMovieInfo(filtered[0].movieEntity);
        console.log(filtered[0].movieEntity);
        // 트레일러의 url 값만 추출
        const trailerUrls = filtered.map((trailer) => trailer.url);
        console.log("Trailer URLs:", trailerUrls);

        // 상태 업데이트
        setFilteredTrailers(trailerUrls);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrailers();
  }, [movieCd]);

  return (
    <div className="movieDetail">
      <div className="movieDetail-con">
        <div className="leftBar">
          <div className="leftBar-con">
            <img src={movieInfo.poster_path} alt={movieInfo.movieNm} />
            <div className="movie-info">
              <h4>제목</h4>
              <span>{movieInfo.movieNm}</span>
              <h4>개봉일</h4>
              <span>{movieInfo.openDt}</span>
              <h4>순위</h4>
              <span>{movieInfo.rank}등</span>
              <h4>누적 관객 수</h4>
              <span>{movieInfo.audiAcc}명</span>
            </div>
          </div>
        </div>
        <div className="content">
          <ul>
            {filteredTrailers.map((el, idx) => {
              return (
                <li key={idx} data-id={el.id}>
                  <LiteYoutubeEmbed
                    id={filteredTrailers[idx]}
                    mute={false}
                    params="controls=0&rel=0"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
