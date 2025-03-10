package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.ScreeningDto;
import org.spring.moviepj.entity.MovieEntity;

public interface ScreeningService {

    void createScreenings(int daysToAdd, List<MovieEntity> newMovies);

    List<ScreeningDto> getScreeningsByMovieId(Long movieId);

    ScreeningDto getScreeningById(Long screeningId);

}