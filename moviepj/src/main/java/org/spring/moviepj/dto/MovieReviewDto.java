package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.MovieReviewEntity;
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
public class MovieReviewDto extends BasicTime{
    private Long id;

 
    private MovieEntity movieEntity;  
    private String email;
 
    private MemberEntity memberEntity;  

    private Double rating;  

    private Long MovieId;
    private String reviewText;  
    private LocalDateTime createTime;
    private LocalDateTime updateTime;


     public static MovieReviewDto toMovieReviewDto(MovieReviewEntity movieReviewEntity) {
        MovieReviewDto movieReviewDto = new MovieReviewDto();
        movieReviewDto.setId(movieReviewEntity.getId());
        movieReviewDto.setEmail(movieReviewEntity.getMemberEntity().getEmail());
        movieReviewDto.setMovieId(movieReviewEntity.getMovieEntity().getId());
        movieReviewDto.setRating(movieReviewEntity.getRating());
        movieReviewDto.setReviewText(movieReviewEntity.getReviewText());
        movieReviewDto.setCreateTime(movieReviewEntity.getCreateTime());
        movieReviewDto.setUpdateTime(movieReviewEntity.getUpdateTime());

    return movieReviewDto;
}
}
