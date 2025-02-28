package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.entity.TheaterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TheaterRepository extends JpaRepository<TheaterEntity, Long> {

  int countByCinemaEntity(CinemaEntity cinema);

  boolean existsByNameAndCinemaEntity(String theaterName, CinemaEntity cinema);

  List<TheaterEntity> findByCinemaEntity(CinemaEntity cinema);

  

}
