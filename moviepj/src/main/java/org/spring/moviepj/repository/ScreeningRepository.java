package org.spring.moviepj.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.spring.moviepj.entity.ScreeningEntity;
import org.spring.moviepj.entity.TheaterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreeningRepository extends JpaRepository<ScreeningEntity, Long> {

        @Query("SELECT COUNT(s) FROM ScreeningEntity s " +
                        "WHERE s.theaterEntity = :theater " +
                        "AND s.screeningDate = :date " +
                        "AND ( " +
                        "   s.screeningTime < :endTime AND s.screeningEndTime > :startTime " +
                        ")")
        int countOverlappingScreenings(
                        @Param("theater") TheaterEntity theater,
                        @Param("date") LocalDate date,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime);

        boolean existsByTheaterEntityAndScreeningDate(TheaterEntity theaterEntity, LocalDate screeningDate);

        List<ScreeningEntity> findByMovieEntity_Id(Long movieId);

        @Query("SELECT MAX(s.screeningDate) FROM ScreeningEntity s")
        Optional<LocalDate> findLatestScreeningDate();

}