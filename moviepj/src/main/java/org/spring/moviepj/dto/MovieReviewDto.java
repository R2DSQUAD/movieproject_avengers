package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.MovieReviewEntity;
import org.spring.moviepj.entity.MovieReviewLikeEntity;
import org.spring.moviepj.entity.ReplyEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MovieReviewDto extends BasicTime {
    private Long id;

    private MovieEntity movieEntity;  
    private String email;
    private String nickname; // nickname 추가
    private MemberEntity memberEntity;  

    private Double rating;  
    private int likeCount;

    private Long movieId;
    private String reviewText;  
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private List<MovieReviewLikeDto> movieReviewLikeEntities;

    public static MovieReviewDto toMovieReviewDto(MovieReviewEntity movieReviewEntity) {
        MovieReviewDto movieReviewDto = new MovieReviewDto();
        movieReviewDto.setId(movieReviewEntity.getId());
        movieReviewDto.setEmail(movieReviewEntity.getMemberEntity().getEmail());
        movieReviewDto.setNickname(movieReviewEntity.getMemberEntity().getNickname()); // nickname 설정
        movieReviewDto.setMovieId(movieReviewEntity.getMovieEntity().getId());
        movieReviewDto.setRating(movieReviewEntity.getRating());
        movieReviewDto.setReviewText(movieReviewEntity.getReviewText());
        movieReviewDto.setCreateTime(movieReviewEntity.getCreateTime());
        movieReviewDto.setUpdateTime(movieReviewEntity.getUpdateTime());
        movieReviewDto.setLikeCount(movieReviewEntity.getMovieReviewLikeEntities().size());

        // MovieReviewLikeEntity 리스트에서 필요한 정보만 추출
        List<MovieReviewLikeDto> movieReviewLikeDtos = movieReviewEntity.getMovieReviewLikeEntities().stream()
            .map(movieReviewLikeEntity -> {
                MovieReviewLikeDto movieReviewLikeDto = new MovieReviewLikeDto();
                movieReviewLikeDto.setId(movieReviewLikeEntity.getId());
                movieReviewLikeDto.setEmail(movieReviewLikeEntity.getMemberEntity().getEmail()); // 좋아요를 누른 사람 이메일
                movieReviewLikeDto.setMovieReviewId(movieReviewLikeEntity.getMovieReviewEntity().getId()); // 댓글 ID
                return movieReviewLikeDto;
            })
            .collect(Collectors.toList());

        movieReviewDto.setMovieReviewLikeEntities(movieReviewLikeDtos);
        return movieReviewDto;
    }
}

