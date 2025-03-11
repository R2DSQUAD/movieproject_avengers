package org.spring.moviepj.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.PaymentDto;
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
import org.springframework.transaction.annotation.Propagation;
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

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseData = response.getBody();
            return (String) ((Map<String, Object>) responseData.get("response")).get("access_token");
        }

        return null;
    }

    public boolean verifyPayment(String impUid, int amount) {

        String token = getAccessToken();
        if (token == null) {
            return false;
        }

        String url = "https://api.iamport.kr/payments/" + impUid;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> paymentResponse = (Map<String, Object>) response.getBody().get("response");
            if (paymentResponse == null)
                return false;

            int responseAmount = Integer.parseInt(paymentResponse.get("amount").toString());
            String responsePgProvider = (String) paymentResponse.get("pg_provider");

            return responseAmount == amount;
        }

        return false;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void paymentSave(PaymentRequestDto paymentRequestDto, String email) {

        MemberEntity memberEntity = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        // 상태가 0(미결제)인 cartItem만 가져옴
        List<CartItemEntity> cartItems = cartItemRepository.findByIdInAndStatus(paymentRequestDto.getCartItemIds(), 0);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("결제할 장바구니 항목을 찾을 수 없습니다.");
        }

        // PaymentEntity를 생성하여 한 번에 저장 (Batch Insert)
        List<PaymentEntity> payments = cartItems.stream().map(cartItem -> {
            cartItem.setStatus(1); // 결제 완료 상태 변경

            PaymentEntity paymentEntity = PaymentEntity.builder()
                    .cartItemEntity(cartItem)
                    .memberEntity(memberEntity)
                    .paymentMethod(paymentRequestDto.getPaymentMethod())
                    .totalAmount(paymentRequestDto.getTotalPrice())
                    .build();

            cartItem.setPaymentEntity(paymentEntity);
            return paymentEntity;
        }).collect(Collectors.toList());

        paymentRepository.saveAll(payments);
        cartItemRepository.saveAll(cartItems);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDto> myPaymentList(String email) {
        List<PaymentEntity> paymentEntities = paymentRepository.findByMemberEntityEmail(email);

        return paymentEntities.stream()
                .map(el -> PaymentDto.builder()
                        .seatNumber(el.getCartItemEntity().getSeatNumber())
                        .screeningDate(el.getCartItemEntity().getScreeningEntity().getScreeningDate().toString())
                        .screeningTime(el.getCartItemEntity().getScreeningEntity().getScreeningTime().toString())
                        .screeningEndTime(el.getCartItemEntity().getScreeningEntity().getScreeningEndTime().toString())
                        .theaterName(el.getCartItemEntity().getScreeningEntity().getTheaterEntity().getName())
                        .cinemaName(el.getCartItemEntity().getScreeningEntity().getTheaterEntity().getCinemaEntity()
                                .getCinemaName())
                        .movieNm(el.getCartItemEntity().getScreeningEntity().getMovieEntity().getMovieNm())
                        .posterPath(el.getCartItemEntity().getScreeningEntity().getMovieEntity().getPoster_path())
                        .totalAmount(el.getTotalAmount())
                        .paymentMethod(el.getPaymentMethod())
                        .createTime(el.getCreateTime())
                        .updateTime(el.getUpdateTime())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDto> paymentList() {
        List<PaymentEntity> paymentEntities = paymentRepository.findAll();

        return paymentEntities.stream()
                .map(el -> PaymentDto.builder()
                        .seatNumber(el.getCartItemEntity().getSeatNumber())
                        .screeningDate(el.getCartItemEntity().getScreeningEntity().getScreeningDate().toString())
                        .screeningTime(el.getCartItemEntity().getScreeningEntity().getScreeningTime().toString())
                        .screeningEndTime(el.getCartItemEntity().getScreeningEntity().getScreeningEndTime().toString())
                        .theaterName(el.getCartItemEntity().getScreeningEntity().getTheaterEntity().getName())
                        .cinemaName(el.getCartItemEntity().getScreeningEntity().getTheaterEntity().getCinemaEntity()
                                .getCinemaName())
                        .movieNm(el.getCartItemEntity().getScreeningEntity().getMovieEntity().getMovieNm())
                        .posterPath(el.getCartItemEntity().getScreeningEntity().getMovieEntity().getPoster_path())
                        .totalAmount(el.getTotalAmount())
                        .paymentMethod(el.getPaymentMethod())
                        .email(el.getMemberEntity().getEmail())
                        .createTime(el.getCreateTime())
                        .updateTime(el.getUpdateTime())
                        .build())
                .collect(Collectors.toList());
    }

}
