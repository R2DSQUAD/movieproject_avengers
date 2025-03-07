import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Search = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim()) return;

        const fetchMovies = async () => {
            try {
                setLoading(true); // 검색 시작 시 로딩 상태 활성화
                setMovies([]); // 기존 검색 결과 초기화 (중복 방지)

                const cleanedQuery = searchQuery.replace(/\s+/g, "").trim();
                const response = await axios.get(`http://localhost:8090/api/search?query=${encodeURIComponent(cleanedQuery)}`);

                setMovies(response.data);
            } catch (error) {
                console.error("영화 검색 실패:", error);
            } finally {
                setLoading(false); // 검색 완료 후 로딩 상태 해제
            }
        };

        fetchMovies();
    }, [searchQuery]);

    return (
        <div>
            {loading ? (
                <p>검색 중입니다... 조금만 기다려주세요</p>
            ) : movies.length > 0 ? (
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
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default Search;
