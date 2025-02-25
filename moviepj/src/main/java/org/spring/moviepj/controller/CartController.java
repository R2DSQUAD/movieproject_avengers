package org.spring.moviepj.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.CartItemDto;
import org.spring.moviepj.dto.CartItemRequestDto;
import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.entity.CartItemEntity;
import org.spring.moviepj.repository.CartItemRepository;
import org.spring.moviepj.service.impl.CartServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    private final CartItemRepository cartItemRepository;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/cart/insert")
    public ResponseEntity<?> addCart(@RequestBody CartItemRequestDto cartItemRequestDto,
            @AuthenticationPrincipal MemberDto memberDto) {

        System.out.println("요청 데이터: " + cartItemRequestDto);
        System.out.println("이메일: " + memberDto.getEmail());

        try {
            cartServiceImpl.addCart(cartItemRequestDto, memberDto.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body("장바구니에 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/cart/myCartList")
    public ResponseEntity<?> myCartList(@AuthenticationPrincipal String email) {

        try {
            List<CartItemDto> cartItemDtos = cartServiceImpl.myCartList(email, 0);
            return ResponseEntity.status(HttpStatus.OK).body("장바구니리스트 입니다");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/cart/disabledSeats/{screeningId}") // 프론트에서 사용 -> 해당상영스케줄좌석리스트(예약된좌석제외하고)
    public ResponseEntity<List<String>> getDisabledSeats(@PathVariable Long screeningId) {
        List<String> disabledSeats = cartItemRepository.findByScreeningEntityId(screeningId).stream()
                .map(CartItemEntity::getSeatNumber)
                .collect(Collectors.toList());
        return ResponseEntity.ok(disabledSeats);
    }

}