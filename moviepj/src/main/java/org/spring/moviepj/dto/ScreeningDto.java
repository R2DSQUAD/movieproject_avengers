package org.spring.moviepj.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.spring.moviepj.entity.CartItemEntity;
import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.TheaterEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreeningDto {

    private Long id;

    private Long movieId;
    private MovieEntity movieEntity;

    private Long theaterId;
    private TheaterEntity theaterEntity;

    private Long cinemaId;
    private CinemaEntity cinemaEntity;

    private String cinemaName;
   
    private LocalDate screeningDate; // 상영 날짜

    private LocalTime screeningTime; // 상영 시작 시간

    private LocalTime screeningEndTime;

    private List<CartItemEntity> cartItemEntities;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
