package org.spring.moviepj.config.ws.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class MessageDto {  // 메시지 출력

  private String today;  // 날짜
  private String time;   // 시간
  private AnswerDto answer;  // 답변 객체
  private String message;  // 메시지 추가

  // 날짜 설정 메서드
  public MessageDto today(String today) {
    this.today = today;
    return this;
  }

  // 답변 설정 메서드
  public MessageDto answer(AnswerDto answer) {   // 답변  , 키워드 , 전화 번호
    this.answer = answer;
    return this;
  }

  // 메시지 설정 메서드
  public MessageDto setMessage(String message) {
    this.message = message;
    return this;
  }
}
