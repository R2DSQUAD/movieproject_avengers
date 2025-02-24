package org.spring.moviepj.service.impl;

import java.util.Optional;

import org.spring.moviepj.dto.CartItemRequestDto;
import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.CartItemEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.ScreeningEntity;
import org.spring.moviepj.repository.CartItemRepository;
import org.spring.moviepj.repository.CartRepository;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.repository.ScreeningRepository;
import org.spring.moviepj.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final MemberRepository memberRepository;

    private final CartRepository cartRepository;

    private final CartItemRepository cartItemRepository;

    private final ScreeningRepository screeningRepository;

    @Override
    public void addCart(CartItemRequestDto cartItemRequestDto, String email) {
        MemberEntity memberEntity = memberRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("회원정보를 찾을 수 없습니다"));

        // 결제하지않은 0상태 장바구니 가져오거나 없으면 0상태 생성
        CartEntity cartEntity = cartRepository.findByMemberEntityAndStatus(memberEntity, 0)
                .orElseGet(() -> CartEntity.builder()
                        .memberEntity(memberEntity)
                        .status(0)
                        .totalPrice(0)
                        .build());

        cartRepository.save(cartEntity);

        int totalPrice = 0;

        for (String seat : cartItemRequestDto.getSeats()) {
            ScreeningEntity screeningEntity = screeningRepository.findById(cartItemRequestDto.getScreeningId())
                    .orElseThrow(() -> new IllegalArgumentException("상영 정보를 찾을 수 없습니다."));

            boolean seatExists = cartItemRepository.existsByCartEntityAndSeatNumber(cartEntity, seat);
            if (seatExists) {
                throw new IllegalArgumentException("이미 선택된 좌석입니다: " + seat);
            }

            CartItemEntity cartItemEntity = CartItemEntity.builder()
                    .cartEntity(cartEntity)
                    .seatNumber(seat)
                    .price(15000)
                    .screeningEntity(screeningEntity)
                    .build();
            cartItemRepository.save(cartItemEntity);

            totalPrice += 15000;
        }

        cartEntity.setTotalPrice(cartEntity.getTotalPrice() + totalPrice);
        cartRepository.save(cartEntity);

    }

}
