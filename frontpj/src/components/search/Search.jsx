import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Hangul from "es-hangul";
import "../../css/Search.css"; // CSS 파일 임포트

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialSearchQuery = queryParams.get("query") || "";
    const initialSearchType = queryParams.get("searchType") || "normal";
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [searchType, setSearchType] = useState(initialSearchType);
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const isChosungOnly = (text) => {
        const chosungRegex = /^[ㄱ-ㅎ]+$/;
        return chosungRegex.test(text);
    };

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);

            try {
                let response;

                if (!searchQuery) {
                    // 검색어가 없으면 전체 영화 리스트를 가져옴
                    response = await axios.get(`http://localhost:8090/api/searchList?page=${page}`);
                } else {
                    // 검색어가 있으면 해당 조건으로 검색
                    let queryToUse = searchQuery.trim(); // 검색어 공백 제거
                    let currentSearchType = searchType;

                    if (isChosungOnly(queryToUse)) {
                        queryToUse = Hangul.getChoseong(queryToUse);
                        currentSearchType = "chosung";
                        setSearchType(currentSearchType);
                    } else {
                        currentSearchType = "normal";
                        setSearchType(currentSearchType);
                    }

                    // 백엔드에서 받아오는 데이터
                    response = await axios.get(
                        `http://localhost:8090/api/search?query=${encodeURIComponent(
                            queryToUse
                        )}&searchType=${currentSearchType}&page=${page}`
                    );
                }

                const { content, totalPages } = response.data;

                const filteredMovies = content.filter((movie) => movie.poster_path);

                // openDt를 기준으로 내림차순 정렬 (최근 순)
                const sortedMovies = filteredMovies.sort((a, b) => {
                    const dateA = a.openDt ? new Date(a.openDt) : new Date(0);
                    const dateB = b.openDt ? new Date(b.openDt) : new Date(0);
                    return dateB - dateA;
                });

                setMovies(sortedMovies);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("영화 검색 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [searchQuery, searchType, page]); // page, searchQuery, searchType가 변경될 때마다 실행

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
                    {parts[0]} {/* 첫 번째 부분 */}
                    {":"} {/* :을 첫 번째 줄 끝에 추가 */}
                    <br />
                    {parts[1]} {/* 두 번째 부분 */}
                </span>
            );
        }

        // :이 없으면 그대로 출력
        return <span>{title}</span>;
    };

    const handleMovieClick = (movieCd) => {
        navigate(`/movie/detail/${movieCd}`);
    };

    return (
        <div className="search-content">
            {isLoading && <p>검색 중입니다... 조금만 기다려주세요</p>}

            {!isLoading && movies.length > 0 && (
                <ul>
                    {movies.map((movie) => (
                        <li key={`${movie.movieCd}`} onClick={() => handleMovieClick(movie.movieCd)} style={{ cursor: "pointer" }}>
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

            <div className="pagination">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                >
                    이전
                </button>
                <span>
                    {page + 1} / {totalPages}
                </span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Search;
