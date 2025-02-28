package org.spring.moviepj.entity;

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
import jakarta.persistence.Table;
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
@Table(name = "cinema_tb")
public class CinemaEntity extends BasicTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cinema_id")
    private Long id;

    private String region; // 지역

    @Column(unique = true)
    private String cinemaName; // 영화관 이름

    private double lat; // 위도

    private double lon; // 경도

    private String address;

    @OneToMany(mappedBy = "cinemaEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // 순환참조 방지
    private List<TheaterEntity> theaterEntities;
}
