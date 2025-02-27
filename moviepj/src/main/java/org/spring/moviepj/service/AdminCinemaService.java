package org.spring.moviepj.service;

import org.spring.moviepj.entity.CinemaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface AdminCinemaService {
    CinemaEntity createCinema(CinemaEntity cinema);

    Optional<CinemaEntity> getCinemaById(Long id);

    List<CinemaEntity> getAllCinemas();

    CinemaEntity updateCinema(Long id, CinemaEntity cinema);

    void deleteCinema(Long id);

    Page<CinemaEntity> searchCinemas(String cinemaName, String region, Pageable pageable);
}
