import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import * as Hangul from 'es-hangul';

const Search = () => {
    const location = useLocation();
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
            setMovies([]);

            try {
                let response;
                if (!searchQuery) {
                    response = await axios.get(`http://localhost:8090/api/searchList?page=${page}`);
                } else {
                    let queryToUse = searchQuery.trim();
                    let currentSearchType = searchType;

                    if (isChosungOnly(queryToUse)) {
                        queryToUse = Hangul.getChoseong(queryToUse);
                        currentSearchType = "chosung";
                    } else {
                        currentSearchType = "normal";
                    }

                    response = await axios.get(
                        `http://localhost:8090/api/search?query=${encodeURIComponent(queryToUse)}&searchType=${currentSearchType}&page=${page}`
                    );
                }

                // 백엔드에서 받아온 데이터에서 필요한 정보 추출
                const { content, totalPages } = response.data;

                const filteredMovies = content.filter(movie => movie.poster_path);

                setMovies(filteredMovies);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("영화 검색 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [searchQuery, searchType, page]); // page가 변경될 때마다 실행

    useEffect(() => {
        setSearchQuery(initialSearchQuery);
        setSearchType(initialSearchType);
    }, [initialSearchQuery, initialSearchType]);

    return (
        <div>
            {isLoading && <p>검색 중입니다... 조금만 기다려주세요</p>}

            {!isLoading && movies.length > 0 && (
                <ul>
                    {movies.map((movie) => (
                        <li key={`${movie.movieCd}`}>
                            <img
                                src={movie.poster_path}
                                alt={movie.movieNm}
                                width="100"
                            />
                            <div>{movie.movieNm}</div>
                            <div>개봉일: {movie.openDt || "정보 없음"}</div>
                            <div>감독: {movie.directors || "정보 없음"}</div>
                            <div>장르: {movie.genreAlt || "정보 없음"}</div>
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
                <span>{page + 1} / {totalPages}</span>
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