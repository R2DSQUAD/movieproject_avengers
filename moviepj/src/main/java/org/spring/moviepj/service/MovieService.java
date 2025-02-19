package org.spring.moviepj.service;

import org.spring.moviepj.dto.MovieDto;

public interface MovieService {

    void insertResponseBody(String responseBody);

    MovieDto movieDetail(Long id);

}
