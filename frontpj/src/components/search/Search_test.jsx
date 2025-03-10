import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import * as Hangul from "es-hangul";
import "../../css/Search.css"; // CSS 파일 임포트

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("query") || "";
  const initialSearchType = queryParams.get("searchType") || "normal";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchType, setSearchType] = useState(initialSearchType);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초성 여부 판단 함수
  const isChosungOnly = (text) => {
    const chosungRegex = /^[ㄱ-ㅎ]+$/;
    return chosungRegex.test(text);
  };

  useEffect(() => {
    const processSearch = async (query, type) => {
      if (!query) {
        setMovies([]);
        return;
      }

      setIsLoading(true);
      try {
        setMovies([]);
        let queryToUse = query;
        let currentSearchType = type;
        const trimmedSearchQuery = query.trim(); // 검색어 공백 제거

        if (isChosungOnly(trimmedSearchQuery)) {
          queryToUse = Hangul.getChoseong(trimmedSearchQuery);
          currentSearchType = "chosung";
          setSearchType(currentSearchType);
        } else {
          currentSearchType = "normal";
          setSearchType(currentSearchType);
        }

        const response = await axios.get(
          `http://localhost:8090/api/search?query=${encodeURIComponent(
            queryToUse
          )}&searchType=${currentSearchType}`
        );

        // openDt를 기준으로 내림차순 정렬 (최근 순)
        const sortedMovies = response.data.sort((a, b) => {
          const dateA = a.openDt ? new Date(a.openDt) : new Date(0);
          const dateB = b.openDt ? new Date(b.openDt) : new Date(0);
          return dateB - dateA;
        });

        setMovies(sortedMovies);
      } catch (error) {
        console.error("영화 검색 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    processSearch(searchQuery, searchType);
  }, [searchQuery, searchType]);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
    setSearchType(initialSearchType);
  }, [initialSearchQuery, initialSearchType]);

  const formatMovieTitle = (title) => {
    if (!title) return "";
  
    // 제목에 :이 있을 경우만 처리
    if (title.includes(":")) {
      const parts = title.split(":");
      return (
        <span>
          {parts[0]}{/* 첫 번째 부분 */}
          {":"} {/* :을 첫 번째 줄 끝에 추가 */}
          <br />
          {parts[1]}{/* 두 번째 부분 */}
        </span>
      );
    }
  
    // :이 없으면 그대로 출력
    return <span>{title}</span>;
  };
  
  
  
  

  return (
    <div>
      {isLoading && <p>검색 중입니다... 조금만 기다려주세요</p>}

      {!isLoading && movies.length > 0 && (
        <ul>
          {movies.map((movie) => (
            <li key={`${movie.movieCd}`}>
              <img
                className="poster"
                src={movie.poster_path || "https://via.placeholder.com/100"}
                alt={movie.movieNm}
                width="100"
              />
              <img
                  src={
                    movie.watchGradeNm === "청소년관람불가"
                      ? "./../image/18.png"
                      : movie.watchGradeNm === "15세이상관람가"
                      ? "./../image/15.png"
                      : movie.watchGradeNm === "12세이상관람가"
                      ? "./../image/12.png"
                      : movie.watchGradeNm === "전체관람가"
                      ? "./../image/all.png"
                      : null
                  }
                  alt={movie.watchGradeNm}
                  className="age-rating-icon"
                />
              <span className="movie-title">
                {formatMovieTitle(movie.movieNm)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && movies.length === 0 && searchQuery && (
        <p>"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default Search;
