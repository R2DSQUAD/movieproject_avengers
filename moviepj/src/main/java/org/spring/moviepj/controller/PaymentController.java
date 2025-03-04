package org.spring.moviepj.controller;

import java.util.List;

import org.spring.moviepj.dto.CartItemDto;
import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.service.CartService;
import org.spring.moviepj.service.PaymentService;
import org.spring.moviepj.service.impl.CartServiceImpl;
import org.spring.moviepj.service.impl.PaymentServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final CartServiceImpl cartServiceImpl;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/payment/orderSettlement")
    public ResponseEntity<?> payment(
            @AuthenticationPrincipal MemberDto memberDto,
            @RequestBody List<Long> cartItemIds) {
        if (memberDto == null || memberDto.getEmail() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }

        try {
            List<CartItemDto> selectedCartItems = cartServiceImpl.getSelectedCartItems(cartItemIds,
                    memberDto.getEmail());
            return ResponseEntity.ok(selectedCartItems);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
