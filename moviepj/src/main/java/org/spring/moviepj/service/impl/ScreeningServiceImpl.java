package org.spring.moviepj.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.ScreeningDto;
import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.entity.ScreeningEntity;
import org.spring.moviepj.entity.TheaterEntity;
import org.spring.moviepj.repository.CinemaRepository;
import org.spring.moviepj.repository.MovieRepository;
import org.spring.moviepj.repository.ScreeningRepository;
import org.spring.moviepj.repository.TheaterRepository;
import org.spring.moviepj.service.ScreeningService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ScreeningServiceImpl implements ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final CinemaRepository cinemaRepository;

    private static final int NUMBER_OF_THEATERS = 10;
    private static final List<LocalTime> SCREENING_TIMES = List.of(
            LocalTime.of(7, 0), LocalTime.of(10, 0), LocalTime.of(13, 0),
            LocalTime.of(16, 0), LocalTime.of(19, 0), LocalTime.of(22, 0));

    @Scheduled(cron = "0 32 11 * * *")
    public void updateScreenings() {
        log.debug("[자동 실행] 상영 일정 추가 작업 시작");
        try {
            log.info("스케줄링 작업 실행");

            // 최신 영화 추가 날짜 가져오기
            Optional<LocalDate> latestCreateDateOpt = movieRepository.findLatestCreateDate();
            LocalDate latestCreateDate = latestCreateDateOpt.orElse(LocalDate.now());

            log.info("📌 최신 영화 추가 날짜: {}", latestCreateDate);

            // 기존 영화는 절대 포함하지 않고 새로운 영화만 가져옴
            List<MovieEntity> newMovies = movieRepository.findNewMoviesAfter(latestCreateDate);

            log.info("📌 새로운 영화 개수: {}", newMovies.size());
            for (MovieEntity movie : newMovies) {
                log.info("📌 새로운 영화: {} | createTime: {}", movie.getMovieNm(), movie.getCreateTime());
            }

            if (!newMovies.isEmpty()) {
                log.info("[새로운 영화 추가됨] 오늘 포함 5일치 상영 스케줄 생성");
                createScreenings(5, newMovies);
            } else {
                log.info("[일일 실행] 새로운 영화가 없으므로 기존 영화 스케줄 추가하지 않음");
            }
        } catch (Exception e) {
            log.error("[자동 실행] 상영 일정 추가 작업 실패", e);
        } finally {
            log.debug("[자동 실행] 상영 일정 추가 작업 종료");
        }
    }

    @Override
    public void createScreenings(int daysToAdd, List<MovieEntity> newMovies) {
        log.info("createScreenings() started");
        try {
            List<CinemaEntity> allCinemas = cinemaRepository.findAll();
            if (allCinemas.isEmpty()) {
                log.warn("등록된 시네마 정보가 없습니다. 상영 스케줄을 생성할 수 없습니다.");
                return;
            }

            if (newMovies.isEmpty()) {
                log.info(" 새로운 영화가 없으므로 기존 영화 스케줄 생성하지 않음");
                return;
            }

            Optional<LocalDate> latestScreeningDateOpt = screeningRepository.findLatestScreeningDate();
            LocalDate startDate = latestScreeningDateOpt
                    .map(date -> date.plusDays(1))
                    .orElse(LocalDate.now());

            LocalDate endDate = startDate.plusDays(daysToAdd - 1);
            log.info(" 새로운 영화 스케줄 생성: {} ~ {}", startDate, endDate);

            for (CinemaEntity cinema : allCinemas) {
                List<TheaterEntity> theaters = theaterRepository.findByCinemaEntity(cinema);
                if (theaters.size() != NUMBER_OF_THEATERS) {
                    log.warn("⚠ {} 시네마의 상영관 수가 {}개가 아닙니다. 다시 확인해주세요.", cinema.getCinemaName(), NUMBER_OF_THEATERS);
                    return;
                }

                for (LocalDate currentScreeningDate = startDate; !currentScreeningDate
                        .isAfter(endDate); currentScreeningDate = currentScreeningDate.plusDays(1)) {
                    createTheaterScreenings(cinema, theaters, newMovies, currentScreeningDate);
                }
            }
            log.info("createScreenings() ended");
        } catch (Exception e) {
            log.error("createScreenings() 실패", e);
        }
    }

    private void createTheaterScreenings(CinemaEntity cinema, List<TheaterEntity> theaters, List<MovieEntity> movies,
            LocalDate currentScreeningDate) {
        for (int i = 0; i < theaters.size(); i++) {
            TheaterEntity theater = theaters.get(i);
            MovieEntity movie = movies.get(i % movies.size());
            List<ScreeningEntity> newScreenings = new ArrayList<>();

            for (LocalTime startTime : SCREENING_TIMES) {
                String runTimeStr = movie.getRunTime();
                int runTime = 120;
                try {
                    runTime = Integer.parseInt(runTimeStr.replaceAll("[^0-9]", ""));
                } catch (Exception e) {
                    log.warn("영화 런타임 정보가 올바르지 않습니다. 기본값 120분으로 설정합니다. : {}", runTimeStr);
                }
                LocalTime endTime = startTime.plusMinutes(runTime);
                if (isScreeningTimeAvailable(theater, currentScreeningDate, startTime, endTime)) {
                    ScreeningEntity screening = ScreeningEntity.builder()
                            .movieEntity(movie)
                            .theaterEntity(theater)
                            .screeningDate(currentScreeningDate)
                            .screeningTime(startTime)
                            .screeningEndTime(endTime)
                            .build();
                    newScreenings.add(screening);
                }
            }
            screeningRepository.saveAll(newScreenings);
            log.info("상영관 {}에 새로운 영화의 상영 일정 저장 완료. 총 {}개", theater.getName(), newScreenings.size());
        }
    }

    private boolean isScreeningTimeAvailable(TheaterEntity theater, LocalDate date, LocalTime startTime,
            LocalTime endTime) {
        if (date.isBefore(LocalDate.now()) || (date.isEqual(LocalDate.now()) && startTime.isBefore(LocalTime.now()))) {
            log.warn("과거 시간의 상영 스케줄을 생성할 수 없습니다. : {} | {} | {}", date, startTime, endTime);
            return false;
        }
        return screeningRepository.countOverlappingScreenings(theater, date, startTime, endTime) == 0;
    }

    @Override
    public List<ScreeningDto> getScreeningsByMovieId(Long movieId) {
        return screeningRepository.findByMovieEntity_Id(movieId).stream()
                .map(el -> ScreeningDto.builder()
                        .id(el.getId())
                        .movieEntity(el.getMovieEntity())
                        .theaterEntity(el.getTheaterEntity())
                        .screeningDate(el.getScreeningDate())
                        .screeningTime(el.getScreeningTime())
                        .screeningEndTime(el.getScreeningEndTime())
                        .createTime(el.getCreateTime())
                        .updateTime(el.getUpdateTime()).build())
                .collect(Collectors.toList());
    }

    @Override
    public ScreeningDto getScreeningById(Long screeningId) {
        return screeningRepository.findByIdWithMovie(screeningId)
                .map(el -> ScreeningDto.builder()
                        .id(el.getId())
                        .movieEntity(el.getMovieEntity())
                        .theaterEntity(el.getTheaterEntity())
                        .screeningDate(el.getScreeningDate())
                        .screeningTime(el.getScreeningTime())
                        .screeningEndTime(el.getScreeningEndTime())
                        .createTime(el.getCreateTime())
                        .updateTime(el.getUpdateTime()).build())
                .orElse(null);
    }
}
