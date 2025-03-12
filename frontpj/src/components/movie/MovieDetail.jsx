import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LiteYoutubeEmbed } from "react-lite-yt-embed";
import { useCountUp } from "../../hooks/useCountup";
import { useSelector } from "react-redux";
import jwtAxios from "../../util/jwtUtil";


const Modal = ({ onClose, onConfirm, message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p style={{ color: 'black' }}>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-confirm-button">확인</button>
          <button onClick={onClose} className="modal-cancel-button">취소</button>
        </div>
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
  const [reviewText, setReviewText] = useState(""); // 리뷰 입력 상태 관리
  const [rating, setRating] = useState(0); // 별점 상태 관리
  const [reviews, setReviews] = useState([]); // 리뷰 목록 상태 관리
  const [isReviewVisible, setIsReviewVisible] = useState(false); // 리뷰 보기 상태 관리
  const loginState = useSelector((state) => state.loginSlice);
  const trailerSpanRefs = useRef([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [messagesPerPage] = useState(5); // 페이지당 게시글 수
  const [averageRating, setAverageRating] = useState(0); // 평균 평점 상태 추가
  const [hasWrittenReview, setHasWrittenReview] = useState(false); // 리뷰 작성 여부 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal open/close state
  const [selectedReviewId, setSelectedReviewId] = useState(null); // Store the ID of the review to be deleted
  const [isSortedByLike, setIsSortedByLike] = useState(false); // 공감순 버튼 상태
  const [isSortedByLately, setIsSortedByLately] = useState(false); // 최신순 버튼 상태

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
          if (movieData.movieReviewEntities && movieData.movieReviewEntities.length > 0) {
            const ratings = movieData.movieReviewEntities.map((review) => review.rating);
            console.log(ratings)
            const avgRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
            console.log(averageRating)
            setAverageRating(avgRating.toFixed(1)); // 소수점 첫째자리까지 표시
          }
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
    if (movieInfo.id) {
      const fetchReviews = async () => {
        try {
          const reviewResponse = await axios.get(
            `http://localhost:8090/api/review/reviewList/${movieInfo.id}`
          );
          
          // 리뷰 리스트를 최신순으로 정렬 (여기서는 id나 createdAt을 기준으로 최신순 정렬)
          const sortedReviews = reviewResponse.data.reviewDtos || [];
          sortedReviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)); // `createdAt`을 기준으로 정렬
  
          setReviews(sortedReviews);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      };
  
      fetchReviews();
    }
  }, [movieInfo.id]); // movieInfo.id가 변경될 때마다 리뷰 목록을 가져옴
  
  useEffect(() => {
    // 현재 페이지의 리뷰들 중 로그인된 사용자의 리뷰가 있는지 확인
    const userReview = reviews.find(
      (review) => review.email === loginState.email
    );
    
    if (userReview) {
      setHasWrittenReview(true); // 이미 리뷰를 작성한 경우
    } else {
      setHasWrittenReview(false); // 아직 리뷰를 작성하지 않은 경우
    }
  }, [reviews, loginState.email]); // reviews loginState.email이 변경될 때마다 실행
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

  const handleReviewSubmit = async () => {
    if (reviewText.trim() === "") {
      alert("리뷰를 입력해주세요.");
      return;
    }
    
    try {
      const reviewData = {
        movieId: movieInfo.id,
        reviewText: reviewText,
        email: loginState.email,
        rating: rating, // 별점 추가
      };
      
      await jwtAxios.post("http://localhost:8090/api/review/write", reviewData);
      setReviewText(""); // 리뷰 입력 초기화
      setRating(0); // 별점 초기화
      const trailerResponse = await axios.get(
        "http://localhost:8090/api/trailerList"
      );
      const trailerData = trailerResponse.data;
      const filteredTrailers = trailerData.filter(
        (trailer) => trailer.movieEntity.movieCd.toString() === movieCd
      );

      // 첫번째 트레일러의 movieEntity를 movieData로 사용 (존재하지 않으면 undefined)
      let movieData = filteredTrailers[0]?.movieEntity;
      setMovieInfo(movieData);

      const ratings = movieData.movieReviewEntities.map((review) => review.rating);
      console.log(ratings)
      const avgRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
      console.log(averageRating)
      setAverageRating(avgRating.toFixed(1)); // 소수점 첫째자리까지 표시
      // 새로 작성된 리뷰를 다시 불러옵니다.
      const reviewResponse = await axios.get(
        `http://localhost:8090/api/review/reviewList/${movieInfo.id}`
      );
      
      // 리뷰 리스트를 최신순으로 정렬 (여기서는 id나 createdAt을 기준으로 최신순 정렬)
      const sortedReviews = reviewResponse.data.reviewDtos || [];
      sortedReviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)); // `createdAt`을 기준으로 정렬

      setReviews(sortedReviews);
    } catch (err) {
      alert("리뷰를 작성하는 데 실패했습니다.");
      console.error("Error submitting review:", err);
    }
  };
  
 
  
  const reviewDelete = async () => {
    try {
      // 리뷰 삭제 요청
      await jwtAxios.post(`http://localhost:8090/api/review/delete/${selectedReviewId}`);
  
      // 삭제된 리뷰를 상태에서 바로 제거
      const trailerResponse = await axios.get(
        "http://localhost:8090/api/trailerList"
      );
      const trailerData = trailerResponse.data;
      const filteredTrailers = trailerData.filter(
        (trailer) => trailer.movieEntity.movieCd.toString() === movieCd
      );

      // 첫번째 트레일러의 movieEntity를 movieData로 사용 (존재하지 않으면 undefined)
      let movieData = filteredTrailers[0]?.movieEntity;
      setMovieInfo(movieData);

      const ratings = movieData.movieReviewEntities.map((review) => review.rating);
      console.log(ratings)
      const avgRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
      console.log(averageRating)
      setAverageRating(avgRating.toFixed(1)); // 소수점 첫째자리까지 표시
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== selectedReviewId)
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("리뷰 삭제 실패", err);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  const handleDeleteClick = (reviewId) => {
    setSelectedReviewId(reviewId); 
    setIsModalOpen(true); 
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };

  const handleLike = async (movieReviewId) => {  
    // 로그인 상태 체크
    if (!loginState.email) {
      // email이 없으면 로그인 페이지로 이동
      navigate('/member/login');
      return; // 이후 로직을 실행하지 않도록 종료
    }
  
    const movieReview = reviews.find((r) => r.id === movieReviewId);
  
    // 사용자가 이미 좋아요를 눌렀다면, unlike 요청을 보냄
    if (movieReview.movieReviewLikeEntities.some((like) => like.email === loginState.email)) {
      try {
        await jwtAxios.post(`http://localhost:8090/api/review/unlike?movieReviewId=${movieReviewId}&email=${loginState.email}`);
  
        // 서버에서 좋아요 취소 성공 후, UI 상태 업데이트
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r.id === movieReviewId
              ? {
                  ...r,
                  movieReviewLikeEntities: r.movieReviewLikeEntities.filter((like) => like.email !== loginState.email),
                }
              : r
          )
        );
        
        // 리뷰 리스트 가져오기 및 정렬
        const reviewResponse = await axios.get(`http://localhost:8090/api/review/reviewList/${movieInfo.id}`);
        const sortedReviews = reviewResponse.data.reviewDtos || [];
        sortedReviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)); // `createdAt`을 기준으로 정렬
  
        setReviews(sortedReviews);
      } catch (err) {
        console.error("좋아요 취소 실패", err);
        alert("좋아요 취소에 실패했습니다.");
      }
    } else {
      // 좋아요가 눌리지 않은 상태라면, like 요청을 보냄
      try {
        await jwtAxios.post(`http://localhost:8090/api/review/like?movieReviewId=${movieReviewId}&email=${loginState.email}`);
  
        // 서버에서 좋아요 추가 성공 후, UI 상태 업데이트
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r.id === movieReviewId
              ? {
                  ...r,
                  movieReviewLikeEntities: [...r.movieReviewLikeEntities, { email: loginState.email }],
                }
              : r
          )
        );
  
        // 리뷰 리스트 가져오기 및 정렬
        const reviewResponse = await axios.get(`http://localhost:8090/api/review/reviewList/${movieInfo.id}`);
        const sortedReviews = reviewResponse.data.reviewDtos || [];
        sortedReviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)); // `createdAt`을 기준으로 정렬
  
        setReviews(sortedReviews);
      } catch (err) {
        console.error("좋아요 실패", err);
        alert("좋아요 처리에 실패했습니다.");
      }
    }
  };
  

  const SortByLike = async () => {
    setIsSortedByLike(true); // 공감순 정렬 상태로 변경
    setIsSortedByLately(false); // 최신순 상태 해제

    if (movieInfo.id) {
      const fetchReviews = async () => {
        try {
          const reviewResponse = await axios.get(
            `http://localhost:8090/api/review/reviewList/${movieInfo.id}`
          );

          const sortedReviews = reviewResponse.data.reviewDtos || [];
          sortedReviews.sort((a, b) => b.likeCount - a.likeCount);

          // 만약 '좋아요 수'가 같다면 작성 시간 기준으로 정렬
          sortedReviews.sort((a, b) => {
            if (b.likeCount === a.likeCount) {
              return new Date(b.createTime) - new Date(a.createTime);
            }
            return 0;
          });

          setReviews(sortedReviews);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      };

      fetchReviews();
    }
  };

  const SortByLately = async () => {
    setIsSortedByLike(false); // 공감순 상태 해제
    setIsSortedByLately(true); // 최신순 정렬 상태로 변경

    if (movieInfo.id) {
      const fetchReviews = async () => {
        try {
          const reviewResponse = await axios.get(
            `http://localhost:8090/api/review/reviewList/${movieInfo.id}`
          );

          const sortedReviews = reviewResponse.data.reviewDtos || [];
          sortedReviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

          setReviews(sortedReviews);
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      };

      fetchReviews();
    }
  };
  
  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = reviews.slice(indexOfFirstMessage, indexOfLastMessage);

  const totalPages = Math.ceil(reviews.length / messagesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRatingChange = (rate) => {
    setRating(rate); // 별점 변경
  };

  const toggleReviewVisibility = () => {
    setIsReviewVisible((prev) => !prev); // 리뷰 영역 토글
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}년-${month}월-${day}일 ${hours}시:${minutes}분`;
  };
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
              <button onClick={toggleReviewVisibility}>
                    관람평({movieInfo.movieReviewEntities.length})
              </button>
            </div>
          </div>

          <div className="moviedetail-content">
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

            {isReviewVisible && (
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
                        onClick={() => handleRatingChange(rate)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <button onClick={handleReviewSubmit}>리뷰 작성</button>
                </div>
  ) : (
    // 이미 리뷰를 작성한 경우
    <p>이미 리뷰를 작성하셨습니다.</p>
  )
) : (
     <p> <Link to="/member/login">로그인 하러가기</Link></p>
)}
 <button onClick={SortByLike}
            style={{
              backgroundColor: isSortedByLike ? "lightblue" : "transparent", // 공감순 버튼 색상
            }}> 공감순</button>
          <button
            onClick={SortByLately}
            style={{
              backgroundColor: isSortedByLately ? "lightblue" : "transparent", // 최신순 버튼 색상
            }}>최신순</button>
                <div className="review-list">
                  {reviews.length === 0 ? (
                    <p>작성된 리뷰가 없습니다.</p>
                  ) : (
                    <>
                    {isModalOpen && (
  <Modal
    onClose={handleCloseModal}
    onConfirm={reviewDelete}
    message="정말 이 리뷰를 삭제하시겠습니까?"
  />
)}
                      <ul>
                        {currentMessages.map((review) => (
                          <li key={review.id} className="review-item">
                            <p>작성자: {review.email}</p>
                            <p>내용: {review.reviewText}</p>
                            <p>평점: {review.rating}점</p>
                            <p>공감: {review.likeCount}개</p>
                            <p>작성일: {formatDate(review.createTime)}</p>
                            {/* 좋아요 버튼 */}
                         {/* {loginState.email ? ( */}
                        <button onClick={() => handleLike(review.id)}
                            style={{ backgroundColor: review.movieReviewLikeEntities?.some(
                              (like) => like.email === loginState.email // 이메일 비교
                              )
                                ? "blue"
                                : "gray", // 좋아요를 누른 상태일 경우 파란색, 그렇지 않으면 회색
                              color: "white",
                                    }}
                                >
                          {review.movieReviewLikeEntities?.some(
                        (like) => like.email === loginState.email // 이메일 비교
                                    )
                              ? "공감 취소"
                            : "공감"}
                          </button>
                                    {/* ) : null} */}
                                      {/* 리뷰 삭제 버튼 (권한 확인) */}
                            {(loginState.email === review.email || loginState.roleNames?.includes("ADMIN")) && (
                              <button onClick={() => handleDeleteClick(review.id)}>리뷰 삭제</button>
                            )}
                          </li>
                          
                        ))}
                      </ul>
                      {/* 페이징 처리 */}
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
            )}
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default MovieDetail;
