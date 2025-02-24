package org.spring.moviepj.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemRequestDto {

    private Long screeningId;

    private List<String> seats;

}
