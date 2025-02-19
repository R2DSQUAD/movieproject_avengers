package org.spring.moviepj.entity;

import java.time.LocalDate;
import java.time.LocalTime;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "screening_tb", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "theater_id", "screeningDate", "screeningTime" }) // 상영관중복방지
})

public class ScreeningEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "screening_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    private MovieEntity movieEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id")
    private TheaterEntity theaterEntity;

    @Column(nullable = false)
    private LocalDate screeningDate; // 상영 날짜

    @Column(nullable = false)
    private LocalTime screeningTime; // 상영 시작 시간

    @Column(nullable = false)
    private LocalTime screeningEndTime;

    @OneToMany(mappedBy = "screeningEntity", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ScreeningSeatEntity> screeningSeatEntities;
}
