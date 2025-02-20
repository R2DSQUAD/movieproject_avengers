package org.spring.moviepj.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.spring.moviepj.dto.MovieDto;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.TrailerEntity;
import org.spring.moviepj.movieapi.MovieListResponse;
import org.spring.moviepj.movieapi.WeeklyBoxOfficeList;
import org.spring.moviepj.openapi.util.OpenApiUtil;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.repository.TrailerRepository;
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
    private final TrailerRepository trailerRepository;
    private final RestTemplate restTemplate;

    private static final String KOBIS_API_KEY = "1d713276de7baae34e9d5c43f2f0c4b3";
    private static final String KOBIS_API_URL = "https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json";

    private static final String TMDB_API_KEY = "3faa3953bb1d0746b8d7294bd106d787";
    private static final String TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie?query=%s&api_key=%s&language=ko-KR";
    private static final String TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
    private static final String TMDB_VIDEO_URL = "https://api.themoviedb.org/3/movie/%d/videos?api_key=%s&language=ko-KR";

    @Scheduled(cron = "0 55 10 * * THU")
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

            String overview = null;
            String posterPath = null;
            String backdropPath = null;
            Integer tmdbId = null;

            try {
                String query = URLEncoder.encode(el.getMovieNm(), StandardCharsets.UTF_8);
                String tmdbApiUrl = String.format(TMDB_SEARCH_URL, query, TMDB_API_KEY);
                ResponseEntity<String> tmdbResponse = restTemplate.getForEntity(tmdbApiUrl, String.class);

                if (tmdbResponse.getStatusCode().is2xxSuccessful()) {
                    JSONObject jsonResponse = new JSONObject(tmdbResponse.getBody());
                    JSONArray results = jsonResponse.getJSONArray("results");

                    for (int i = 0; i < results.length(); i++) {
                        JSONObject movieData = results.getJSONObject(i);
                        String tmdbTitle = movieData.optString("title", "").trim();

                        if (tmdbTitle.replaceAll("\\s+", "").equalsIgnoreCase(el.getMovieNm().replaceAll("\\s+", ""))) {
                            overview = movieData.optString("overview", "줄거리 정보 없음");
                            posterPath = movieData.optString("poster_path", null) != null
                                    ? TMDB_IMAGE_URL + movieData.optString("poster_path")
                                    : null;
                            backdropPath = movieData.optString("backdrop_path", null) != null
                                    ? TMDB_IMAGE_URL + movieData.optString("backdrop_path")
                                    : null;
                            tmdbId = movieData.optInt("id");
                            break;
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("TMDb API 호출 오류: " + e.getMessage());
            }

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

            // 트레일러 리스트 저장
            if (tmdbId != null) {
                List<TrailerEntity> trailers = getMovieTrailerList(movie, tmdbId);
                if (!trailers.isEmpty()) {
                    trailerRepository.saveAll(trailers);
                    System.out.println("트레일러 저장 완료: " + el.getMovieNm());
                }
            }
        }
    }

    private List<TrailerEntity> getMovieTrailerList(MovieEntity movie, int movieId) {
        List<TrailerEntity> trailers = new ArrayList<>();
        try {
            String url = String.format(TMDB_VIDEO_URL, movieId, TMDB_API_KEY);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                JSONArray results = jsonResponse.getJSONArray("results");

                for (int i = 0; i < results.length(); i++) {
                    JSONObject video = results.getJSONObject(i);

                    if ("YouTube".equalsIgnoreCase(video.optString("site"))) {
                        String type = video.optString("type");
                        String name = video.optString("name");
                        String key = video.optString("key");
                        String youtubeUrl = "https://www.youtube.com/watch?v=" + key;

                        TrailerEntity trailer = TrailerEntity.builder()
                                .movieEntity(movie)
                                .name(name)
                                .type(type)
                                .url(youtubeUrl)
                                .build();

                        trailers.add(trailer);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("트레일러 가져오기 실패: " + e.getMessage());
        }

        return trailers;
    }

    private String getLastSundayDate() {
        LocalDate today = LocalDate.now();
        LocalDate lastSunday = today.with(java.time.DayOfWeek.SUNDAY).minusWeeks(1);
        return lastSunday.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

    @Override
    public MovieDto movieDetail(Long id) {

        throw new UnsupportedOperationException("Unimplemented method 'movieDetail'");
    }

}