package org.spring.moviepj.entity;

import java.util.List;

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
public class CinemaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cinema_id")
    private Long id;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false, unique = true)
    private String cinemaName;

    private double lat;
    private double lon;
    private String address;

    // TheaterEntity 1:N
    @OneToMany(mappedBy = "cinemaEntity", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<TheaterEntity> theaterEntities;

}
