package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.MovieReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieReviewRepository extends JpaRepository<MovieReviewEntity,Long> {
    List<MovieReviewEntity> findAllByMovieEntity(MovieEntity movieEntity);
} 