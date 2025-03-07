package org.spring.moviepj.service.impl;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.repository.CinemaRepository;
import org.spring.moviepj.service.CinemaService;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final String KAKAO_API_KEY = "8523756c5dd763794f96e865862528dc";

    // 각 지역별 최대 저장 개수
    private static final Map<String, Integer> REGION_MAX_COUNT = new HashMap<>() {
        {
            put("서울", 5);
            put("제주", 3);
            put("경기", 4);
            put("인천", 4);
            put("대전/충청/세종", 4);
            put("부산/대구/경상", 4);
            put("광주/전라", 4);
            put("강원", 4);
        }
    };

    @Override
    public void crawlTheaterSchedule() {
        try {
            String url = "https://www.megabox.co.kr/theater/list";
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .get();

            Elements regionElements = doc.select("div.theater-place > ul > li");
            List<CinemaEntity> cinemasToSave = new ArrayList<>();
            Map<String, Integer> regionCounts = new HashMap<>();
            List<String> regions = Arrays.asList("강원", "경기", "광주/전라", "부산/대구/경상", "서울", "인천", "제주", "대전/충청/세종");

            for (String region : regions) {
                Elements theaterElements = regionElements.stream()
                        .filter(el -> el.select("button.sel-city").text().trim().equals(region))
                        .findFirst()
                        .map(el -> el.select("div.theater-list > ul > li"))
                        .orElse(new Elements());

                regionCounts.put(region, 0);

                for (Element theaterElement : theaterElements) {
                    int maxCount = REGION_MAX_COUNT.getOrDefault(region, 4);
                    if (regionCounts.get(region) >= maxCount)
                        continue;

                    String cinemaName = theaterElement.select("a").text().trim();

                    // ✅ 중복 체크: 이미 존재하는 영화관 이름이면 건너뜁니다.
                    if (cinemaRepository.existsByCinemaName(cinemaName)) {
                        System.out.println("이미 존재하는 영화관입니다 : " + cinemaName);
                        continue; // 이미 존재하면 건너뜁니다.
                    }

                    double[] latLon = getLatLonFromKakaoMap("메가박스 " + cinemaName);
                    double lat = latLon[0];
                    double lon = latLon[1];

                    String address = getAddressFromKakaoMap("메가박스 " + cinemaName);

                    CinemaEntity cinemaEntity = CinemaEntity.builder()
                            .region(region)
                            .cinemaName(cinemaName)
                            .lat(lat)
                            .lon(lon)
                            .address(address)
                            .build();

                    cinemasToSave.add(cinemaEntity);
                    regionCounts.put(region, regionCounts.get(region) + 1);
                }
            }

            // 누적된 엔티티들을 bulk insert/update 방식으로 저장
            if (!cinemasToSave.isEmpty()) {
                cinemaRepository.saveAll(cinemasToSave);
            }
        } catch (IOException e) {
            System.out.println("Error during Megabox crawl: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // 카카오맵 API에서 도로명주소를 가져오는 메서드
    private String getAddressFromKakaoMap(String query) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String apiUrl = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + encodedQuery;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Authorization", "KakaoAK " + KAKAO_API_KEY)
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String responseBody = response.body();
                if (responseBody.contains("\"documents\":[]")) {
                    return null; // 주소가 없으면 null 반환
                }
                String latString = responseBody.split("\"y\":\"")[1].split("\"")[0];
                String lonString = responseBody.split("\"x\":\"")[1].split("\"")[0];
                String address = responseBody.split("\"address_name\":\"")[1].split("\"")[0]; // 도로명주소 추출

                return address; // 도로명주소 반환
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // 오류가 발생했을 경우 null 반환
    }

    // 카카오맵 API에서 위도와 경도를 가져오는 메서드
    private double[] getLatLonFromKakaoMap(String query) {
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String apiUrl = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + encodedQuery;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Authorization", "KakaoAK " + KAKAO_API_KEY)
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String responseBody = response.body();
                if (responseBody.contains("\"documents\":[]")) {
                    return new double[] { 0.0, 0.0 };
                }
                String latString = responseBody.split("\"y\":\"")[1].split("\"")[0];
                String lonString = responseBody.split("\"x\":\"")[1].split("\"")[0];
                return new double[] { Double.parseDouble(latString), Double.parseDouble(lonString) };
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new double[] { 0.0, 0.0 };
    }

    // ✅ CinemaEntity 데이터 존재 여부 확인
    public boolean isCinemaDataExists() {
        // 데이터가 하나라도 있으면 true, 없으면 false 반환
        return cinemaRepository.count() > 0;
    }
}
