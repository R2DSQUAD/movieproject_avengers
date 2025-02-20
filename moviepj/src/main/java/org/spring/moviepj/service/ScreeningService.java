package org.spring.moviepj.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.spring.moviepj.dto.ScreeningDto;
import org.spring.moviepj.entity.ScreeningEntity;
import org.spring.moviepj.entity.TheaterEntity;

public interface ScreeningService {

    void createScreenings(int daysToAdd);

    List<ScreeningDto> getScreeningsByMovieId(Long movieId);

}