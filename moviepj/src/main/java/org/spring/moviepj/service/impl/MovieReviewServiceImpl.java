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
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.repository.MovieReviewRepository;
import org.spring.moviepj.repository.ReplyRepository;
import org.spring.moviepj.service.MovieReviewService;
import org.spring.moviepj.service.ReplyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MovieReviewServiceImpl implements MovieReviewService {
    private final MovieReviewRepository movieReviewRepository;
    private final MovieRepository movieRepository;


 

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
        Optional<MovieEntity> optionalMovieEntity=movieRepository.findById(movieReviewDto.getMovieId());
        if(!optionalMovieEntity.isPresent()){
            throw new IllegalArgumentException("아이디 x");
        }
        movieReviewRepository.save(MovieReviewEntity.builder()
                        .reviewText(movieReviewDto.getReviewText())
                        .memberEntity(MemberEntity.builder().email(movieReviewDto.getEmail()).build())
                        .movieEntity(MovieEntity.builder()
                                .id(movieReviewDto.getMovieId()).build())
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
