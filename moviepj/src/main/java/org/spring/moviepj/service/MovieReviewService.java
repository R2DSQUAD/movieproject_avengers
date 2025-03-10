package org.spring.moviepj.service;


import jakarta.validation.Valid;

import java.util.List;

import org.spring.moviepj.dto.MovieReviewDto;
import org.spring.moviepj.dto.ReplyDto;

public interface MovieReviewService {
    List<MovieReviewDto> movieReviewList(Long id);
    void insertMovieReview(@Valid MovieReviewDto movieReviewDto);
    void movieReviewDelete(Long id);

}
