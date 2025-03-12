package org.spring.moviepj.repository;

import java.util.List;
import java.util.Optional;

import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.MovieReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieReviewRepository extends JpaRepository<MovieReviewEntity,Long> {
    List<MovieReviewEntity> findAllByMovieEntity(MovieEntity movieEntity);

    Optional<MovieReviewEntity> findByMemberEntityAndMovieEntity(MemberEntity memberEntity, MovieEntity movieEntity);
} 