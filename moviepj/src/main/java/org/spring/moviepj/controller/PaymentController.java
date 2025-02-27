package org.spring.moviepj.controller;

import java.util.List;

import org.spring.moviepj.dto.CartItemDto;
import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.service.impl.CartServiceImpl;
import org.spring.moviepj.service.impl.PaymentServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServiceImpl paymentServiceImpl;

    private final CartServiceImpl cartServiceImpl;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/payment/orderSettlement")
    public ResponseEntity<?> payment(@AuthenticationPrincipal MemberDto memberDto) {

        try {
            List<CartItemDto> cartItemDtos = cartServiceImpl.myCartList(memberDto.getEmail(), 0);
            return ResponseEntity.status(HttpStatus.OK).body(cartItemDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

}
