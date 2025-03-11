package org.spring.moviepj.controller;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.spring.moviepj.dto.SearchDto;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.SearchEntity;
import org.spring.moviepj.entity.SearchTrailerEntity;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.repository.SearchTrailerRepository;
import org.spring.moviepj.service.impl.SearchServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Sort;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final SearchServiceImpl searchServiceImpl;
    private final MovieRepository movieRepository;
    private final SearchTrailerRepository searchTrailerRepository;

    @GetMapping("/search")
    public ResponseEntity<Page<SearchDto>> searchMovies(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "searchType", defaultValue = "normal") String searchType,
            @RequestParam(name = "sortOption", defaultValue = "release") String sortOption,
            @PageableDefault(page = 0, size = 8) Pageable pageable) {

        Sort sort = Sort.by(Sort.Order.desc("openDt")); // 기본적으로 개봉순 내림차순
        if ("alphabetical".equals(sortOption)) {
            sort = Sort.by(Sort.Order.asc("movieNm")); // 가나다 순 오름차순
        }

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        Page<SearchDto> searchDtos = searchServiceImpl.searchMovieList(query, searchType, sortedPageable);
        return ResponseEntity.ok(searchDtos);
    }

    @GetMapping("/searchList")
    public ResponseEntity<Page<SearchDto>> searchList(
            @RequestParam(name = "sortOption", defaultValue = "release") String sortOption,
            @PageableDefault(page = 0, size = 8) Pageable pageable) {

        Sort sort = Sort.by(Sort.Order.desc("openDt")); // 기본적으로 개봉순 내림차순
        if ("alphabetical".equals(sortOption)) {
            sort = Sort.by(Sort.Order.asc("movieNm")); // 가나다 순 오름차순
        }

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        Page<SearchDto> searchDtos = searchServiceImpl.searchAllList(sortedPageable);

        return ResponseEntity.ok(searchDtos);
    }

    @GetMapping("/searchDetail/{movieCd}")
    public ResponseEntity<?> searchDetail(@PathVariable String movieCd) {
        SearchDto searchDto = searchServiceImpl.searchDetail(movieCd);

        return ResponseEntity.ok(searchDto);
    }

}