package org.spring.moviepj.config.ws.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;



import java.util.List;

import org.spring.moviepj.config.ws.entity.HelpMessageEntity;
import org.spring.moviepj.dto.CinemaDto;
import org.spring.moviepj.dto.MovieDto;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class AnswerDto {

  private long no;
  private String content;
  private String keyword; // 키워드
  private MovieDto movie;  // 영화 정보
  private List<MovieDto> movieList;  // 영화 정보
  private CinemaDto cinema;
  private List<CinemaDto> cinemaList;
  private List<HelpMessageEntity> message;  // 메시지 추가


  public AnswerDto movie(MovieDto movie){
    this.movie=movie;
    return this;
  }
  public AnswerDto movieList(List<MovieDto> movieList){
    this.movieList=movieList;
    return this;
  }
  public AnswerDto cinemaList(List<CinemaDto> cinemaList){
    this.cinemaList=cinemaList;
    return this;
  }
  public AnswerDto cinemaDto(CinemaDto cinema){
    this.cinema=cinema;
    return this;
  }

  // 메시지 설정 메서드
  public AnswerDto message(List<HelpMessageEntity> message) {
    this.message = message;
    return this;
  }

}
