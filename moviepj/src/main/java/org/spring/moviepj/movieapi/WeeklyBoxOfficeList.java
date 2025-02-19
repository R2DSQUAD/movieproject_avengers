package org.spring.moviepj.movieapi;

import lombok.Data;

@Data
public class WeeklyBoxOfficeList {
    private String rnum; // 순번
    private String rank; // 현재 순위
    private String rankInten; // 순위 변동
    private String rankOldAndNew;// 신규 여부 (NEW / OLD)
    private String movieCd; // 영화 코드 (유니크 ID)
    private String movieNm; // 영화 제목
    private String openDt; // 개봉일
    private String salesAmt; // 주간 매출액
    private String salesShare; // 매출 점유율 (%)
    private String salesInten; // 매출 증감
    private String salesChange; // 매출 증감률
    private String salesAcc; // 누적 매출액
    private String audiCnt; // 주간 관객 수
    private String audiInten; // 관객 증감
    private String audiChange; // 관객 증감률
    private String audiAcc; // 누적 관객 수
    private String scrnCnt; // 스크린 수
    private String showCnt; // 상영 횟수
}
