package org.spring.moviepj.controller.admin;

import java.util.List;

import org.spring.moviepj.dto.PaymentDto;
import org.spring.moviepj.service.impl.PaymentServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final PaymentServiceImpl paymentServiceImpl;

    @GetMapping("/paymentList")
    public ResponseEntity<List<PaymentDto>> paymentList() {
        List<PaymentDto> payments = paymentServiceImpl.paymentList();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PaymentDto>> searchPaymentList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String paymentMethod) {

        Pageable pageable = PageRequest.of(page, size);
        Page<PaymentDto> result = paymentServiceImpl.searchPaymentList(email, paymentMethod, pageable);
        return ResponseEntity.ok(result);
    }

}
