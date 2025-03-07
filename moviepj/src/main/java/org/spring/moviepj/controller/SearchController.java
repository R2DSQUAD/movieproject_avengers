package org.spring.moviepj.controller;

import java.util.List;

import org.spring.moviepj.dto.SearchDto;
import org.spring.moviepj.service.impl.SearchServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final SearchServiceImpl searchServiceImpl;

    @GetMapping("/search")
    public ResponseEntity<List<SearchDto>> searchMovies(@RequestParam(name = "query") String query) {

        searchServiceImpl.searchAndSaveMovies(query);

        List<SearchDto> searchDtos = searchServiceImpl.searchMovieList(query);

        return ResponseEntity.status(HttpStatus.OK).body(searchDtos);
    }
}