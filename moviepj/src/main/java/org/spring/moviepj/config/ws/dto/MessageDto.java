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

  private String today;

  private String time;

  private AnswerDto answer;

  public MessageDto today(String today) {
    this.today=today;
    return this;
  }
  public MessageDto answer(AnswerDto answer) {   // 답변  , 키워드 , 전화 번호
    this.answer=answer;
    return this;
  }
}
