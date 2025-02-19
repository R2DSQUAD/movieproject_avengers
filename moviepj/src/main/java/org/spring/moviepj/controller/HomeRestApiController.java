package org.spring.moviepj.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class HomeRestApiController {

    @GetMapping({ "", "/index" })
    public ResponseEntity<?> index() {

        Map<String, String> map = new HashMap<>();
        String body = "Index Page";
        map.put("index", body);

        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

}
