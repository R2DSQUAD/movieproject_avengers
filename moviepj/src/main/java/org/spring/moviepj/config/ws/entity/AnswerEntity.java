package org.spring.moviepj.config.ws.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.spring.moviepj.config.ws.dto.AnswerDto;

import jakarta.persistence.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "answer")
public class AnswerEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long no;

  private String content;

  private String keyword;    //name

  public AnswerEntity keyword(String keyword) {
    this.keyword=keyword;
    return this;
  }

  public AnswerDto toAnswerDTO() {
    return AnswerDto.builder()
            .no(no).content(content).keyword(keyword)
            .build();
  }
}
