package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.PaymentDto;
import org.spring.moviepj.dto.PaymentRequestDto;
import org.spring.moviepj.entity.PaymentEntity;

public interface PaymentService {

    void paymentSave(PaymentRequestDto paymentRequestDto, String email);

    List<PaymentDto> myPaymentList(String email);

}
