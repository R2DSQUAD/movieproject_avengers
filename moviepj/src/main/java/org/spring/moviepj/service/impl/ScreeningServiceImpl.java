package org.spring.moviepj.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

import org.spring.moviepj.dto.MovieDto;
import org.spring.moviepj.dto.ScreeningDto;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.ScreeningEntity;
import org.spring.moviepj.entity.TheaterEntity;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.repository.ScreeningRepository;
import org.spring.moviepj.repository.TheaterRepository;
import org.spring.moviepj.service.ScreeningService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ScreeningServiceImpl implements ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

    /**
     * 매일 새벽 3시에 실행 (최초 실행 시 5일치 생성, 이후에는 하루씩 추가)
     */
    @Scheduled(cron = "0 57 11 * * *") // 매일 실행
    public void updateScreenings() {
        System.out.println(">>> [자동 실행] 상영 일정 추가");

        // 기존 상영 데이터 확인
        boolean hasExistingData = screeningRepository.count() > 0;

        if (!hasExistingData) {
            System.out.println(" [초기 실행] 영화 데이터 기반 5일치 상영 스케줄 생성");
            createScreenings(5);
        } else {
            System.out.println("[일일 실행] 하루치 상영 스케줄 추가");
            createScreenings(1);
        }
    }

    /**
     * (초기 실행: 5일, 이후 매일: 1일)
     */
    @Override
    public void createScreenings(int daysToAdd) {
        // 최신 영화 데이터 가져오기
        Optional<LocalDate> latestDateOpt = movieRepository.findLatestUpdateDate();
        if (latestDateOpt.isEmpty()) {
            System.out.println(" 최신 영화 업데이트 날짜를 찾을 수 없습니다.");
            return;
        }

        LocalDate latestDate = latestDateOpt.get();
        List<MovieEntity> latestMovies = movieRepository.findByUpdateDate(latestDate);
        if (latestMovies.isEmpty()) {
            System.out.println(" 최신 영화 데이터가 없습니다.");
            return;
        }

        List<TheaterEntity> theaters = theaterRepository.findAll();
        if (theaters.isEmpty()) {
            System.out.println(" 상영관이 없습니다. 스케줄을 생성할 수 없습니다.");
            return;
        }

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(daysToAdd - 1); // 오늘 포함한 5일 설정

        int theaterIndex = 0;

        for (MovieEntity movie : latestMovies) {
            TheaterEntity theaterEntity = theaters.get(theaterIndex);
            theaterIndex = (theaterIndex + 1) % theaters.size(); // 상영관 순환

            // 스케줄 생성
            for (LocalDate screeningDate = startDate; !screeningDate.isAfter(endDate); screeningDate = screeningDate
                    .plusDays(1)) {
                // 이미 존재하는 상영 일정인지 확인
                if (screeningRepository.existsByTheaterEntityAndScreeningDate(theaterEntity, screeningDate)) {
                    System.out.println(
                            "⚠ 이미 존재하는 상영 일정 (생성하지 않음): " + screeningDate + " | 상영관: " + theaterEntity.getId());
                    continue;
                }

                // 5개 중 랜덤으로 3개의 시간 선택
                List<LocalTime> selectedTimes = getRandomScreeningTimes();

                for (LocalTime startTime : selectedTimes) {
                    LocalTime endTime = startTime.plusHours(2);

                    if (isScreeningTimeAvailable(theaterEntity, screeningDate, startTime, endTime)) {
                        ScreeningEntity screening = ScreeningEntity.builder()
                                .movieEntity(movie)
                                .theaterEntity(theaterEntity)
                                .screeningDate(screeningDate)
                                .screeningTime(startTime)
                                .screeningEndTime(endTime)
                                .build();

                        screeningRepository.save(screening);
                        System.out.println(" 상영 일정 추가됨: " + movie.getMovieNm() +
                                " | " + screeningDate + " | " + startTime + " - " + endTime + " | 상영관: "
                                + theaterEntity.getId());
                    }
                }
            }
        }
    }

    /**
     * 5개 중 랜덤 3개 선택
     */
    private List<LocalTime> getRandomScreeningTimes() {
        List<LocalTime> allTimes = new ArrayList<>(List.of(
                LocalTime.of(10, 0),
                LocalTime.of(13, 0),
                LocalTime.of(16, 0),
                LocalTime.of(19, 0),
                LocalTime.of(22, 0)));

        Collections.shuffle(allTimes);

        return allTimes.subList(0, 3);
    }

    /**
     * 해당 날짜와 시간에 상영관이 비어있는지 확인
     */
    private boolean isScreeningTimeAvailable(TheaterEntity theater, LocalDate date, LocalTime startTime,
            LocalTime endTime) {
        return screeningRepository.countOverlappingScreenings(theater, date, startTime, endTime) == 0;
    }

    @Override
    public List<ScreeningDto> getScreeningsByMovieId(Long movieId) {
        return screeningRepository.findByMovieEntity_Id(movieId)
                .stream().map(el -> ScreeningDto.builder()
                        .id(el.getId())
                        .movieEntity(el.getMovieEntity())
                        .theaterEntity(el.getTheaterEntity())
                        .screeningDate(el.getScreeningDate())
                        .screeningTime(el.getScreeningTime())
                        .screeningEndTime(el.getScreeningEndTime())
                        .screeningSeatEntities(el.getScreeningSeatEntities())
                        .createTime(el.getCreateTime())
                        .updateTime(el.getUpdateTime())
                        .build())
                .collect(Collectors.toList());

    }

}