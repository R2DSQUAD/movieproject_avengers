import React, { useEffect, useState } from "react";
import axios from "axios";

const BoxOfficeList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://43.201.20.172:8090/movie/boxoffice")
      .then((response) => {
        const movieList = response.data.boxOfficeResult.dailyBoxOfficeList;
        setMovies(movieList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching box office data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>박스오피스 순위</h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.movieCd}>
            {movie.rank}. {movie.movieNm} ({movie.openDt})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoxOfficeList;
