package org.spring.moviepj.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.spring.moviepj.dto.PaymentRequestDto;
import org.spring.moviepj.entity.CartItemEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.PaymentEntity;
import org.spring.moviepj.repository.CartItemRepository;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.repository.PaymentRepository;
import org.spring.moviepj.service.PaymentService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final MemberRepository memberRepository;
    private final CartItemRepository cartItemRepository;
    private final PaymentRepository paymentRepository;

    private final String PORTONE_API_KEY = "6104657212702542";
    private final String PORTONE_SECRET_KEY = "Muuu9oRioX9YCELxtnpXGrkgWkcfuqXwXI4CNWuA4gzCTpF3jAqj7mukic9CEb05rzKF0HTQBAvveR5I";

    private String getAccessToken() {
        String url = "https://api.iamport.kr/users/getToken";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("imp_key", PORTONE_API_KEY);
        body.put("imp_secret", PORTONE_SECRET_KEY);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        System.out.println(" [포트원] 토큰 요청 응답: " + response.getBody());

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseData = response.getBody();
            return (String) ((Map<String, Object>) responseData.get("response")).get("access_token");
        }

        return null;
    }

    public boolean verifyPayment(String impUid, int amount) {

        String token = getAccessToken();

        System.out.println(" [포트원] 발급된 토큰: " + token);

        if (token == null) {
            System.out.println(" [포트원] 토큰 발급 실패!");
            return false;
        }

        String url = "https://api.iamport.kr/payments/" + impUid;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> responseData = response.getBody();
            if (responseData == null || !responseData.containsKey("response")) {
                System.out.println(" [포트원] 응답 데이터가 비어 있음");
                return false;
            }

            Map<String, Object> paymentResponse = (Map<String, Object>) responseData.get("response");
            int responseAmount = Integer.parseInt(paymentResponse.get("amount").toString());
            String responsePgProvider = (String) paymentResponse.get("pg_provider");

            // PG사가 일치하는지 검증
            if (!responsePgProvider.equals("kakaopay") && !responsePgProvider.equals("html5_inicis") &&
                    !responsePgProvider.equals("tosspay") && !responsePgProvider.equals("danal")) {
                System.out.println(" [포트원] PG사 불일치: " + responsePgProvider);
                return false;
            }

            return responseAmount == amount; // 결제 금액이 일치하는지 검증
        }

        System.out.println(" [포트원] 결제 검증 실패, 응답 상태 코드: " + response.getStatusCode());
        return false;
    }

    @Transactional
    public void paymentSave(PaymentRequestDto paymentRequestDto, String email) {
        System.out.println("📌 [결제 저장] 결제 정보 저장 시작");

        MemberEntity memberEntity = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("❌ [결제 저장] 회원 정보를 찾을 수 없습니다."));

        List<CartItemEntity> cartItems = cartItemRepository.findAllById(paymentRequestDto.getCartItemIds());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("❌ [결제 저장] 선택한 장바구니 항목을 찾을 수 없습니다.");
        }

        for (CartItemEntity cartItem : cartItems) {
            System.out.println("✅ [결제 저장] 장바구니 항목 ID: " + cartItem.getId());
            System.out.println("✅ [결제 저장] 해당 장바구니의 Cart ID: "
                    + (cartItem.getCartEntity() != null ? cartItem.getCartEntity().getId() : "NULL"));

            // ✅ cartEntity가 NULL이면 예외 발생
            if (cartItem.getCartEntity() == null) {
                throw new RuntimeException("❌ [결제 저장] cartItem에 cartEntity가 없습니다.");
            }

            cartItem.setStatus(1); // 장바구니 아이템 상태 변경 (결제 완료)

            PaymentEntity paymentEntity = PaymentEntity.builder()
                    .cartItemEntity(cartItem)
                    .memberEntity(memberEntity)
                    .paymentMethod(paymentRequestDto.getPaymentMethod())
                    .totalAmount(paymentRequestDto.getTotalPrice())
                    .build();

            paymentRepository.save(paymentEntity);
            System.out.println("✅ [결제 저장] 결제 정보 저장 완료: " + paymentEntity.getId());

            // ✅ CartItemEntity에 PaymentEntity 설정 후 저장
            cartItem.setPaymentEntity(paymentEntity);
            cartItemRepository.save(cartItem);
        }
    }

}
