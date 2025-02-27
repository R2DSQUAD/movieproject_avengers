package org.spring.moviepj.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.spring.moviepj.common.BasicTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Entity
@Table(name = "movie_tb", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "movieCd", "createTime" })
})
public class MovieEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movie_id")
    private Long id;

    @Column(nullable = false)
    private String movieCd;

    @Column(nullable = false)
    private String movieNm;

    @Column(name = "movie_rank")
    private String rank;

    @Column(nullable = false)
    private String openDt;

    @Column(nullable = false)
    private String audiAcc;

    @Column(nullable = false)
    private String director; // tmdb디테일

    @Column(nullable = false)
    private String runTime; // tmdb디테일

    @Column(nullable = false)
    private String genres; // tmdb디테일

    @Column(columnDefinition = "TEXT")
    private String overview; // tmdb이미지

    private String poster_path; // tmdb이미지

    private String backdrop_path; // tmdb이미지

    @OneToMany(mappedBy = "movieEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ScreeningEntity> screeningEntities;

    @OneToMany(mappedBy = "movieEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TrailerEntity> trailerEntities; // tmdb트레일러

}
