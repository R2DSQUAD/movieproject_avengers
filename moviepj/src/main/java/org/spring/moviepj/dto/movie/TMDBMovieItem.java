package org.spring.moviepj.dto.movie;

import java.util.List;

import lombok.Data;

@Data
public class TMDBMovieItem {
    private String id;
    private String title;
    private String releaseDate;
    private List<Integer> genreIds;
    private String backdropPath;
    private String posterPath;
    private float voteAverage;
    private String overview;

    // getters and setters
}
