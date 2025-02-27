package org.spring.moviepj.service.impl;

import lombok.RequiredArgsConstructor;
import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.repository.CinemaRepository;
import org.spring.moviepj.service.AdminCinemaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminCinemaServiceImpl implements AdminCinemaService {

    private final CinemaRepository cinemaRepository;

    @Override
    public CinemaEntity createCinema(CinemaEntity cinema) {
        return cinemaRepository.save(cinema);
    }

    @Override
    public Optional<CinemaEntity> getCinemaById(Long id) {
        return cinemaRepository.findById(id);
    }

    @Override
    public List<CinemaEntity> getAllCinemas() {
        return cinemaRepository.findAll();
    }

    @Override
    public CinemaEntity updateCinema(Long id, CinemaEntity cinema) {
        return cinemaRepository.findById(id).map(existingCinema -> {
            existingCinema.setRegion(cinema.getRegion());
            existingCinema.setCinemaName(cinema.getCinemaName());
            existingCinema.setLat(cinema.getLat());
            existingCinema.setLon(cinema.getLon());
            existingCinema.setAddress(cinema.getAddress());
            return cinemaRepository.save(existingCinema);
        }).orElseThrow(() -> new RuntimeException("Cinema not found"));
    }

    @Override
    public void deleteCinema(Long id) {
        cinemaRepository.deleteById(id);
    }

    @Override
    public Page<CinemaEntity> searchCinemas(String searchType, String searchValue, Pageable pageable) {
        // searchType에 따라 검색 기준을 결정
        if ("cinemaName".equals(searchType)) {
            // 영화관 이름으로 검색
            return cinemaRepository.findByCinemaNameContaining(searchValue, pageable);
        } else if ("region".equals(searchType)) {
            // 지역으로 검색
            return cinemaRepository.findByRegionContaining(searchValue, pageable);
        } else {
            // 기본적으로 모든 영화관 반환
            return cinemaRepository.findAll(pageable);
        }
    }

}
