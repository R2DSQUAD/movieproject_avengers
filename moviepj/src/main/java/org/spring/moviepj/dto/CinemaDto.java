package org.spring.moviepj.dto;

import java.util.List;

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
public class CinemaDto {
    private Long id;
    private String region;
    private String cinemaName;
    private double lat;
    private double lon;
    private String address;
    private List<TheaterEntity> theaterEntities;
}
