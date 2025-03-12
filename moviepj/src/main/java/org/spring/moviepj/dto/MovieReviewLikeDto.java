package org.spring.moviepj.dto;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.MovieReviewEntity;
import org.spring.moviepj.entity.ReplyEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class MovieReviewLikeDto extends BasicTime{

    private Long id; // 좋아요 ID
    private String email; // 좋아요를 누른 사람의 이메일
    private Long movieReviewId; // 해당 댓글의 ID

 
    private MovieReviewEntity movieReviewEntity; 


    private MemberEntity memberEntity; 
    // 사용자 엔티티 (ManyToOne)
}

