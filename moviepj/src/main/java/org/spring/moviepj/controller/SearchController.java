package org.spring.moviepj.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    @GetMapping("/search")
    public ResponseEntity<?> movieSearch() {

        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

}
