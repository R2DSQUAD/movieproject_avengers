package org.spring.moviepj.service.impl;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spring.moviepj.entity.CinemaEntity; // CinemaEntity로 변경
import org.spring.moviepj.repository.CinemaRepository; // CinemaRepository로 변경
import org.spring.moviepj.service.CinemaService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository; // 레포지토리 이름 변경

    @Override
    public void crawlTheaterSchedule() {
        try {
            String url = "https://www.megabox.co.kr/theater/list";
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .get();

            Elements regionElements = doc.select("div.theater-place > ul > li");
            for (Element regionElement : regionElements) {
                String region = regionElement.select("button.sel-city").text().trim();
                Elements theaterElements = regionElement.select("div.theater-list > ul > li");
                for (Element theaterElement : theaterElements) {
                    String cinemaName = theaterElement.select("a").text().trim(); // 변수명 변경
                    String theaterUrl = theaterElement.select("a").attr("href").trim();
                    String brchNo = theaterElement.attr("data-brch-no");
                    if (brchNo == null || brchNo.isEmpty()) {
                        brchNo = extractBrchNoFromUrl(theaterUrl);
                    }

                    // cinemaName 출력하여 값 확인
                    System.out.println("Megabox Cinema Name: " + cinemaName);

                    // DB에서 해당 영화관 정보가 있는지 조회
                    CinemaEntity existing = cinemaRepository.findByCinemaName(cinemaName); // 레포지토리와 엔티티 이름 변경
                    if (existing != null) {
                        // 기존 정보가 있으면 업데이트
                        System.out.println("Updating existing cinema: " + cinemaName);
                        existing.setRegion(region);
                        cinemaRepository.save(existing); // 레포지토리와 엔티티 이름 변경
                    } else {
                        // 없으면 새롭게 추가
                        System.out.println("Saving new cinema: " + cinemaName);
                        CinemaEntity cinemaEntity = CinemaEntity.builder() // 엔티티 이름 변경
                                .region(region)
                                .cinemaName(cinemaName) // 필드 이름 변경
                                .build();
                        cinemaRepository.save(cinemaEntity); // 레포지토리와 엔티티 이름 변경
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("Error during Megabox crawl: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String extractBrchNoFromUrl(String theaterUrl) {
        // URL에서 "brchNo=" 뒤에 나오는 값을 추출
        if (theaterUrl.contains("brchNo=")) {
            return theaterUrl.split("brchNo=")[1]; // "brchNo=" 뒤의 값 추출
        }
        return "알 수 없음"; // brchNo 파라미터가 없으면 기본값 설정
    }
}
