package org.spring.moviepj.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

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
    @Scheduled(cron = "0 52 10 * * *") // 매일 실행
    public void updateScreenings() {
        System.out.println(">>> [자동 실행] 상영 일정 추가");

        boolean hasExistingData = screeningRepository.count() > 0;

        if (!hasExistingData) {
            System.out.println(" [초기 실행] 영화 데이터 기반 5일치 상영 스케줄 생성");
            createScreenings(5);
        } else {
            System.out.println("[일일 실행] 하루치 상영 스케줄 추가");
            createScreenings(1);
        }
    }

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

        // DB에서 가장 최근에 등록된 상영 날짜 가져오기 (null이면 오늘부터 시작)
        Optional<LocalDate> latestScreeningDateOpt = screeningRepository.findLatestScreeningDate();
        LocalDate startDate = latestScreeningDateOpt.map(date -> date.plusDays(1)).orElse(LocalDate.now());

        LocalDate endDate = startDate.plusDays(daysToAdd - 1); // 초기에는 5일치, 이후에는 1일씩 추가됨

        System.out.println(" 스케줄 생성 시작: " + startDate + " ~ " + endDate);

        int theaterIndex = 0;

        for (MovieEntity movie : latestMovies) {
            TheaterEntity theaterEntity = theaters.get(theaterIndex);
            theaterIndex = (theaterIndex + 1) % theaters.size(); // 상영관 순환

            // 스케줄 생성
            for (LocalDate screeningDate = startDate; !screeningDate.isAfter(endDate); screeningDate = screeningDate
                    .plusDays(1)) {
                // 이미 존재하는 날짜인지 확인
                if (screeningRepository.existsByTheaterEntityAndScreeningDate(theaterEntity, screeningDate)) {
                    System.out.println(
                            "⚠ 이미 존재하는 상영 일정 (생성하지 않음): " + screeningDate + " | 상영관: " + theaterEntity.getId());
                    continue;
                }

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
                        System.out.println("🎬 상영 일정 추가됨: " + movie.getMovieNm() +
                                " | " + screeningDate + " | " + startTime + " - " + endTime + " | 상영관: "
                                + theaterEntity.getId());
                    }
                }
            }
        }
    }

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
                        .createTime(el.getCreateTime())
                        .updateTime(el.getUpdateTime())
                        .build())
                .collect(Collectors.toList());

    }

}