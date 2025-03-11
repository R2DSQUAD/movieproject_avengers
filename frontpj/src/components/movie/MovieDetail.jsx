import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LiteYoutubeEmbed } from "react-lite-yt-embed";
import { useCountUp } from "../../hooks/useCountup";

const MovieDetail = () => {
  const navigate = useNavigate();
  const { movieCd } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});
  const [selectedTrailerId, setSelectedTrailerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const trailerSpanRefs = useRef([]);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("0122ba5085fb2a0186685a23149195b0");
      console.log("카카오 SDK 초기화 완료");
    }
  }, []);

  // 카카오톡 공유하기 기능
  const shareOnKakao = () => {
    if (!window.Kakao) {
      console.error("Kakao SDK 로드 실패");
      return;
    }

    //  포스터 이미지가 없을 경우 기본 이미지 사용
    const imageUrl = movieInfo.poster_path || "https://via.placeholder.com/500";

    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: movieInfo.movieNm || "영화 정보",
        description: `개봉일: ${movieInfo.openDt || "미정"} | 장르: ${movieInfo.genres || "정보 없음"}`,
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: `http://localhost:3000/movie/detail/${movieCd}`,
          webUrl: `http://localhost:3000/movie/detail/${movieCd}`,
        },
      },
      buttons: [
        {
          title: "자세히 보기",
          link: {
            mobileWebUrl: `http://localhost:3000/movie/detail/${movieCd}`,
            webUrl: `http://localhost:3000/movie/detail/${movieCd}`,
          },
        },
      ],
    });
  };

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

  useEffect(() => {
    const adjustFontSize = (span) => {
      if (!span) return;

      const parentWidth = span.parentElement.offsetWidth;
      const spanWidth = span.offsetWidth;
      let fontSize = 16;

      if (parentWidth < spanWidth) {
        fontSize = Math.floor((parentWidth / spanWidth) * 16);
      }

      if (fontSize > 16) {
        fontSize = 16;
      }
      span.style.fontSize = `${fontSize}px`;
    };

    // Adjust font size for all trailers
    const spans = trailerSpanRefs.current;
    spans.forEach(adjustFontSize);


    // Handle window resize
    const handleResize = () => {
      spans.forEach(adjustFontSize);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [trailers]); // Adjust font size when trailers change

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
              <img src="/image/share.svg" alt="공유하기" className="share-icon" onClick={shareOnKakao}/>

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
                <button onClick={() => navigate(`/movie/detail/review/${movieInfo.movieCd}`)}>
                  리뷰보기
                </button>
              </div>
            </div>
          </div>
          <div className="movieDetail-content">
          <span>줄거리</span>
          <p>{movieInfo.overview}</p>
          {selectedTrailerId && (
            <div className="video-container">
              <LiteYoutubeEmbed
                key={selectedTrailerId}
                id={selectedTrailerId}
                mute={false}
                params="controls=1&rel=0"
              />
            </div>
          )}
          <ul
            className="thumbnailImg"
            style={{
              gridTemplateColumns: `repeat(${trailers.length}, 1fr)`,
            }}
          >
            {trailers.map((el, idx) => (
              <li className="thumbnailImg-con" key={idx}>
                <img
                  src={`https://img.youtube.com/vi/${el.url}/hqdefault.jpg`}
                  alt={el.name}
                  onClick={() => handleThumbnailClick(el.url)}
                  className={selectedTrailerId === el.url ? "selected" : ""}
                />
                <span
                  ref={(el) => (trailerSpanRefs.current[idx] = el)}
                >
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
