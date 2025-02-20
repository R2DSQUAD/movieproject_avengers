package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.moviepj.entity.CartItemEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.PaymentEntity;

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
public class CartDto {

    private Long id;

    private Long memberId;
    private MemberEntity memberEntity;

    private int status;

    private int totalPrice;

    private Long cartItemId;
    private List<CartItemEntity> cartItemEntities;

    private Long paymentId;
    private PaymentEntity paymentEntity;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
