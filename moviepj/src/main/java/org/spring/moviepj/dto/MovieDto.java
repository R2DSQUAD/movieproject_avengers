package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.moviepj.entity.ScreeningEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
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
public class MovieDto {

    private Long id;

    private String movieCd;

    private String movieNm;

    private String rank;

    private String openDt;

    private String audiAcc;

    private String watchGradeNm;

    private String director;

    private String runTime;

    private String genres;

    private String overview;

    private String poster_path;

    private String backdrop_path;

    private Long screeningId;
    private List<ScreeningEntity> screeningEntities;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
    private Double averageRating;
}
