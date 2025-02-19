package org.spring.moviepj.dto;

import java.time.LocalDateTime;

import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.ScreeningSeatEntity;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    private Long screeningSeatId;
    private ScreeningSeatEntity screeningSeatEntity;

    private int ticketCount; // 선택한 좌석 개수

    private int totalPrice;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
