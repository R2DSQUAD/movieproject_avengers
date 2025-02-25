import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LiteYoutubeEmbed } from "react-lite-yt-embed";
import { useCountUp } from "../../hooks/useCountup";

const MovieDetail = () => {
  const navigate = useNavigate();
  const { movieCd } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});
  const [selectedTrailerId, setSelectedTrailerId] = useState(null); // 클릭된 영상 ID 상태 관리

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8090/api/trailerList"
        );
        const trailerData = response.data;

        // ID에 해당하는 트레일러 필터링
        const filtered = trailerData.filter(
          (trailer) => trailer.movieEntity.movieCd.toString() === movieCd
        );

        setMovieInfo(filtered[0]?.movieEntity || {});
        setTrailers(filtered);

        const dataCount = filtered.length; // 예: 데이터 개수가 10이라면
        const gridContainer = document.querySelector(".thumbnailImg");
        gridContainer.style.gridTemplateColumns = `repeat(${dataCount}, 1fr)`;

        // 첫 번째 트레일러를 기본적으로 선택
        if (filtered.length > 0) {
          setSelectedTrailerId(filtered[0].url);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [movieCd]); // ✅ movieCd 변경 시 실행

  // 썸네일 클릭 시 해당 ID를 상태에 저장
  const handleThumbnailClick = (id) => {
    setSelectedTrailerId(id);
  };

  const audiAcc = useCountUp(
    Number(movieInfo.audiAcc) || 0, // 숫자가 아니면 0 사용
    1500
  );

  return (
    <div className="content">
      <div className="movieDetail">
        <div className="movieDetail-con">
          <div className="leftBar">
            <div className="leftBar-con">
              <img src={movieInfo.poster_path} alt={movieInfo.movieNm} />
              <div className="movie-info">
                <h3>제목</h3>
                <span>{movieInfo.movieNm}</span>
                <h3>개봉일</h3>
                <span>{movieInfo.openDt}</span>
                <h3>순위</h3>
                <span>{movieInfo.rank}등</span>
                <h3>누적 관객 수</h3>
                <span>{audiAcc.toLocaleString("ko-KR")}명</span>
                <h3>장르</h3>
                <span>{movieInfo.genre}</span>
                <button onClick={() => navigate(`/screening/${movieInfo.id}`)}>
                  예매하기
                </button>
              </div>
            </div>
          </div>

          <div className="content">
            <span>줄거리</span>
            <p>{movieInfo.overview}</p>
            {/* 상단에 고정된 영상 플레이어 */}
            {selectedTrailerId && (
              <div className="video-container">
                <LiteYoutubeEmbed
                  key={selectedTrailerId} // key 추가
                  id={selectedTrailerId}
                  mute={false}
                  params="controls=1&rel=0"
                />
              </div>
            )}
            {/* 썸네일들 */}
            <ul className="thumbnailImg">
              {trailers.map((el, idx) => (
                <li className="thumbnailImg-con" key={idx}>
                  <img
                    key={idx}
                    src={`https://img.youtube.com/vi/${el.url}/hqdefault.jpg`}
                    alt={el.name}
                    onClick={() => handleThumbnailClick(el.url)} // 클릭된 썸네일 ID 저장
                    style={{ cursor: "pointer", margin: "10px" }}
                  />
                  <span>
                    {el.name.replace("[" + movieInfo.movieNm + "]", "").trim()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
