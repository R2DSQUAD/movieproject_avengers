package org.spring.moviepj.openapi.movie.controller;

import java.util.List;

import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.repository.MovieRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OpenApiMovieRestController {
  private final MovieRepository movieRepository;

  @GetMapping("/boxOfficeList")
  public List<MovieEntity> boxOfficeList () {
    return movieRepository.findAll(); // 모든 사용자 데이터 조회
  
  
}
}
