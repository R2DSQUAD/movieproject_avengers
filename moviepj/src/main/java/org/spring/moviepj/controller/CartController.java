package org.spring.moviepj.controller;

import org.spring.moviepj.dto.CartItemRequestDto;
import org.spring.moviepj.service.impl.CartServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CartController {

    private final CartServiceImpl cartServiceImpl;

    @PostMapping("/cart/insert")
    public ResponseEntity<?> addCart(@RequestBody CartItemRequestDto cartItemRequestDto,
            @AuthenticationPrincipal String email) {

        try {
            cartServiceImpl.addCart(cartItemRequestDto, email);
            return ResponseEntity.status(HttpStatus.OK).body("장바구니에 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
