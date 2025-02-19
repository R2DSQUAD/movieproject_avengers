package org.spring.moviepj.theater;

import org.junit.jupiter.api.Test;
import org.spring.moviepj.entity.TheaterEntity;
import org.spring.moviepj.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class Theater {

    @Autowired
    TheaterRepository theaterRepository;

    @Test
    void insertTheater() {
        for (int i = 1; i <= 10; i++) {
            TheaterEntity theater = TheaterEntity.builder()
                    .name("상영관 " + i)
                    .build();
            theaterRepository.save(theater);
        }

    }

}
