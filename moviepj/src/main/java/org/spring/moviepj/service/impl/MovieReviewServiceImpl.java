package org.spring.moviepj.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.spring.moviepj.dto.MovieReviewDto;
import org.spring.moviepj.dto.ReplyDto;
import org.spring.moviepj.entity.BoardEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.MovieReviewEntity;
import org.spring.moviepj.entity.ReplyEntity;
import org.spring.moviepj.repository.BoardRepository;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.repository.MovieReviewRepository;
import org.spring.moviepj.repository.ReplyRepository;
import org.spring.moviepj.service.MovieReviewService;
import org.spring.moviepj.service.ReplyService;
import org.springframework.stereotype.Service;

import java.lang.reflect.Member;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieReviewServiceImpl implements MovieReviewService {
    private final MovieReviewRepository movieReviewRepository;
    private final MovieRepository movieRepository;
    private final MemberRepository memberRepository;
 

    @Override
    public List<MovieReviewDto> movieReviewList(Long id) {
        Optional<MovieEntity>optionalMovieEntity= movieRepository.findById(id);
        if(!optionalMovieEntity.isPresent()){
            throw new IllegalArgumentException("아이디 Fail");
        }
        List<MovieReviewEntity> movieReviewEntities=movieReviewRepository.findAllByMovieEntity(optionalMovieEntity.get());

        System.out.println(movieReviewEntities);
        return movieReviewEntities.stream().map(MovieReviewDto::toMovieReviewDto).collect(Collectors.toList());
    }

    @Override
    public void insertMovieReview(MovieReviewDto movieReviewDto) {
    // 회원 정보 조회
    Optional<MemberEntity> optionalMemberEntity = memberRepository.findByEmail(movieReviewDto.getEmail());
    // 영화 정보 조회
    Optional<MovieEntity> optionalMovieEntity = movieRepository.findById(movieReviewDto.getMovieId());

    // 회원이 존재하지 않으면 예외 처리
    if (!optionalMemberEntity.isPresent()) {
        throw new IllegalArgumentException("회원 정보가 존재하지 않습니다.");
    }

    // 영화가 존재하지 않으면 예외 처리
    if (!optionalMovieEntity.isPresent()) {
        throw new IllegalArgumentException("영화 정보를 찾을 수 없습니다.");
    }

    // 해당 영화에 대해 이미 리뷰를 작성했는지 확인
    Optional<MovieReviewEntity> existingReview = movieReviewRepository.findByMemberEntityAndMovieEntity(
        optionalMemberEntity.get(), optionalMovieEntity.get());

    // 이미 리뷰가 존재하면 예외 처리
    if (existingReview.isPresent()) {
        throw new IllegalStateException("이미 리뷰를 작성하셨습니다."); // 또는 Conflict 예외
    }

    // 리뷰 저장
    movieReviewRepository.save(MovieReviewEntity.builder()
            .reviewText(movieReviewDto.getReviewText())
            .memberEntity(optionalMemberEntity.get()) // 이미 존재하는 MemberEntity 사용
            .movieEntity(optionalMovieEntity.get())  // 이미 존재하는 MovieEntity 사용
            .rating(movieReviewDto.getRating())
            .build());
}


    @Override
    public void movieReviewDelete(Long id) {
        Optional<MovieReviewEntity>optionalMovieReviewEntity=movieReviewRepository.findById(id);
        if(!optionalMovieReviewEntity.isPresent()){
            throw new IllegalArgumentException("삭제할 리뷰가 없습니다");
        }
        movieReviewRepository.deleteById(id);
    }



   
}
