package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.SearchTrailerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchTrailerRepository extends JpaRepository<SearchTrailerEntity, Long> {

    @Query("SELECT t FROM SearchTrailerEntity t WHERE t.searchEntity.movieCd = :movieCd")
    List<SearchTrailerEntity> findByMovieCd(@Param("movieCd") String movieCd);

}
