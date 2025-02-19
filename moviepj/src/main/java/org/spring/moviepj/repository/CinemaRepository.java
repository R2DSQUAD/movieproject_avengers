package org.spring.moviepj.repository;

import org.spring.moviepj.entity.CinemaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CinemaRepository extends JpaRepository<CinemaEntity, Long> {

    CinemaEntity findByCinemaName(String cinemaName);

}
