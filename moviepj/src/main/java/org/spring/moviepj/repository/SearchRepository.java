package org.spring.moviepj.repository;

import java.util.List;
import java.util.Optional;

import org.spring.moviepj.entity.SearchEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchRepository extends JpaRepository<SearchEntity, Long> {

    boolean existsByMovieCd(String movieCd);

    @Query("SELECT s FROM SearchEntity s WHERE REPLACE(s.movieNm, ' ', '') LIKE CONCAT('%', :movieNm, '%')")
    Page<SearchEntity> findByMovieNmContaining(@Param("movieNm") String movieNm, Pageable pageable);

    @Query("SELECT s FROM SearchEntity s WHERE REPLACE(s.movieNmChosung, ' ', '') LIKE CONCAT('%', :chosung, '%')")
    Page<SearchEntity> findByMovieNmChosungIgnoreSpace(@Param("chosung") String chosung, Pageable pageable);

    List<SearchEntity> findByMovieNmChosungIsNull();

    @Query("SELECT s FROM SearchEntity s WHERE s.poster_path IS NOT NULL")
    Page<SearchEntity> findAllByPosterPathIsNotNull(Pageable pageable);

    Optional<SearchEntity> findByMovieCd(String movieCd);

}