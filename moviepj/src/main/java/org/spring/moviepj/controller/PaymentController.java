package org.spring.moviepj.controller;

import java.util.List;
import java.util.Map;

import org.spring.moviepj.dto.CartItemDto;
import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.dto.PaymentRequestDto;
import org.spring.moviepj.service.impl.CartServiceImpl;
import org.spring.moviepj.service.impl.PaymentServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {

    private final CartServiceImpl cartServiceImpl;

    private final PaymentServiceImpl paymentServiceImpl;

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

    @PostMapping("/payment/verify")
    public ResponseEntity<?> verifyPayment(
            @AuthenticationPrincipal MemberDto memberDto,
            @RequestBody Map<String, Object> request) {

        System.out.println("📌 [결제 검증 요청] 요청이 들어옴");

        if (memberDto == null || memberDto.getEmail() == null) {
            System.out.println("❌ [결제 검증] 인증된 사용자가 없음");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }

        System.out.println("✅ [결제 검증] 요청한 사용자: " + memberDto.getEmail());

        String impUid = (String) request.get("imp_uid");
        int amount = (int) request.get("amount");

        System.out.println("📌 [결제 검증] imp_uid: " + impUid);
        System.out.println("📌 [결제 검증] amount: " + amount);

        boolean isValid = paymentServiceImpl.verifyPayment(impUid, amount);

        if (isValid) {
            System.out.println("✅ [결제 검증] 성공");
            return ResponseEntity.ok("결제 검증 성공");
        } else {
            System.out.println("❌ [결제 검증] 실패");
            return ResponseEntity.badRequest().body("결제 검증 실패");
        }
    }

    @PostMapping("/payment/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> paymentSave(@RequestBody PaymentRequestDto paymentRequestDto,
            @AuthenticationPrincipal MemberDto memberDto) {

        if (memberDto == null || memberDto.getEmail() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
        }

        try {
            paymentServiceImpl.paymentSave(paymentRequestDto, memberDto.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body("결제가 성공적으로 저장되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 저장 중 오류 발생: " + e.getMessage());
        }
    }

}