package org.spring.moviepj.dto.movie;

import java.util.List;

import lombok.Data;

@Data
public class MovieItem {
    private String movieCd;
    private String movieNm;
    private String repGenreNm;
    private String openDt;
    private List<DirectorItem> directors; // 감독 정보

    // getters and setters
}

@Data
class DirectorItem {
    private String peopleNm; // 감독 이름

    // getters and setters
}
