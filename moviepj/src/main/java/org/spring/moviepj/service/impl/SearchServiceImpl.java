package org.spring.moviepj.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.spring.moviepj.dto.SearchDto;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.SearchEntity;
import org.spring.moviepj.entity.SearchTrailerEntity;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.repository.SearchRepository;
import org.spring.moviepj.repository.SearchTrailerRepository;
import org.spring.moviepj.service.SearchService;
import org.spring.moviepj.util.HangulUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class SearchServiceImpl implements SearchService {

    private static final Logger logger = LoggerFactory.getLogger(SearchServiceImpl.class);

    private final MovieRepository movieRepository;
    private final SearchRepository searchRepository;
    private final SearchTrailerRepository searchTrailerRepository;
    private final RestTemplate restTemplate;

    private static final String KOBIS_MOVIE_LIST_API = "https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=1d713276de7baae34e9d5c43f2f0c4b3&movieNm=%s";
    private static final String KOBIS_MOVIE_INFO_API = "https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=1d713276de7baae34e9d5c43f2f0c4b3&movieCd=%s";
    private static final String TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie?query=%s&api_key=3faa3953bb1d0746b8d7294bd106d787&language=ko-KR";
    private static final String TMDB_DETAIL_URL = "https://api.themoviedb.org/3/movie/%d?api_key=3faa3953bb1d0746b8d7294bd106d787&language=ko-KR&append_to_response=credits";
    private static final String TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";
    private static final String TMDB_VIDEO_URL = "https://api.themoviedb.org/3/movie/%d/videos?api_key=3faa3953bb1d0746b8d7294bd106d787&language=ko-KR";

    @Override
public void searchAndSaveMovies(String query) {
    try {
        String apiUrl = String.format(KOBIS_MOVIE_LIST_API, query);

        ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            JSONObject jsonResponse = new JSONObject(response.getBody());
            JSONArray movies = jsonResponse.getJSONObject("movieListResult").getJSONArray("movieList");

            for (int i = 0; i < movies.length(); i++) {
                JSONObject movie = movies.getJSONObject(i);
                String movieCd = movie.getString("movieCd");

                // 개봉일 필터링: 2000년도 이후의 영화만 저장
                String openDt = movie.optString("openDt", "");
                if (!isAfter2000(openDt)) {
                    continue; // 2000년 이후 영화가 아니면 저장하지 않음
                }

                // 기존에 저장된 영화인지 확인
                if (searchRepository.existsByMovieCd(movieCd)) {
                    logger.info("이미 존재하는 영화: {} (저장하지 않음)", movieCd);
                    continue; // 이미 있으면 저장하지 않고 넘어감
                }

                SearchEntity searchEntity = fetchMovieDetails(movieCd, movie);
                if (searchEntity != null) {
                    searchRepository.save(searchEntity);
                }
            }
            updateChosungForExistingData(); // 기존 데이터 초성 업데이트
        }

    } catch (Exception e) {
        logger.error("Error occurred while searching and saving movies: {}", e.getMessage());
        e.printStackTrace();
    }
}

    // movieNmChosung이 비어있을경우 값을 추가해주는 로직
    @Transactional
    public void updateChosungForExistingData() {
        List<SearchEntity> entitiesToUpdate = searchRepository.findByMovieNmChosungIsNull(); // 비어있을경우
        for (SearchEntity entity : entitiesToUpdate) {
            entity.setMovieNmChosung(HangulUtils.getChosung(entity.getMovieNm()));
        }
        searchRepository.saveAll(entitiesToUpdate);
    }

    private SearchEntity fetchMovieDetails(String movieCd, JSONObject movie) {
        try {
            String movieInfoUrl = String.format(KOBIS_MOVIE_INFO_API, movieCd);
            ResponseEntity<String> response = restTemplate.getForEntity(movieInfoUrl, String.class);

            String watchGradeNm = null;
            String directors = "";

            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                JSONObject movieInfo = jsonResponse.getJSONObject("movieInfoResult").getJSONObject("movieInfo");
                JSONArray directorsArray = movieInfo.getJSONArray("directors");

                List<String> directorNames = new ArrayList<>();
                for (int i = 0; i < directorsArray.length(); i++) {
                    directorNames.add(directorsArray.getJSONObject(i).getString("peopleNm"));
                }
                directors = String.join(", ", directorNames);

                logger.info(" 변환된 directors: {}", directors);

                JSONArray audits = movieInfo.getJSONArray("audits");
                if (!audits.isEmpty()) {
                    watchGradeNm = audits.getJSONObject(0).optString("watchGradeNm", null);
                }
            }

            SearchEntity searchEntity = SearchEntity.builder()
                    .movieCd(movieCd)
                    .movieNm(movie.getString("movieNm"))
                    .movieNmChosung(HangulUtils.getChosung(movie.getString("movieNm")))
                    .openDt(movie.optString("openDt", ""))
                    .directors(directors)
                    .genreAlt(movie.optString("genreAlt", ""))
                    .watchGradeNm(watchGradeNm)
                    .build();

            return fetchTMDbDetails(searchEntity);
        } catch (Exception e) {
            logger.error("Error fetching movie details for movieCd {}: {}", movieCd, e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private SearchEntity fetchTMDbDetails(SearchEntity searchEntity) {
        try {
            String encodedQuery = URLEncoder.encode(searchEntity.getMovieNm(), StandardCharsets.UTF_8);
            String apiUrl = String.format(TMDB_SEARCH_URL, encodedQuery);
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                JSONArray results = jsonResponse.getJSONArray("results");

                if (!results.isEmpty()) {
                    String formattedOpenDt = formatOpenDt(searchEntity.getOpenDt()); // 개봉일 변환

                    // TMDb 검색 결과 중에서 개봉일이 일치하는 영화 찾기
                    JSONObject selectedMovie = null;
                    for (int i = 0; i < results.length(); i++) {
                        JSONObject movie = results.getJSONObject(i);
                        String releaseDate = movie.optString("release_date", "");

                        if (releaseDate.equals(formattedOpenDt)) { // 개봉일이 정확히 일치하는 경우
                            selectedMovie = movie;
                            break;
                        }
                    }

                    // 개봉일이 일치하는 영화가 없으면 첫 번째 결과 사용 (이전 방식)
                    if (selectedMovie == null) {
                        selectedMovie = results.getJSONObject(0);
                    }

                    Integer tmdbId = selectedMovie.getInt("id");
                    searchEntity.setOverview(selectedMovie.optString("overview", "줄거리 정보 없음"));
                    searchEntity.setPoster_path(TMDB_IMAGE_URL + "/w500/" + selectedMovie.optString("poster_path"));
                    searchEntity.setBackdrop_path(
                            TMDB_IMAGE_URL + "/w1920_and_h800_multi_faces/" + selectedMovie.optString("backdrop_path"));

                    // 영화 러닝타임 및 예고편 정보 추가
                    searchEntity = fetchMovieRuntime(searchEntity, tmdbId);
                    fetchAndSaveTrailers(searchEntity, tmdbId);
                }
            }
        } catch (Exception e) {
            logger.error("Error fetching TMDb details: {}", e.getMessage());
            e.printStackTrace();
        }
        return searchEntity;
    }

    private SearchEntity fetchMovieRuntime(SearchEntity searchEntity, int tmdbId) {
        try {
            String url = String.format(TMDB_DETAIL_URL, tmdbId);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                searchEntity.setRunTime(jsonResponse.optInt("runtime") + "분");
            }
        } catch (Exception e) {
            logger.error("Error fetching movie runtime for tmdbId {}: {}", tmdbId, e.getMessage());
            e.printStackTrace();
        }
        return searchEntity;
    }

    private void fetchAndSaveTrailers(SearchEntity searchEntity, int tmdbId) {
        try {
            String url = String.format(TMDB_VIDEO_URL, tmdbId);
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                JSONArray results = jsonResponse.getJSONArray("results");
                List<SearchTrailerEntity> trailers = new ArrayList<>();
                for (int i = 0; i < results.length(); i++) {
                    JSONObject video = results.getJSONObject(i);
                    if ("YouTube".equalsIgnoreCase(video.optString("site"))) {
                        trailers.add(SearchTrailerEntity.builder()
                                .searchEntity(searchEntity)
                                .name(video.optString("name"))
                                .type(video.optString("type"))
                                .url(video.optString("key"))
                                .build());
                    }
                }
                searchTrailerRepository.saveAll(trailers);
            }
        } catch (Exception e) {
            logger.error("Error fetching and saving trailers for tmdbId {}: {}", tmdbId, e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public List<SearchDto> searchMovieList(String query, String searchType) {
        // 검색어 정규화 (띄어쓰기 및 특수문자 제거)
        String normalizedQuery = query.replaceAll("[^a-zA-Z0-9가-힣]", "").trim();
        // 초성 변환
        String chosungQuery = HangulUtils.getChosung(query).trim();

        List<SearchEntity> searchEntities;

        if ("chosung".equals(searchType)) {
            // 초성 검색
            searchEntities = searchRepository.findByMovieNmChosungContaining(chosungQuery);
        } else {
            // 일반 검색
            searchEntities = searchRepository.findByMovieNmContaining(normalizedQuery);
        }

        // `searchEntities`에서 `MovieEntity` 조회 후 `SearchDto` 변환
        List<MovieEntity> movieEntities = searchEntities.stream()
                .map(searchEntity -> {
                    String formattedOpenDt = formatOpenDt(searchEntity.getOpenDt());
                    return movieRepository.findByMovieNmAndOpenDt(searchEntity.getMovieNm(), formattedOpenDt);
                })
                .filter(Optional::isPresent) // 존재하는 경우만 가져오기
                .map(Optional::get)
                .collect(Collectors.toList());

        return searchEntities.stream()
                .map(searchEntity -> {
                    String formattedOpenDt = formatOpenDt(searchEntity.getOpenDt());
                    Optional<MovieEntity> movieEntityOpt = movieRepository
                            .findByMovieNmAndOpenDt(searchEntity.getMovieNm(), formattedOpenDt);

                    if (movieEntityOpt.isPresent()) {
                        MovieEntity movie = movieEntityOpt.get();
                        logger.info("[MovieEntity 사용] {} ({})", movie.getMovieNm(), movie.getMovieCd());

                        return SearchDto.builder()
                                .movieCd(movie.getMovieCd())
                                .movieNm(movie.getMovieNm())
                                .openDt(movie.getOpenDt())
                                .directors(movie.getDirector())
                                .genreAlt(movie.getGenres())
                                .watchGradeNm(movie.getWatchGradeNm())
                                .runTime(movie.getRunTime())
                                .overview(movie.getOverview())
                                .poster_path(movie.getPoster_path())
                                .backdrop_path(movie.getBackdrop_path())
                                .build();
                    } else {
                        logger.info("[SearchEntity 사용] {} ({})", searchEntity.getMovieNm(), searchEntity.getMovieCd());

                        return SearchDto.builder()
                                .movieCd(searchEntity.getMovieCd())
                                .movieNm(searchEntity.getMovieNm())
                                .openDt(formattedOpenDt)
                                .directors(searchEntity.getDirectors())
                                .genreAlt(searchEntity.getGenreAlt())
                                .watchGradeNm(searchEntity.getWatchGradeNm())
                                .runTime(searchEntity.getRunTime())
                                .overview(searchEntity.getOverview())
                                .poster_path(searchEntity.getPoster_path())
                                .backdrop_path(searchEntity.getBackdrop_path())
                                .build();
                    }
                })
                .collect(Collectors.toList());
    }

    /**
     * openDt 변환 메서드
     * - 20250228 → 2025-02-28 형식으로 변환
     */
    private String formatOpenDt(String openDt) {
        if (openDt == null || openDt.length() != 8) {
            return openDt; // 변환 불가능하면 원본 반환
        }
        return LocalDate.parse(openDt, DateTimeFormatter.ofPattern("yyyyMMdd"))
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    private boolean isAfter2000(String openDt) {
        if (openDt == null || openDt.length() != 8) {
            return false; // openDt가 없거나 형식이 맞지 않으면 false 반환
        }
        int year = Integer.parseInt(openDt.substring(0, 4)); // openDt에서 연도만 추출
        return year >= 2000;
    }
}
