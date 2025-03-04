package org.spring.moviepj.dto;

import java.time.LocalDateTime;

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
public class TheaterDto {

    private Long id;

    private String name;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
