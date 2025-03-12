package org.spring.moviepj.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "movie_reviewLike_tb")
public class MovieReviewLikeEntity {
    
    public MovieReviewLikeEntity(MovieReviewEntity review, MemberEntity member) {
        this.memberEntity = member;
        this.movieReviewEntity = review;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 좋아요 ID

    @ManyToOne
    @JoinColumn(name = "movie_review_id", nullable = false)
    @JsonIgnore // 'replyEntity'는 직렬화에서 제외
    private MovieReviewEntity movieReviewEntity; 

    @ManyToOne
    @JoinColumn(name = "member_email", nullable = false)
    @JsonIgnore // 'memberEntity'는 back reference로 처리하여 순환 참조 방지
    private MemberEntity memberEntity; // 사용자 엔티티 (ManyToOne)
}
