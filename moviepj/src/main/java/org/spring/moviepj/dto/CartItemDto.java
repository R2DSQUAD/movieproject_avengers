package org.spring.moviepj.dto;

import java.time.LocalDateTime;

import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.ScreeningEntity;

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
public class CartItemDto {

    private Long id;

    private Long cartId;
    private CartEntity cartEntity;

    private String seatNumber;

    private int price;

    private Long screeningId;
    private ScreeningEntity screeningEntity;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
