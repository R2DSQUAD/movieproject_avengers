package org.spring.moviepj.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.spring.moviepj.entity.MovieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public interface MovieRepository extends JpaRepository<MovieEntity, Long> {

    @Query("SELECT m FROM MovieEntity m WHERE DATE(m.createTime) = :latestUpdateDate ORDER BY m.rank ASC")
    List<MovieEntity> findByUpdateDate(@Param("latestUpdateDate") LocalDate latestUpdateDate);

    @Query("SELECT m FROM MovieEntity m WHERE FUNCTION('DATE', m.createTime) = (SELECT FUNCTION('DATE', MAX(m2.createTime)) FROM MovieEntity m2) ORDER BY m.rank ASC")
    List<MovieEntity> findLatestTop10Movies();

    Optional<MovieEntity> findByMovieNm(String name);

    @Query("SELECT m FROM MovieEntity m WHERE REPLACE(m.movieNm, ' ', '') LIKE CONCAT('%', :movieNm, '%')")
    List<MovieEntity> findByMovieNmContaining(@Param("movieNm") String movieNm);

    Optional<MovieEntity> findByMovieNmAndOpenDt(String movieNm, String formattedOpenDt);

    @Query("SELECT MAX(DATE(m.createTime)) FROM MovieEntity m")
    Optional<LocalDate> findLatestCreateDate();

    @Query("SELECT m FROM MovieEntity m WHERE DATE(m.createTime) >= :latestCreateDate ORDER BY m.createTime ASC")
    List<MovieEntity> findNewMoviesAfter(@Param("latestCreateDate") LocalDate latestCreateDate);
}