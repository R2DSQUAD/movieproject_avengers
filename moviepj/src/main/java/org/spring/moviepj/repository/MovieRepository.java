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

    @Query("SELECT MAX(m.createTime) FROM MovieEntity m")
    Optional<LocalDate> findLatestUpdateDate();

    @Query("SELECT m FROM MovieEntity m WHERE DATE(m.createTime) = :latestUpdateDate ORDER BY m.rank ASC")
    List<MovieEntity> findByUpdateDate(@Param("latestUpdateDate") LocalDate latestUpdateDate);
}