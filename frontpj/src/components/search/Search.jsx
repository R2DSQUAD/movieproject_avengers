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

    // 초성 여부 판단 함수
    const isChosungOnly = (text) => {
        // 정규 표현식: ㄱ-ㅎ, ㄳ, ㄵ, ㄶ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅄ
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
                    `http://localhost:8090/api/search?query=${encodeURIComponent(queryToUse)}&searchType=${currentSearchType}`
                );
                setMovies(response.data);
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

    return (
        <div>
            {isLoading && <p>검색 중입니다... 조금만 기다려주세요</p>}

            {!isLoading && movies.length > 0 && (
                <ul>
                    {movies.map((movie) => (
                        <li key={`${movie.movieCd}`}>
                            <img
                                src={movie.poster_path || "https://via.placeholder.com/100"}
                                alt={movie.movieNm}
                                width="100"
                            />
                            <div>{movie.movieNm}</div>
                            <div>개봉일: {movie.openDt || "정보 없음"}</div>
                            <div>감독: {movie.directors || "정보 없음"}</div>
                            <div>장르: {movie.genreAlt || "정보 없음"}</div>
                            <div>{movie.overview || "줄거리 없음"}</div>
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
