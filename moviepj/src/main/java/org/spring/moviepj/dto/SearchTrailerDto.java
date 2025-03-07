package org.spring.moviepj.dto;

import java.time.LocalDateTime;

import org.spring.moviepj.entity.SearchEntity;

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
public class SearchTrailerDto {

    private Long id;

    private String name;

    private String type;

    private String url;

    private Long searchId;
    private SearchEntity searchEntity;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}