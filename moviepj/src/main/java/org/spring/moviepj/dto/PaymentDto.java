package org.spring.moviepj.dto;

import java.time.LocalDateTime;

import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.MemberEntity;

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
public class PaymentDto {

    private Long id;

    private Long cartId;
    private CartEntity cartEntity;

    private int totalAmount;

    private Long memberId;
    private MemberEntity memberEntity;

    private String paymentMethod;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
