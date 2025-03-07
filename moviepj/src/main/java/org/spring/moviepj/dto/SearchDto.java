package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.moviepj.entity.SearchTrailerEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
public class SearchDto {

    private Long id;

    private String movieCd;

    private String movieNm;

    private String openDt;

    private String directors;

    private String genreAlt;

    private String watchGradeNm;

    private String runTime;

    private String overview;

    private String poster_path;

    private String backdrop_path;

    private List<SearchTrailerEntity> searchTrailerEntities;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}