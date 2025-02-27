package org.spring.moviepj.controller.admin;

import java.util.List;

import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.service.impl.AdminCinemaServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminCinemaController {

    private final AdminCinemaServiceImpl adminCinemaService;

    @GetMapping("/cinemas")
    public List<CinemaEntity> getAllCinemas() {
        return adminCinemaService.getAllCinemas();
    }

    @PostMapping("/createCinema")
    public ResponseEntity<CinemaEntity> createCinema(@RequestBody CinemaEntity cinema) {
        CinemaEntity createdCinema = adminCinemaService.createCinema(cinema);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCinema);
    }

    @PostMapping("/update/{id}")
    public CinemaEntity updateCinema(@PathVariable Long id, @RequestBody CinemaEntity cinema) {
        return adminCinemaService.updateCinema(id, cinema);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCinema(@PathVariable Long id) {
        adminCinemaService.deleteCinema(id);
    }

    @GetMapping("/cinemas/search")
    public ResponseEntity<Page<CinemaEntity>> searchCinemas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String cinemaName,
            @RequestParam(required = false) String region) {
        Pageable pageable = PageRequest.of(page, size);
        if (cinemaName != null && !cinemaName.isEmpty()) {
            return ResponseEntity.ok(adminCinemaService.searchCinemas("cinemaName", cinemaName, pageable));
        } else if (region != null && !region.isEmpty()) {
            return ResponseEntity.ok(adminCinemaService.searchCinemas("region", region, pageable));
        } else {
            return ResponseEntity.ok(adminCinemaService.searchCinemas("", "", pageable));
        }
    }
}
