import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";
    const searchType = queryParams.get("searchType") || "normal";
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!searchQuery) {
          setMovies([]);
          return;
        }
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                setMovies([]); // 기존 검색 결과 초기화 (중복 방지)
                const response = await axios.get(`http://localhost:8090/api/search?query=${encodeURIComponent(searchQuery)}&searchType=${searchType}`);
                setMovies(response.data);
            } catch (error) {
                console.error("영화 검색 실패:", error);
            }finally{
                setIsLoading(false);
            }
        };


        fetchMovies();
    }, [searchQuery,searchType]);

    return (
        <div>
            {isLoading && <p>검색 중입니다... 조금만 기다려주세요</p>}

            {!isLoading && movies.length > 0 && (
                <ul>
                    {movies.map((movie) => (
                        <li key={`${movie.movieNm}-${movie.openDt || "unknown"}`}>
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
