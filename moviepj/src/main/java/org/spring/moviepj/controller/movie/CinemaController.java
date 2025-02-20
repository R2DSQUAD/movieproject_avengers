package org.spring.moviepj.controller.movie;

import java.util.List;

import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.repository.CinemaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
public class CinemaController {
    private final CinemaRepository cinemaRepository;

    @GetMapping
    public List<CinemaEntity> getAllCinemas() {
        return cinemaRepository.findAll();
    }

    @GetMapping("/nearby")
    public List<CinemaEntity> getNearbyCinemas(@RequestParam double lat, @RequestParam double lon) {
        double radius = 5.0; // 5km 반경
        return cinemaRepository.findNearbyCinemas(lat, lon, radius);
    }
}
