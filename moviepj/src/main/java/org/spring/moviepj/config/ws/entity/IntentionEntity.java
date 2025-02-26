package org.spring.moviepj.config.ws.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Getter
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

  @JoinColumn
  @ManyToOne
  private AnswerEntity answer;

  @JoinColumn
  @ManyToOne
  private IntentionEntity upper;
}
