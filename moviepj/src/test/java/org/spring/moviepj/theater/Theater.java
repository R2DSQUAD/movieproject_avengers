package org.spring.moviepj.theater;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.entity.TheaterEntity;
import org.spring.moviepj.repository.CinemaRepository;
import org.spring.moviepj.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.Commit; // 추가
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@SpringBootTest
public class Theater {

    @MockBean
    private ServerEndpointExporter serverEndpointExporter;

    @Autowired
    TheaterRepository theaterRepository;

    @Autowired
    CinemaRepository cinemaRepository;

    @Transactional
    @Commit // 추가
    @Test
    void insertTheaterWithCinema() {
        // cinema_tb에 있는 모든 CinemaEntity를 가져옵니다.
        List<CinemaEntity> cinemas = cinemaRepository.findAll();

        if (cinemas.isEmpty()) {
            System.out.println("cinema_tb에 데이터가 없습니다. 먼저 cinema_tb에 데이터를 추가해주세요.");
            return;
        }

        // 각 CinemaEntity에 대해 10개의 TheaterEntity를 생성하고, cinema_entity_cinema_id에 대입합니다.
        for (CinemaEntity cinema : cinemas) {
            // 영화관 이름에 "(휴관)"이 포함된 경우 스킵
            if (cinema.getCinemaName().contains("(휴관)")) {
                System.out.println("영화관 : " + cinema.getCinemaName() + " 은(는) 휴관 상태이므로 상영관을 추가하지 않습니다.");
                continue;
            }

            // 영화관 당 상영관이 중복되지 않도록 startNumber 추가.
            int startNumber = theaterRepository.countByCinemaEntity(cinema);

            for (int i = 1; i <= 10; i++) {
                // 시작 숫자 + 상영관 숫자 = 상영관 고유 넘버
                int theaterNumber = startNumber + i;
                String theaterName = "상영관 " + theaterNumber;

                // 같은 영화관 내에서 해당 이름이 존재하는지 확인하여 중복 방지
                if (theaterRepository.existsByNameAndCinemaEntity(theaterName, cinema)) {
                    System.out.println("영화관 : " + cinema.getCinemaName() + " | " + " 상영관 : " + theaterName + " 는 이미 존재합니다.");
                    continue;
                }

                TheaterEntity theater = TheaterEntity.builder()
                        .name(theaterName)
                        .cinemaEntity(cinema) // cinema_entity_cinema_id에 CinemaEntity의 id를 대입
                        .build();
                theaterRepository.save(theater);
                System.out.println("영화관 : " + cinema.getCinemaName() + " | " + " 상영관 : " + theaterName);
            }
        }
    }
}
