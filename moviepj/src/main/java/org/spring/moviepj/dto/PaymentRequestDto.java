package org.spring.moviepj.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PaymentRequestDto {
    private List<Long> cartItemIds;
    private String paymentMethod;
    private int totalPrice;

}
