package org.spring.moviepj.service;

public interface MovieReviewLikeService {
    void addLike(Long movieReviewId, String email);

    void removeLike(Long movieReviewId, String email);
}
