import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Hangul from "es-hangul";
import "../../css/Search.css";

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
    const [sortOption, setSortOption] = useState("release"); // 기본값은 개봉일 순

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
                    response = await axios.get(`http://localhost:8090/api/searchList?page=${page}&sortOption=${sortOption}`);
                } else {
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

                    response = await axios.get(
                        `http://localhost:8090/api/search?query=${encodeURIComponent(queryToUse)}&searchType=${currentSearchType}&page=${page}&sortOption=${sortOption}`
                    );
                }

                const { content, totalPages } = response.data;

                setMovies(content);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("영화 검색 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [searchQuery, searchType, page, sortOption]);

    useEffect(() => {
        setSearchQuery(initialSearchQuery);
        setSearchType(initialSearchType);
        setPage(0);
    }, [initialSearchQuery, initialSearchType]);

    const formatMovieTitle = (title) => {
        if (!title) return "";

        if (title.includes(":")) {
            const parts = title.split(":");
            return (
                <span>
                    {parts[0]}:{/* 첫 번째 부분 */}
                    <br />
                    {parts[1]} {/* 두 번째 부분 */}
                </span>
            );
        }

        return <span>{title}</span>;
    };

    const handleMovieClick = (movieCd, openDt) => {
        const isMovieEntity = /^\d{4}-\d{2}-\d{2}$/.test(openDt); // openDt가 YYYY-MM-DD 형식이면 MovieEntity로 간주
        const url = isMovieEntity ? `/movie/detail/${movieCd}` : `/search/detail/${movieCd}`;
        navigate(url);  // 해당 URL로 이동
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setPage(0); // 정렬 옵션 변경 시 페이지를 0으로 초기화
    };

    return (
        <div className="search-content">
            <div className="sort-options">
                <select value={sortOption} onChange={handleSortChange}>
                    <option value="release">개봉일 순</option>
                    <option value="alphabetical">가나다 순</option>
                </select>
            </div>
            {isLoading && <p>검색 중입니다... 조금만 기다려주세요</p>}

            {!isLoading && movies.length > 0 && (
                <ul>
                    {movies.map((movie) => (
                        <li key={movie.movieCd} onClick={() => handleMovieClick(movie.movieCd, movie.openDt)} style={{ cursor: "pointer" }}>
                            <img
                                className="poster"
                                src={movie.poster_path}
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
                            <span className="movie-title">{formatMovieTitle(movie.movieNm)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && movies.length === 0 && searchQuery && <p>"{searchQuery}"에 대한 검색 결과가 없습니다.</p>}

            <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage((prev) => Math.max(prev - 1, 0))}>
                    이전
                </button>
                <span>
                    {page + 1} / {totalPages}
                </span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default Search;