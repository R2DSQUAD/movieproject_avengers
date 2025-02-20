package org.spring.moviepj.service.impl;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.repository.CinemaRepository;
import org.spring.moviepj.service.CinemaService;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final String KAKAO_API_KEY = "8523756c5dd763794f96e865862528dc";

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
                    String cinemaName = theaterElement.select("a").text().trim();
                    double[] latLon = getLatLonFromKakaoMap("메가박스 " + cinemaName);
                    double lat = latLon[0];
                    double lon = latLon[1];

                    // 도로명주소 가져오기
                    String address = getAddressFromKakaoMap("메가박스 " + cinemaName);

                    CinemaEntity existing = cinemaRepository.findByCinemaName(cinemaName);
                    if (existing != null) {
                        existing.setRegion(region);
                        existing.setLat(lat);
                        existing.setLon(lon);
                        existing.setAddress(address); // 도로명주소 저장
                        cinemaRepository.save(existing);
                    } else {
                        CinemaEntity cinemaEntity = CinemaEntity.builder()
                                .region(region)
                                .cinemaName(cinemaName)
                                .lat(lat)
                                .lon(lon)
                                .address(address) // 도로명주소 저장
                                .build();

                        cinemaRepository.save(cinemaEntity);
                    }
                }
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
}
