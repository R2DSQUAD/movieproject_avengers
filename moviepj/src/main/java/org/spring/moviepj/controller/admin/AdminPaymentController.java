package org.spring.moviepj.controller.admin;

import java.util.List;

import org.spring.moviepj.dto.PaymentDto;
import org.spring.moviepj.service.impl.PaymentServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/payment")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final PaymentServiceImpl paymentServiceImpl;

    @GetMapping("/paymentList")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDto>> paymentList() {
        List<PaymentDto> payments = paymentServiceImpl.paymentList();
        return ResponseEntity.ok(payments);
    }

}
