package org.spring.moviepj.service.impl;

import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.MovieReviewEntity;
import org.spring.moviepj.entity.MovieReviewLikeEntity;

import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.repository.MovieReviewLikeRepository;
import org.spring.moviepj.repository.MovieReviewRepository;

import org.spring.moviepj.service.MovieReviewLikeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieReviewLikeServiceImpl implements MovieReviewLikeService {

    
    private final MovieReviewLikeRepository movieReviewLikeRepository;

   
    private final MovieReviewRepository movieReviewRepository;  // 리뷰 엔티티의 repository
   
    private final MemberRepository memberRepository;    // 사용자 엔티티의 repository

    // 좋아요 추가
    public void addLike(Long movieReviewId, String email) {
        // 이미 좋아요를 눌렀는지 확인
        if (movieReviewLikeRepository.existsByMovieReviewEntity_IdAndMemberEntity_Email(movieReviewId, email)) {
            throw new RuntimeException("이미 좋아요를 눌렀습니다.");
        }

        // 좋아요 추가
        MovieReviewEntity movieReviewEntity = movieReviewRepository.findById(movieReviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
        MemberEntity member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        MovieReviewLikeEntity movieReviewLikeEntity = new MovieReviewLikeEntity(movieReviewEntity, member);
        movieReviewLikeRepository.save(movieReviewLikeEntity);
    }

    // 좋아요 취소
    public void removeLike(Long movieReviewId, String email) {
        // 좋아요 취소
        if (!movieReviewLikeRepository.existsByMovieReviewEntity_IdAndMemberEntity_Email(movieReviewId, email)) {
            throw new RuntimeException("좋아요를 취소할 수 없습니다.");
        }

        movieReviewLikeRepository.deleteByMovieReviewEntity_IdAndMemberEntity_Email(movieReviewId, email);
    }

    public int getLikeCount(Long movieReviewId) {
        return movieReviewLikeRepository.countByMovieReviewEntity_Id(movieReviewId);
    }
}
