package org.spring.moviepj.crawl;

import java.util.List;

import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.entity.TheaterEntity;
import org.spring.moviepj.repository.CinemaRepository;
import org.spring.moviepj.repository.TheaterRepository;
import org.spring.moviepj.service.impl.CinemaServiceImpl;
import org.spring.moviepj.service.impl.TheaterServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class CrawlRunner implements CommandLineRunner {

    private final TheaterServiceImpl theaterServiceImpl;
    private final CinemaServiceImpl cinemaServiceImpl;
    private final CinemaRepository cinemaRepository;
    private final TheaterRepository theaterRepository;

    @Override
    public void run(String... args) throws Exception {
        // CinemaEntity 데이터 확인 후 처리
        if (!cinemaServiceImpl.isCinemaDataExists()) {
            System.out.println("CinemaEntity 데이터가 없어 크롤링을 시작합니다.");
            cinemaServiceImpl.crawlTheaterSchedule();
        } else {
            System.out.println("CinemaEntity 데이터가 이미 존재하여 크롤링을 실행하지 않습니다.");
        }

        // TheaterEntity 데이터 확인 후 처리
        handleTheaterCrawl();
    }

    private void handleTheaterCrawl() {
        if (!theaterServiceImpl.isTheaterDataExists()) {
            System.out.println("TheaterEntity 데이터가 없어 크롤링을 시작합니다.");
            insertTheaterWithCinema();
        } else {
            System.out.println("TheaterEntity 데이터가 이미 존재하여 크롤링을 실행하지 않습니다.");
        }
    }

    @Transactional
    private void insertTheaterWithCinema() {
        System.out.println("상영관 데이터 추가 시작...");

        List<CinemaEntity> cinemas = cinemaRepository.findAll();

        if (cinemas.isEmpty()) {
            System.out.println("cinema_tb에 데이터가 없습니다. 먼저 cinema_tb에 데이터를 추가해주세요.");
            return;
        }

        for (CinemaEntity cinema : cinemas) {
            if (cinema.getCinemaName().contains("(휴관)")) {
                System.out.println("휴관 중인 영화관: " + cinema.getCinemaName() + " - 상영관 추가 안 함");
                continue;
            }

            int startNumber = theaterRepository.countByCinemaEntity(cinema);

            for (int i = 1; i <= 10; i++) {
                int theaterNumber = startNumber + i;
                String theaterName = "상영관 " + theaterNumber;

                if (theaterRepository.existsByNameAndCinemaEntity(theaterName, cinema)) {
                    System.out.println("이미 존재하는 상영관: " + cinema.getCinemaName() + " - " + theaterName);
                    continue;
                }

                TheaterEntity theater = TheaterEntity.builder()
                        .name(theaterName)
                        .cinemaEntity(cinema)
                        .build();
                theaterRepository.save(theater);
                System.out.println("추가된 상영관: " + cinema.getCinemaName() + " - " + theaterName);
            }
        }
        System.out.println("영화관 & 상영관 데이터 추가 완료 ");
    }
}
