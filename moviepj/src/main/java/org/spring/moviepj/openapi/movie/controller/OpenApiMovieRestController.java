package org.spring.moviepj.openapi.movie.controller;

import java.util.List;

import org.spring.moviepj.dto.MovieDto;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.service.impl.MovieServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OpenApiMovieRestController {
  private final MovieRepository movieRepository;
  private final MovieServiceImpl movieServiceImpl;

  @GetMapping("/boxOfficeList")
  public List<MovieEntity> boxOfficeList() {
    return movieRepository.findAll();

  }

  @GetMapping("/boxOfficeList/{id}")
  public ResponseEntity<MovieDto> movieDetail(@PathVariable Long id) {
    MovieDto movieDto = movieServiceImpl.movieDetail(id);

    if (movieDto != null) {
      return ResponseEntity.ok(movieDto);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }
}
