import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCountUp } from "../../hooks/useCountup";
import '../../css/MovieDetailReview.css'; 

const MovieDetailReview = () => {
  const navigate = useNavigate();
  const { movieCd } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});
  const [selectedTrailerId, setSelectedTrailerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. 우선 트레일러 리스트를 조회하여 해당 영화의 데이터 필터링
        const trailerResponse = await axios.get(
          "http://localhost:8090/api/trailerList"
        );
        const trailerData = trailerResponse.data;
        const filteredTrailers = trailerData.filter(
          (trailer) => trailer.movieEntity.movieCd.toString() === movieCd
        );

        // 첫번째 트레일러의 movieEntity를 movieData로 사용 (존재하지 않으면 undefined)
        let movieData = filteredTrailers[0]?.movieEntity;

        // movieData가 존재하고 movieNm 등의 필수 정보가 있다면
        if (movieData && movieData.movieNm) {
          setMovieInfo(movieData);
          setTrailers(filteredTrailers);

          // 첫 번째 트레일러를 기본 선택
          if (filteredTrailers.length > 0) {
            setSelectedTrailerId(filteredTrailers[0].url);
          }
        } else {
          // movieData가 없거나 부족한 경우 boxOfficeList API를 통해 데이터를 다시 조회
          try {
            const boxOfficeListResponse = await axios.get(
              "http://localhost:8090/api/boxOfficeList"
            );
            const boxOfficeData = boxOfficeListResponse.data;

            // movieCd가 일치하는 항목을 찾음
            const matchedItem = boxOfficeData.find(
              (item) => item.movieCd === movieCd
            );

            movieData = matchedItem || {};
            setMovieInfo(movieData);
            // 트레일러 정보는 그대로 설정 (없을 수도 있음)
            setTrailers(filteredTrailers);
          } catch (screeningError) {
            setError("영화 정보를 불러오는데 실패했습니다.");
            console.error(
              "Error fetching movie info from screening:",
              screeningError
            );
            return;
          }
        }
      } catch (err) {
        setError("트레일러 정보를 불러오는데 실패했습니다.");
        console.error("Error fetching trailers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [movieCd]);

  const handleThumbnailClick = (id) => {
    setSelectedTrailerId(id);
  };

  const audiAcc = useCountUp(Number(movieInfo.audiAcc) || 0, 1500);

  if (isLoading) {
    return <div className="content">Loading...</div>;
  }

  if (error) {
    return <div className="content">Error: {error}</div>;
  }

  return (
    <div className="content">
      <div className="main">
        <div className="main-con">
          <div className="leftBar">
            <div className="leftBar-con">
              {movieInfo && movieInfo.poster_path && (
                <img src={movieInfo.poster_path} alt={movieInfo.movieNm} className="poster" />
              )}
              <div className="movie-info">
                <div>
                  <h3>제목</h3>
                  <span>{movieInfo.movieNm}</span>
                </div>
                <div>
                  <h3>개봉일</h3>
                  <span>{movieInfo.openDt}</span>
                </div>
                <div>
                  <h3>순위</h3>
                  <span>{movieInfo.rank}등</span>
                </div>
                <div>
                  <h3>누적 관객 수</h3>
                  <span>{audiAcc.toLocaleString("ko-KR")}명</span>
                </div>
                <div>
                  <h3>장르</h3>
                  <span>{movieInfo.genres}</span>
                </div>
                <div>
                  <h3>감독</h3>
                  <span>{movieInfo.director}</span>
                </div>
                <button onClick={() => navigate(`/screening/${movieInfo.id}`)}>
                  예매하기
                </button>
              </div>
            </div>
          </div>
          <div className="movieDetailReview-content">
            <span>리뷰</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailReview;

