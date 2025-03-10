package org.spring.moviepj.service;

public interface ReplyLikeService {
    void addLike(Long replyId, String email);

    void removeLike(Long replyId, String email);
}
