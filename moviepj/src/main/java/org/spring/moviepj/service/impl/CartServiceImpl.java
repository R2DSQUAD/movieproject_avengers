package org.spring.moviepj.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.CartItemDto;
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

    @Transactional
    @Override
    public void addCart(CartItemRequestDto cartItemRequestDto, String email) {
        MemberEntity memberEntity = memberRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("회원정보를 찾을 수 없습니다"));

        Optional<CartEntity> optionalCartEntity = cartRepository.findByMemberEntityAndStatus(memberEntity, 0);

        CartEntity cartEntity;
        if (optionalCartEntity.isPresent()) {
            cartEntity = optionalCartEntity.get();
        } else {
            cartEntity = cartRepository.save(CartEntity.builder()
                    .memberEntity(memberEntity)
                    .status(0)
                    .build());
            System.out.println("Cart ID: " + cartEntity.getId());

        }
        // 결제하지않은 0상태 장바구니 가져오거나 없으면 0상태 생성

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

    @Override
    public List<CartItemDto> myCartList(String email, int status) {
        MemberEntity memberEntity = memberRepository.findById(email).orElseThrow(IllegalArgumentException::new);

        Optional<CartEntity> optionalCartEntity = cartRepository.findByMemberEntityAndStatus(memberEntity, status);
        if (optionalCartEntity.isEmpty()) {
            throw new IllegalArgumentException("장바구니가 존재하지 않습니다");
        }

        CartEntity cartEntity = optionalCartEntity.get();
        List<CartItemEntity> cartItemEntities = cartItemRepository.findByCartEntityId(cartEntity.getId());

        return cartItemEntities.stream().map(el -> CartItemDto.builder()
                .id(el.getId())
                .cartEntity(cartEntity)
                .seatNumber(el.getSeatNumber())
                .price(el.getPrice())
                .screeningEntity(el.getScreeningEntity())
                .createTime(el.getCreateTime())
                .updateTime(el.getUpdateTime())
                .build()).collect(Collectors.toList());

    }

}
