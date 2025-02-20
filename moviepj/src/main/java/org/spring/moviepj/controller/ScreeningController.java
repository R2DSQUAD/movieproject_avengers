package org.spring.moviepj.controller;

import java.util.List;

import org.spring.moviepj.dto.ScreeningDto;
import org.spring.moviepj.service.impl.ScreeningServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ScreeningController {

    private final ScreeningServiceImpl screeningServiceImpl;

    @GetMapping("/screening/{movieId}")
    public ResponseEntity<List<ScreeningDto>> getScreeningsByMovieId(@PathVariable("movieId") Long movieId) {
        List<ScreeningDto> screenings = screeningServiceImpl.getScreeningsByMovieId(movieId);
        if (screenings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(screenings);
    }

}