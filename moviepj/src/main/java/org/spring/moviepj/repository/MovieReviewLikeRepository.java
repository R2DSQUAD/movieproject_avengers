package org.spring.moviepj.repository;

import org.spring.moviepj.entity.MovieReviewLikeEntity;
import org.spring.moviepj.entity.ReplyLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieReviewLikeRepository extends JpaRepository<MovieReviewLikeEntity, Long> {

    // 특정 댓글에 대해 사용자가 좋아요를 눌렀는지 확인하는 메서드 
    boolean existsByMovieReviewEntity_IdAndMemberEntity_Email(Long movieReviewId, String email);

    // 특정 댓글에 대한 좋아요 수 가져오기
    int countByMovieReviewEntity_Id(Long movieReviewId);

    // 특정 댓글과 사용자에 대한 좋아요 삭제
    void deleteByMovieReviewEntity_IdAndMemberEntity_Email(Long movieReviewId, String email);
}
