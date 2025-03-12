import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LiteYoutubeEmbed } from "react-lite-yt-embed";
import { useCountUp } from "../../hooks/useCountup";
import { useSelector } from "react-redux";
import jwtAxios from "../../util/jwtUtil";
import "../../css/MovieDetail.css";

// 공통 모달 컴포넌트
const Modal = ({ onClose, onConfirm, message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p style={{ color: "black" }}>{message}</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-cancel-button">
            취소
          </button>
          <button onClick={onConfirm} className="modal-confirm-button">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// 리뷰 관련 로직을 별도 컴포넌트로 분리
const ReviewSection = ({ movieInfo, loginState }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hasWrittenReview, setHasWrittenReview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [isSortedByLike, setIsSortedByLike] = useState(false);
  const [isSortedByLatest, setIsSortedByLatest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;

  // 리뷰 불러오기 함수
  const fetchReviews = useCallback(
    async (sortType = "latest") => {
      if (!movieInfo.id) return;
      try {
        const response = await axios.get(
          `http://localhost:8090/api/review/reviewList/${movieInfo.id}`
        );
        let fetchedReviews = response.data.reviewDtos || [];
        // 정렬 적용
        fetchedReviews =
          sortType === "like"
            ? sortByLike(fetchedReviews)
            : sortByLatest(fetchedReviews);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    },
    [movieInfo.id]
  );

  // 최신순 정렬
  const sortByLatest = (data) => {
    return data.sort(
      (a, b) => new Date(b.createTime) - new Date(a.createTime)
    );
  };

  // 공감(좋아요) 순 정렬 (동일 공감수일 경우 최신순)
  const sortByLike = (data) => {
    return data.sort((a, b) => {
      if (b.likeCount === a.likeCount) {
        return new Date(b.createTime) - new Date(a.createTime);
      }
      return b.likeCount - a.likeCount;
    });
  };

  // 영화가 바뀔 때마다 리뷰 불러오기
  useEffect(() => {
    fetchReviews(isSortedByLike ? "like" : "latest");
  }, [movieInfo.id, fetchReviews, isSortedByLike]);

  // 로그인한 사용자가 이미 리뷰를 작성했는지 체크
  useEffect(() => {
    setHasWrittenReview(
      reviews.some((review) => review.email === loginState.email)
    );
  }, [reviews, loginState.email]);

  // 리뷰 작성
  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) return alert("리뷰를 입력해주세요.");
    try {
      await jwtAxios.post("http://localhost:8090/api/review/write", {
        movieId: movieInfo.id,
        reviewText,
        email: loginState.email,
        rating,
      });
      setReviewText("");
      setRating(0);
      // 작성 후 최신 정렬로 다시 불러오기
      fetchReviews(isSortedByLike ? "like" : "latest");
      
    } catch (err) {
      alert("리뷰 작성 실패");
      console.error("Error submitting review:", err);
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    try {
      await jwtAxios.post(
        `http://localhost:8090/api/review/delete/${reviewId}`
      );
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setIsModalOpen(false);
    } catch (err) {
      alert("리뷰 삭제 실패");
      console.error("Error deleting review:", err);
    }
  };

  // 좋아요 처리 (좋아요/공감 취소)
  const handleLike = async (reviewId) => {
    if (!loginState.email) return navigate("/member/login");
    const review = reviews.find((r) => r.id === reviewId);
    const alreadyLiked = review.movieReviewLikeEntities.some(
      (like) => like.email === loginState.email
    );
    try {
      await jwtAxios.post(
        `http://localhost:8090/api/review/${
          alreadyLiked ? "unlike" : "like"
        }?movieReviewId=${reviewId}&email=${loginState.email}`
      );
      // 즉각적인 UI 업데이트: 좋아요 상태를 로컬에서 갱신
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                movieReviewLikeEntities: alreadyLiked
                  ? r.movieReviewLikeEntities.filter(
                      (like) => like.email !== loginState.email
                    )
                  : [...r.movieReviewLikeEntities, { email: loginState.email }],
              }
            : r
        )
      );
      fetchReviews(isSortedByLike ? "like" : "latest");
    } catch (err) {
      alert("좋아요 처리 실패");
      console.error("Error handling like:", err);
    }
  };

  // 페이지네이션 계산
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviews.length / messagesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 정렬 버튼 핸들러
  const handleSortByLike = () => {
    setIsSortedByLike(true);
    setIsSortedByLatest(false);
    fetchReviews("like");
  };

  const handleSortByLatest = () => {
    setIsSortedByLike(false);
    setIsSortedByLatest(true);
    fetchReviews("latest");
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}년-${month}월-${day}일 ${hours}시:${minutes}분`;
  };

  return (
    <div className="movieDetailReview-content">
      {loginState.email ? (
        !hasWrittenReview ? (
          <div className="movieReviewInsert">
            <span>리뷰작성</span>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요"
            />
            {/* 별점 선택 */}
            <div className="rating">
              {[1, 2, 3, 4, 5].map((rate) => (
                <span
                  key={rate}
                  className={`star ${rate <= rating ? "selected" : ""}`}
                  onClick={() => setRating(rate)}
                >
                  ★
                </span>
              ))}
            </div>
            <button onClick={handleReviewSubmit}>리뷰 작성</button>
          </div>
        ) : (
          <p>이미 리뷰를 작성하셨습니다.</p>
        )
      ) : (
        <p>
          <Link to="/member/login">로그인 하러가기</Link>
        </p>
      )}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleSortByLike}
          style={{
            backgroundColor: isSortedByLike ? "lightblue" : "transparent",
            marginRight: "0.5rem",
          }}
        >
          공감순
        </button>
        <button
          onClick={handleSortByLatest}
          style={{
            backgroundColor: isSortedByLatest ? "lightblue" : "transparent",
          }}
        >
          최신순
        </button>
      </div>
      <div className="review-list">
        {reviews.length === 0 ? (
          <p>작성된 리뷰가 없습니다.</p>
        ) : (
          <>
            {isModalOpen && (
              <Modal
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => handleDeleteReview(selectedReviewId)}
                message="정말 이 리뷰를 삭제하시겠습니까?"
              />
            )}
            <ul>
              {currentReviews.map((review) => (
                <li key={review.id} className="review-item">
                  <p>작성자: {review.email}</p>
                  <p>내용: {review.reviewText}</p>
                  <p>평점: {review.rating}점</p>
                  <p>공감: {review.likeCount}개</p>
                  <p>작성일: {formatDate(review.createTime)}</p>
                  <button
                    onClick={() => handleLike(review.id)}
                    style={{
                      backgroundColor: review.movieReviewLikeEntities?.some(
                        (like) => like.email === loginState.email
                      )
                        ? "blue"
                        : "gray",
                      color: "white",
                      marginRight: "0.5rem",
                    }}
                  >
                    {review.movieReviewLikeEntities?.some(
                      (like) => like.email === loginState.email
                    )
                      ? "공감 취소"
                      : "공감"}
                  </button>
                  {(loginState.email === review.email ||
                    loginState.roleNames?.includes("ADMIN")) && (
                    <button
                      onClick={() => {
                        setSelectedReviewId(review.id);
                        setIsModalOpen(true);
                      }}
                    >
                      리뷰 삭제
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {/* 페이지네이션 */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                맨 처음
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                맨 끝
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MovieDetail = () => {
  const navigate = useNavigate();
  const { movieCd } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});
  const [selectedTrailerId, setSelectedTrailerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const loginState = useSelector((state) => state.loginSlice);
  const trailerSpanRefs = useRef([]);
  const audiAcc = useCountUp(Number(movieInfo.audiAcc) || 0, 1500);
  const [averageRating, setAverageRating] = useState(0);

  // 카카오톡 공유하기 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("0122ba5085fb2a0186685a23149195b0");
      console.log("카카오 SDK 초기화 완료");
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trailerResponse = await axios.get(
        "http://localhost:8090/api/trailerList"
      );
      const trailerData = trailerResponse.data;
      const filteredTrailers = trailerData.filter(
        (trailer) => trailer.movieEntity.movieCd.toString() === movieCd
      );
  
      let movieData = filteredTrailers[0]?.movieEntity;
      if (movieData && movieData.movieNm) {
        setMovieInfo(movieData);
        if (movieData.movieReviewEntities?.length > 0) {
          const ratings = movieData.movieReviewEntities.map(
            (review) => review.rating
          );
          const avgRating =
            ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
          setAverageRating(avgRating.toFixed(1));
        }
        setTrailers(filteredTrailers);
        if (filteredTrailers.length > 0) {
          setSelectedTrailerId(filteredTrailers[0].url);
        }
      } else {
        // movieData가 부족할 경우 boxOfficeList API 호출
        try {
          const boxOfficeResponse = await axios.get(
            "http://localhost:8090/api/boxOfficeList"
          );
          const boxOfficeData = boxOfficeResponse.data;
          const matchedItem = boxOfficeData.find(
            (item) => item.movieCd === movieCd
          );
          movieData = matchedItem || {};
          setMovieInfo(movieData);
          setTrailers(filteredTrailers);
        } catch (screeningError) {
          setError("영화 정보를 불러오는데 실패했습니다.");
          console.error("Error fetching movie info:", screeningError);
          return;
        }
      }
    } catch (err) {
      setError("트레일러 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching trailers:", err);
    } finally {
      setIsLoading(false);
    }
  }, [movieCd]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 공유하기 기능
  const shareOnKakao = () => {
    if (!window.Kakao) {
      console.error("Kakao SDK 로드 실패");
      return;
    }
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

  // 썸네일 클릭 시 선택된 트레일러 변경
  const handleThumbnailClick = (url) => {
    setSelectedTrailerId(url);
  };

  if (isLoading) return <div className="content">Loading...</div>;
  if (error) return <div className="content">Error: {error}</div>;

  return (
    <div className="content">
      <div className="main">
        <div className="main-con">
          <div className="leftBar">
            <div className="leftBar-con">
              {movieInfo?.poster_path && (
                <img
                  src={movieInfo.poster_path}
                  alt={movieInfo.movieNm}
                  className="poster"
                />
              )}
              <img
                src="/image/share.svg"
                alt="공유하기"
                className="share-icon"
                onClick={shareOnKakao}
              />
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
                  <h3>평점</h3>
                  <span>{averageRating ? averageRating : 0}점</span>
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
                  <span ref={(el) => (trailerSpanRefs.current[idx] = el)}>
                    {el.name.replace("[" + movieInfo.movieNm + "]", "").trim()}
                  </span>
                </li>
              ))}
            </ul>
            {/* 리뷰 영역 토글 (원하는 조건에 따라 렌더링) */}
            {movieInfo.movieReviewEntities && (
              <ReviewSection movieInfo={movieInfo} loginState={loginState} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
