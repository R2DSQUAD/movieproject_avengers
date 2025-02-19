package org.spring.moviepj.movieapi;

import java.util.List;

import lombok.Data;

@Data
public class BoxOfficeResult {

    private String boxofficeType;

    private String showRange;

    private String yearWeekTime;

    private List<WeeklyBoxOfficeList> weeklyBoxOfficeList;
}
