package org.spring.moviepj.controller;

import org.spring.moviepj.dto.ScreeningSeatDto;
import org.spring.moviepj.service.impl.ScreeningSeatServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/screeningSeat")
@RequiredArgsConstructor
public class ScreeningSeatController {

    private final ScreeningSeatServiceImpl screeningSeatServiceImpl;

    @PostMapping("/reservation")
    public ResponseEntity<String> reservationSeat(@RequestBody ScreeningSeatDto screeningSeatDto) {
        try {
            screeningSeatServiceImpl.reservationSeat(screeningSeatDto);
            return ResponseEntity.ok("좌석 예약 성공");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("좌석 예약 실패 " + e.getMessage());
        }
    }

}
