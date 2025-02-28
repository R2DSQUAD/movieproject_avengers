package org.spring.moviepj.dto;

import org.spring.moviepj.common.BasicTime;

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
public class CinemaDto extends BasicTime {
    private Long id;
    private String region;
    private String cinemaName;
    private double lat;
    private double lon;
    private String address;

}
