package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.moviepj.dto.movie.results;
import org.spring.moviepj.entity.CartItemEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrailerDto {
  private Long id;

  private List<results> results;
}
