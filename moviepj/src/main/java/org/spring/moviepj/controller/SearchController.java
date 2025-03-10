package org.spring.moviepj.controller;

import java.util.List;

import org.spring.moviepj.dto.SearchDto;
import org.spring.moviepj.entity.SearchTrailerEntity;
import org.spring.moviepj.repository.SearchTrailerRepository;
import org.spring.moviepj.service.impl.SearchServiceImpl;
import org.springframework.data.domain.Page;
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
    private final SearchTrailerRepository searchTrailerRepository;

    @GetMapping("/search")
    public ResponseEntity<Page<SearchDto>> searchMovies(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "searchType", defaultValue = "normal") String searchType,
            @PageableDefault(page = 0, size = 8, sort = "openDt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<SearchDto> searchDtos = searchServiceImpl.searchMovieList(query, searchType, pageable);
        return ResponseEntity.ok(searchDtos);
    }

    @GetMapping("/searchList")
    public ResponseEntity<Page<SearchDto>> searchList(
            @PageableDefault(page = 0, size = 8, sort = "openDt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<SearchDto> searchDtos = searchServiceImpl.searchAllList(pageable);

        return ResponseEntity.ok(searchDtos);
    }

    @GetMapping("/searchTrailerList/{movieCd}")
    public ResponseEntity<List<SearchTrailerEntity>> getSearchTrailers(@PathVariable String movieCd) {
        List<SearchTrailerEntity> trailers = searchTrailerRepository.findByMovieCd(movieCd);

        if (trailers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(trailers);
    }

}
