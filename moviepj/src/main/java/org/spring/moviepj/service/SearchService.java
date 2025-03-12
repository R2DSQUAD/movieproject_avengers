package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.SearchDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SearchService {

    void searchAndSaveMovies(String query);

    Page<SearchDto> searchMovieList(String query, String searchType, Pageable pageable);

    Page<SearchDto> searchAllList(Pageable pageable);

    SearchDto searchDetail(String movieCd);

}