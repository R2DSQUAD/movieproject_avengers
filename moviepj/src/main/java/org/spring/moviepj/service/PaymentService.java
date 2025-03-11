package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.PaymentDto;
import org.spring.moviepj.dto.PaymentRequestDto;
import org.spring.moviepj.entity.PaymentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {

    void paymentSave(PaymentRequestDto paymentRequestDto, String email);

    List<PaymentDto> myPaymentList(String email);

    List<PaymentDto> paymentList();

    Page<PaymentDto> searchPaymentList(String email, String paymentMethod, Pageable pageable);

}
