import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    const [movies, setMovies] = useState([]);

    useEffect(() => {
        if (!searchQuery) return;

        const fetchMovies = async () => {
            try {
                const cleanedQuery = searchQuery.replace(/\s+/g, "");
                const response = await axios.get(`http://localhost:8090/api/search?query=${encodeURIComponent(cleanedQuery)}`);
                setMovies(response.data);
            } catch (error) {
                console.error("영화 검색 실패:", error);
            }
        };


        fetchMovies();
    }, [searchQuery]);

    return (
        <div>

            {movies.length > 0 ? (
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
                            <div>감독: {movie.director || movie.directors || "정보 없음"}</div>
                            <div>장르: {movie.genres || movie.genreAlt || "정보 없음"}</div>
                            <div>{movie.overview || "줄거리 없음"}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>검색 중입니다... 조금만 기다려주세요</p>
            )}
        </div>
    );
};

export default Search;