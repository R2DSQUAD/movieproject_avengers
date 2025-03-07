package org.spring.moviepj.crawl;

import org.spring.moviepj.service.impl.CinemaServiceImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CrawlRunner implements CommandLineRunner {

    private final CinemaServiceImpl cinemaServiceImpl;

    @Override
    public void run(String... args) throws Exception {
        if (cinemaServiceImpl.isCinemaDataExists()) {
            System.out.println("이미 CinemaEntity 데이터가 존재하여 크롤링을 실행하지 않습니다.");
        } else {
            System.out.println("CinemaEntity 데이터가 없어 크롤링을 시작합니다.");
            cinemaServiceImpl.crawlTheaterSchedule();
        }
    }
}
