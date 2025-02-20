package org.spring.moviepj.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.movieapi.MovieListResponse;
import org.spring.moviepj.movieapi.WeeklyBoxOfficeList;
import org.spring.moviepj.openapi.util.OpenApiUtil;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.service.MovieService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate;

    private static final String KOBIS_API_KEY = "1d713276de7baae34e9d5c43f2f0c4b3";
    private static final String KOBIS_API_URL = "https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json";

    private static final String TMDB_API_KEY = "3faa3953bb1d0746b8d7294bd106d787";
    private static final String TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie?query=%s&api_key=%s&language=ko-KR";
    private static final String TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/";

    @Scheduled(cron = "0 00 10 * * MON")
    public void fetchAndSaveWeeklyBoxOffice() {
        System.out.println(">>> [스케줄 실행됨] 박스오피스 데이터 가져오기 시작");
        String targetDate = getLastSundayDate();
        String apiUrl = KOBIS_API_URL + "?key=" + KOBIS_API_KEY + "&targetDt=" + targetDate;

        System.out.println("박스오피스 데이터 가져오기: " + apiUrl);

        String responseBody = OpenApiUtil.get(apiUrl, Collections.emptyMap());
        insertResponseBody(responseBody);
    }

    @Override
    @Transactional
    public void insertResponseBody(String responseBody) {
        System.out.println("API 응답 데이터: " + responseBody);

        ObjectMapper objectMapper = new ObjectMapper();
        MovieListResponse movieListResponse;

        try {
            movieListResponse = objectMapper.readValue(responseBody, MovieListResponse.class);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }

        List<WeeklyBoxOfficeList> movieItems = movieListResponse.getBoxOfficeResult().getWeeklyBoxOfficeList();

        for (WeeklyBoxOfficeList el : movieItems) {
            System.out.println("새로운 영화 데이터 저장: " + el.getMovieNm());

            // TMDb API에서 추가 정보 가져오기
            String overview = null;
            String posterPath = null;
            String backdropPath = null;

            try {
                String query = URLEncoder.encode(el.getMovieNm(), StandardCharsets.UTF_8);
                String tmdbApiUrl = String.format(TMDB_SEARCH_URL, query, TMDB_API_KEY);
                ResponseEntity<String> tmdbResponse = restTemplate.getForEntity(tmdbApiUrl, String.class);

                if (tmdbResponse.getStatusCode().is2xxSuccessful()) {
                    JSONObject jsonResponse = new JSONObject(tmdbResponse.getBody());
                    JSONArray results = jsonResponse.getJSONArray("results");

                    for (int i = 0; i < results.length(); i++) {
                        JSONObject movieData = results.getJSONObject(i);
                        String tmdbTitle = movieData.optString("title", "").trim(); // TMDb 제목

                        // ✅ 제목이 정확히 일치하는 경우 저장
                        // ✅ 제목이 공백 제거 후 정확히 일치하는 경우 저장
                        if (tmdbTitle.replaceAll("\\s+", "").equalsIgnoreCase(el.getMovieNm().replaceAll("\\s+", ""))) {
                            overview = movieData.optString("overview", "줄거리 정보 없음");
                            posterPath = (movieData.optString("poster_path", null) != null)
                                    ? TMDB_IMAGE_URL + "w500/" + movieData.optString("poster_path", null)
                                    : null;
                            backdropPath = (movieData.optString("backdrop_path", null) != null)
                                    ? TMDB_IMAGE_URL + "w1920_and_h800_multi_faces/" + movieData.optString("backdrop_path", null)
                                    : null;
                            break;
                        }

                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("TMDb API 호출 오류: " + e.getMessage());
            }

            // 영화 저장
            MovieEntity movie = MovieEntity.builder()
                    .movieCd(el.getMovieCd())
                    .movieNm(el.getMovieNm())
                    .rank(el.getRank())
                    .openDt(el.getOpenDt())
                    .audiAcc(el.getAudiAcc())
                    .overview(overview)
                    .poster_path(posterPath)
                    .backdrop_path(backdropPath)
                    .build();

            movieRepository.save(movie);
            System.out.println("영화 저장 완료: " + el.getMovieNm());
        }
    }

    /**
     * 가장 가까운 일요일 날짜 가져오기 (박스오피스 기준 날짜)
     */
    private String getLastSundayDate() {
        LocalDate today = LocalDate.now();
        LocalDate lastSunday = today.with(java.time.DayOfWeek.SUNDAY).minusWeeks(1);
        return lastSunday.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

}