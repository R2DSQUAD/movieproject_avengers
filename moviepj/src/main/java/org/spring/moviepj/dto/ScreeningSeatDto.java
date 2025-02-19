package org.spring.moviepj.dto;

import java.time.LocalDateTime;

import org.spring.moviepj.entity.ScreeningEntity;

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
public class ScreeningSeatDto {

    private Long id;

    private Long screeningId;
    private ScreeningEntity screeningEntity;

    private int price;

    private int seatStatus;

    private String seatNumber;

    private int seatCount;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
