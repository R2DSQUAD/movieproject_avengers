package org.spring.moviepj.theater;

import org.junit.jupiter.api.Test;
import org.spring.moviepj.entity.TheaterEntity;
import org.spring.moviepj.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@SpringBootTest
public class Theater {

    // @MockBean
    // private ServerEndpointExporter serverEndpointExporter;

    // @Autowired
    // TheaterRepository theaterRepository;

    // @Test
    // void insertTheater() {
    // for (int i = 1; i <= 10; i++) {
    // TheaterEntity theater = TheaterEntity.builder()
    // .name("상영관 " + i)
    // .build();
    // theaterRepository.save(theater);
    // }

    // }

}
