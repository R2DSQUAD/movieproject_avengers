package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.dto.SearchDto;
import org.spring.moviepj.entity.SearchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchRepository extends JpaRepository<SearchEntity, Long> {

    boolean existsByMovieCd(String movieCd);

    @Query("SELECT s FROM SearchEntity s WHERE REPLACE(s.movieNm, ' ', '') LIKE CONCAT('%', :movieNm, '%')")
    List<SearchEntity> findByMovieNmContaining(@Param("movieNm") String movieNm);

}