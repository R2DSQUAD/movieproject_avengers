package org.spring.moviepj.controller;

import java.util.List;
import java.util.Map;
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
import org.springframework.web.bind.annotation.DeleteMapping;
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

        try {
            cartServiceImpl.addCart(cartItemRequestDto, memberDto.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body("장바구니에 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/cart/myCartList")
    public ResponseEntity<?> myCartList(@AuthenticationPrincipal MemberDto memberDto) {

        try {
            List<CartItemDto> cartItemDtos = cartServiceImpl.myCartList(memberDto.getEmail(), 0);
            return ResponseEntity.status(HttpStatus.OK).body(cartItemDtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/cart/delete")
    public ResponseEntity<?> deleteCartItems(@RequestBody Map<String, List<Long>> resquestBody,
            @AuthenticationPrincipal MemberDto memberDto) {

        List<Long> ids = resquestBody.get("ids"); // 프론트에서 받아온 장바구니아이템아이디

        try {
            cartServiceImpl.deleteCartItems(ids, memberDto.getEmail());
            return ResponseEntity.ok("선택한 항목이 삭제되었습니다");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    // 프론트에서 사용하기 위함
    @GetMapping("/cart/disabledSeats/{screeningId}")
    public ResponseEntity<List<String>> getDisabledSeats(@PathVariable Long screeningId) {
        System.out.println(">>> Screening ID: " + screeningId);

        List<String> disabledSeats = cartItemRepository.findByScreeningEntityId(screeningId).stream()
                .map(CartItemEntity::getSeatNumber)
                .collect(Collectors.toList());

        System.out.println(">>> Disabled seats: " + disabledSeats);

        return ResponseEntity.ok(disabledSeats);
    }

}