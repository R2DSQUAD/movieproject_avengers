package org.spring.moviepj.config.ws.service;

import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.KomoranResult;

import org.spring.moviepj.config.ws.dto.AnswerDto;
import org.spring.moviepj.config.ws.dto.MessageDto;
import org.spring.moviepj.config.ws.entity.AnswerEntity;
import org.spring.moviepj.config.ws.entity.IntentionEntity;
import org.spring.moviepj.config.ws.repository.IntentionRepository;
import org.spring.moviepj.dto.MovieDto;
import org.spring.moviepj.entity.MovieEntity;
import org.spring.moviepj.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class KomoranService {

  @Autowired
  private Komoran komoran;  // 등록 Bean
  //  NLP(Natural Language Processing, 자연어 처리)는 인공지능의 한 분야로서 머신러닝을 사용하여 텍스트와 데이터를 처리하고  해석
  
  public MessageDto nlpAnalyze(String message) {
    System.out.println("message>>>:" + message);
    //입력 문장에 대한 형태소 분석을 수행 -> 입력 문장에 대한 형태소 분석 결과를 KomoranResult 객체로 반환
    KomoranResult result = komoran.analyze(message);// komoran message 분석
    //문자에서 명사들(리스트)만 추출한 목록 중복제거해서 set
    System.out.println("result"+ result);
    Set<String> nouns = result.getNouns().stream().collect(Collectors.toSet());
    System.out.println("nouns" + nouns);
    nouns.forEach((noun) -> {
      System.out.println(">>> >> :" + noun);
    });
    ;//메세지에서 명사추출  noun
    System.out.println(analyzeToken(nouns) + "  << result");
    return analyzeToken(nouns);  // 영화 하얼빈
  }

  // 추출된 명사를 이용하여  DB 접근
  private MessageDto analyzeToken(Set<String> nouns) {
    // 시간 설정
    LocalDateTime today = LocalDateTime.now();
    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("a H:mm");
    MessageDto messageDto = MessageDto.builder()
            .time(today.format(timeFormatter))
            .build();

    //1차 ->  존재하는지
    for (String token : nouns) {

      System.out.println(">>> >> :" + token.toString());
      Optional<IntentionEntity> result = decisionTree(token, null);

      if (result.isEmpty()) continue;//존재하지 않으면 다음토큰 검색
      //1차 토근확인시 실행
      System.out.println(">>>>1차:" + token);
      //1차목록 복사
      Set<String> next = nouns.stream().collect(Collectors.toSet());
      //목록에서 1차토큰 제거
      next.remove(token);

      //2차분석 메서드
      AnswerDto answer = analyzeToken(next, result).toAnswerDTO();

      if (token.contains("안녕")) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
        messageDto.today(today.format(dateFormatter));//처음 접속할때만 날짜표기
      }  else if (token.contains("영화 조회") || token.contains("영화")) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
        messageDto.today(today.format(dateFormatter));//처음 접속할때만 날짜표기
        System.out.println(token + " 영화이름 검색  token");
        MovieDto movie = analyzeTokenIsMovie(next);

        if (movie != null) {
          answer.movie(movie);//영화인경우에만 영화 데이터
          System.out.println(movie.getMovieNm() + " 영화이름 검색 ");
          System.out.println(answer.movie(movie) + " 영화이름 검색 ");
        }
      }

      messageDto.answer(answer);//토근에대한 응답정보
      return messageDto;
    }

    //분석 명사들이 등록한 의도와 일치하는게 존재하지 않을경우 null  "기타나 null일 경우"
    AnswerDto answer = decisionTree("기타", null).get().getAnswer().toAnswerDTO();
    messageDto.answer(answer);
    return messageDto;
  }

  // 1차
  @Autowired
  IntentionRepository intention;

  //의도가 존재하는지 DB에서 파악 -> 키워드 값 존재 하는 지  ->DB에 키워드가 있는지 확인
  private Optional<IntentionEntity> decisionTree(String token, IntentionEntity upper) {
    return intention.findByNameAndUpper(token, upper);
  }

  //1차의도가 존재하면
  //하위의도가 존재하는지 파악
  private AnswerEntity analyzeToken(Set<String> next, Optional<IntentionEntity> upper) {

    System.out.println("2차 의도-> "+next);

    for (String token : next) {
      // 1차의도를 부모로하는 토큰이 존재하는지 파악
      System.out.println("2차 의도2 -> "+next);
      Optional<IntentionEntity> result = decisionTree(token, upper.get());
      if (result.isEmpty()) continue;
      return result.get().getAnswer();   //1차-2차 존재하는경우 답변
    }
    return upper.get().getAnswer();  //1차만 존재하는 답변
  }


  //2차 영화
  @Autowired
  MovieRepository movieRepository;

  private List<MovieDto> analyzeTokenIsMovieList(Set<String> next) {

    System.out.println(next.toString()+" name1");
    for (String name : next) {
      System.out.println(name+" name");

      List<MovieEntity> movieDtoList = movieRepository.findAll();
      List<MovieDto> movieDtos = new ArrayList<>();
      for (MovieEntity movieEntity : movieDtoList) {
        MovieDto movieDto = MovieDto.builder() 
                .movieCd(movieEntity.getMovieCd())
                .movieNm(movieEntity.getMovieNm())
                .poster_path(movieEntity.getPoster_path())
                .build();
        movieDtos.add(movieDto);

        System.out.println(movieEntity.getMovieNm() + " 영화이름");
      }
      return movieDtos;
    }

    return null;
  }


  //  영화 제목 조회
  // 2차 영화 제목 조회 수정
private MovieDto analyzeTokenIsMovie(Set<String> next) {
  System.out.println(next + " next");
  for (String name : next) {
      System.out.println(name + " name");

      // 영화 제목의 일부와 일치하는 영화들 찾기
      List<MovieEntity> movies = movieRepository.findByMovieNmContaining(name);
      
      // 영화 제목이 일치하는 것이 있을 경우, 해당 영화들 중 첫 번째 영화 반환 (또는 리스트 반환)
      if (!movies.isEmpty()) {
          MovieEntity movie = movies.get(0); // 일치하는 첫 번째 영화 가져오기
          System.out.println(movie.getMovieNm() + " 영화제목");

          // MovieDto로 반환
          return MovieDto.builder()
                  .movieNm(movie.getMovieNm())
                  .poster_path(movie.getPoster_path())
                  .audiAcc(movie.getAudiAcc())
                  .openDt(movie.getOpenDt())
                  .overview(movie.getOverview())
                  .build();
      }
  }
  return null;
}


}
