package org.spring.moviepj.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
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

    @Value("${KOBIS_API_KEY}")
    private String KOBIS_API_KEY;

    @Value("${TMDB_API_KEY}")
    private String TMDB_API_KEY;

    private final String KOBIS_MOVIE_LIST_API = "https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=%s&movieNm=%s";
    private final String KOBIS_MOVIE_INFO_API = "https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=%s&movieCd=%s";
    private final String TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie?query=%s&api_key=%s&language=ko-KR";
    private final String TMDB_DETAIL_URL = "https://api.themoviedb.org/3/movie/%d?api_key=%s&language=ko-KR&append_to_response=credits";
    private final String TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";
    private final String TMDB_VIDEO_URL = "https://api.themoviedb.org/3/movie/%d/videos?api_key=%s&language=ko-KR";

    @Async
    public void searchAndSaveMoviesAsync(String query) {
        searchAndSaveMovies(query);
    }

    public void searchAndSaveMovies(String query) {
        try {
            String apiUrl = String.format(KOBIS_MOVIE_LIST_API, KOBIS_API_KEY, query);
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                JSONArray movies = jsonResponse.getJSONObject("movieListResult").getJSONArray("movieList");

                List<CompletableFuture<SearchEntity>> futures = movies.toList().parallelStream()
                        .map(movieObj -> CompletableFuture.supplyAsync(() -> {
                            JSONObject movie = new JSONObject((java.util.Map) movieObj);
                            String movieCd = movie.getString("movieCd");

                            String openDt = movie.optString("openDt", "");
                            if (!isAfter2000(openDt) || searchRepository.existsByMovieCd(movieCd)) {
                                return null;
                            }

                            return fetchMovieDetails(movieCd, movie);
                        })).collect(Collectors.toList());

                // 모든 CompletableFuture가 완료될 때까지 기다림
                CompletableFuture<Void> allOf = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
                allOf.join();

                // 완료된 CompletableFuture의 결과를 수집
                List<SearchEntity> searchEntities = futures.stream()
                        .map(CompletableFuture::join)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());

                searchRepository.saveAll(searchEntities); // 벌크 저장 적용
                updateChosungForExistingData();
            }

        } catch (Exception e) {
            logger.error("Error occurred while searching and saving movies: {}", e.getMessage(), e);
        }
    }

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
            String movieInfoUrl = String.format(KOBIS_MOVIE_INFO_API, KOBIS_API_KEY, movieCd);
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

    public String normalizeMovieTitle(String title) {
        if (title == null)
            return "";

        title = title.replaceAll("[^a-zA-Z0-9가-힣\\s]", "");
        title = title.replaceAll("\\(.*?\\)", "");

        title = title.replaceAll("(?i)\\b극장판\\b", "");
        title = title.replaceAll("(?i)\\b더 무비\\b", "");
        title = title.replaceAll("(?i)\\b더무비\\b", "");
        title = title.replaceAll("(?i)\\bthe movie\\b", "");

        title = title.replaceAll("(?i)\\bmovie\\b", "");

        return title.replaceAll("\\s+", " ").trim();
    }

    private SearchEntity fetchTMDbDetails(SearchEntity searchEntity) {
        try {
            String encodedQuery = URLEncoder.encode(searchEntity.getMovieNm(), StandardCharsets.UTF_8);
            String apiUrl = String.format(TMDB_SEARCH_URL, encodedQuery, TMDB_API_KEY);
            ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JSONObject jsonResponse = new JSONObject(response.getBody());
                JSONArray results = jsonResponse.getJSONArray("results");

                if (!results.isEmpty()) {
                    String formattedOpenDt = formatOpenDt(searchEntity.getOpenDt());

                    JSONObject selectedMovie = null;
                    String normalizedKobisTitle = normalizeMovieTitle(searchEntity.getMovieNm());

                    for (int i = 0; i < results.length(); i++) {
                        JSONObject movie = results.getJSONObject(i);
                        String releaseDate = movie.optString("release_date", "");
                        String normalizedTmdbTitle = normalizeMovieTitle(movie.optString("title", ""));

                        if (releaseDate.equals(formattedOpenDt) &&
                                (normalizedKobisTitle.equals(normalizedTmdbTitle) ||
                                        normalizedKobisTitle.contains(normalizedTmdbTitle) ||
                                        normalizedTmdbTitle.contains(normalizedKobisTitle))) {
                            selectedMovie = movie;
                            break;
                        }
                    }

                    if (selectedMovie == null) {
                        selectedMovie = results.getJSONObject(0);
                    }

                    Integer tmdbId = selectedMovie.getInt("id");
                    searchEntity.setOverview(selectedMovie.optString("overview", "줄거리 정보 없음"));
                    searchEntity.setPoster_path(TMDB_IMAGE_URL + "/w500/" + selectedMovie.optString("poster_path"));
                    searchEntity.setBackdrop_path(
                            TMDB_IMAGE_URL + "/w1920_and_h800_multi_faces/" + selectedMovie.optString("backdrop_path"));

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
            String url = String.format(TMDB_DETAIL_URL, tmdbId, TMDB_API_KEY);
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
            String url = String.format(TMDB_VIDEO_URL, tmdbId, TMDB_API_KEY);
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
    public Page<SearchDto> searchMovieList(String query, String searchType, Pageable pageable) {
        searchAndSaveMovies(query);

        String normalizedQuery = query.replaceAll("[^a-zA-Z0-9가-힣]", "").trim();
        String chosungQuery = HangulUtils.getChosung(query).replaceAll("[^ㄱ-ㅎ]", "").trim();

        Page<SearchEntity> searchEntities;

        if ("chosung".equals(searchType)) {
            searchEntities = searchRepository.findByMovieNmChosungIgnoreSpace(chosungQuery, pageable);
        } else {
            searchEntities = searchRepository.findByMovieNmContaining(normalizedQuery, pageable);
        }

        List<SearchDto> filteredResults = searchEntities.stream()
                .map(searchEntity -> {
                    String formattedOpenDt = formatOpenDt(searchEntity.getOpenDt());

                    List<MovieEntity> movieEntities = movieRepository
                            .findAllByMovieNmAndOpenDtOrderByCreateTimeDesc(searchEntity.getMovieNm(), formattedOpenDt);

                    if (!movieEntities.isEmpty()) {
                        MovieEntity latestMovie = movieEntities.get(0);
                        return SearchDto.builder()
                                .movieCd(latestMovie.getMovieCd())
                                .movieNm(latestMovie.getMovieNm())
                                .openDt(latestMovie.getOpenDt())
                                .directors(latestMovie.getDirector())
                                .genreAlt(latestMovie.getGenres())
                                .watchGradeNm(latestMovie.getWatchGradeNm())
                                .runTime(latestMovie.getRunTime())
                                .overview(latestMovie.getOverview())
                                .poster_path(latestMovie.getPoster_path())
                                .backdrop_path(latestMovie.getBackdrop_path())
                                .build();
                    } else {
                        if (searchEntity.getPoster_path() == null || searchEntity.getPoster_path().isEmpty()) {
                            return null;
                        }
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
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return new PageImpl<>(filteredResults, pageable, filteredResults.size());
    }

    private String formatOpenDt(String openDt) {
        if (openDt == null || openDt.length() != 8) {
            return openDt;
        }
        return LocalDate.parse(openDt, DateTimeFormatter.ofPattern("yyyyMMdd"))
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    private boolean isAfter2000(String openDt) {
        if (openDt == null || openDt.length() != 8) {
            return false;
        }
        int year = Integer.parseInt(openDt.substring(0, 4));
        return year >= 2000;
    }

    @Override
    public Page<SearchDto> searchAllList(Pageable pageable) {
        Page<SearchEntity> searchEntities = searchRepository.findAllByPosterPathIsNotNull(pageable);

        List<SearchDto> resultList = searchEntities.getContent().stream()
                .map(searchEntity -> {
                    String formattedOpenDt = formatOpenDt(searchEntity.getOpenDt());

                    List<MovieEntity> movieEntities = movieRepository
                            .findAllByMovieNmAndOpenDtOrderByCreateTimeDesc(searchEntity.getMovieNm(), formattedOpenDt);

                    if (!movieEntities.isEmpty()) {
                        MovieEntity latestMovie = movieEntities.get(0);
                        return SearchDto.builder()
                                .movieCd(latestMovie.getMovieCd())
                                .movieNm(latestMovie.getMovieNm())
                                .openDt(latestMovie.getOpenDt())
                                .directors(latestMovie.getDirector())
                                .genreAlt(latestMovie.getGenres())
                                .watchGradeNm(latestMovie.getWatchGradeNm())
                                .runTime(latestMovie.getRunTime())
                                .overview(latestMovie.getOverview())
                                .poster_path(latestMovie.getPoster_path())
                                .backdrop_path(latestMovie.getBackdrop_path())
                                .build();
                    } else {
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

        return new PageImpl<>(resultList, pageable, searchEntities.getTotalElements());
    }

    @Override
    public SearchDto searchDetail(String movieCd) {
        SearchEntity searchEntity = searchRepository.findByMovieCd(movieCd)
                .orElseThrow(() -> new RuntimeException("해당 movieCd에 대한 데이터를 찾을 수 없습니다."));

        return SearchDto.builder()
                .movieCd(searchEntity.getMovieCd())
                .movieNm(searchEntity.getMovieNm())
                .openDt(searchEntity.getOpenDt())
                .directors(searchEntity.getDirectors())
                .genreAlt(searchEntity.getGenreAlt())
                .watchGradeNm(searchEntity.getWatchGradeNm())
                .runTime(searchEntity.getRunTime())
                .overview(searchEntity.getOverview())
                .poster_path(searchEntity.getPoster_path())
                .backdrop_path(searchEntity.getBackdrop_path())
                .build();
    }
}