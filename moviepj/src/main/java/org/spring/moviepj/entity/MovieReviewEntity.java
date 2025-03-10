package org.spring.moviepj.entity;

import org.spring.moviepj.common.BasicTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
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
@Table(name = "movie_review_tb")
public class MovieReviewEntity extends BasicTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "movie_review_id")
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "movie_id")
    private MovieEntity movieEntity;  

    @ManyToOne
    @JoinColumn(name = "member_email")
    @JsonIgnore
    private MemberEntity memberEntity;  

    private Double rating;  

    @Column(length = 2000)
    private String reviewText;  
}
