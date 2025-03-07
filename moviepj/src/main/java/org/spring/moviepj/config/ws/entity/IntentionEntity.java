package org.spring.moviepj.config.ws.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "intention")
public class IntentionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long no;

  private String name;

  @ManyToOne
  @JoinColumn(name = "answer_no")
  private AnswerEntity answer;

  @ManyToOne
  private IntentionEntity upper;

  // 기존 생성자에 AnswerEntity를 포함
  public IntentionEntity(Long no, String name, AnswerEntity answer, IntentionEntity upper) {
    this.no = no;
    this.name = name;
    this.answer = answer;
    this.upper = upper;
  }
}
