// package org.spring.moviepj.controller;

// import java.util.Map;
// import java.util.HashMap;

// import org.spring.moviepj.openapi.util.OpenApiUtil;
// import org.spring.moviepj.service.impl.MovieServiceImpl;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/movie")
// @RequiredArgsConstructor
// public class MovieController {

// private final MovieServiceImpl movieService;

// String key = "6d749020f50e423cb72779121ef021b1";
// String movieSearch = "searchMovieList.json";
// String openStartDt = "2025";
// String itemPerPage = "20";

// @GetMapping("/movieList")
// public ResponseEntity<?> movieList() {
// String appURL = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/"
// + movieSearch + "?key=" + key
// + "&itemPerPage=" + itemPerPage + "&openStartDt=" + openStartDt;
// Map<String, String> movie = new HashMap<>();
// Map<String, String> requestHeaders = new HashMap<>();
// requestHeaders.put("Content-Type", "application/json");

// String responseBody = OpenApiUtil.get(appURL, requestHeaders);
// movie.put("movie", responseBody);

// // movieService.insertResponseBody(responseBody);
// return ResponseEntity.status(HttpStatus.OK).body(movie);
// }
// }
