import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LiteYoutubeEmbed } from "react-lite-yt-embed";

const SearchMovieDetail = () => {
    const navigate = useNavigate();
    const { movieCd } = useParams();
    const [trailers, setTrailers] = useState([]);
    const [movieInfo, setMovieInfo] = useState({});
    const [selectedTrailerId, setSelectedTrailerId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const trailerSpanRefs = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // SearchEntity 영화 정보 조회
                const searchResponse = await axios.get(`http://localhost:8090/api/searchList/${movieCd}`);
                const movieData = searchResponse.data;

                // SearchEntity 트레일러 조회
                const searchTrailerResponse = await axios.get(`http://localhost:8090/api/searchTrailerList/${movieCd}`);
                const filteredTrailers = searchTrailerResponse.data;

                setMovieInfo(movieData);
                setTrailers(filteredTrailers);

                // 첫 번째 트레일러 선택
                if (filteredTrailers.length > 0) {
                    setSelectedTrailerId(filteredTrailers[0].url);
                } else {
                    setSelectedTrailerId(null);
                }
            } catch (err) {
                setError("영화 정보를 불러오는데 실패했습니다.");
                console.error("Error fetching search movie details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [movieCd]);

    const handleThumbnailClick = (id) => {
        setSelectedTrailerId(id);
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
                            {movieInfo.poster_path && (
                                <img src={movieInfo.poster_path} alt={movieInfo.movieNm} />
                            )}
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
                                    <h3>장르</h3>
                                    <span>{movieInfo.genreAlt}</span>
                                </div>
                                <div>
                                    <h3>감독</h3>
                                    <span>{movieInfo.directors}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate(`/movie/detail/review/${movieInfo.movieCd}`)}>
                                리뷰보기
                            </button>
                        </div>
                    </div>
                </div>

                <div className="movieDetail-content">
                    <span>줄거리</span>
                    <p>{movieInfo.overview}</p>

                    {selectedTrailerId ? (
                        <div className="video-container">
                            <LiteYoutubeEmbed key={selectedTrailerId} id={selectedTrailerId} mute={false} params="controls=1&rel=0" />
                        </div>
                    ) : (
                        <p className="no-trailer">등록된 트레일러가 없습니다.</p>
                    )}

                    {trailers.length > 0 && (
                        <ul className="thumbnailImg">
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchMovieDetail;
