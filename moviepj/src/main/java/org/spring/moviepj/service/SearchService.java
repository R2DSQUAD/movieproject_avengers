package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.SearchDto;

public interface SearchService {

    void searchAndSaveMovies(String query);

    List<SearchDto> searchMovieList(String query, String SearchType);

}