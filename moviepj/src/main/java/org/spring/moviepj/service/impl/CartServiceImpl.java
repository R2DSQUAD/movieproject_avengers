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
                    .totalPrice(0)
                    .build());
            System.out.println("Cart ID: " + cartEntity.getId());
        }

        int totalPrice = 0;

        for (String seat : cartItemRequestDto.getSeats()) {
            ScreeningEntity screeningEntity = screeningRepository.findById(cartItemRequestDto.getScreeningId())
                    .orElseThrow(() -> new IllegalArgumentException("상영 정보를 찾을 수 없습니다."));

            // 모든 사용자의 장바구니에 해당 좌석이 있는지 검사
            boolean seatExists = cartItemRepository.existsByScreeningEntityAndSeatNumber(screeningEntity, seat);
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
                .totalPrice(cartEntity.getTotalPrice())
                .seatNumber(el.getSeatNumber())
                .price(el.getPrice())
                .screeningDate(el.getScreeningEntity().getScreeningDate().toString())
                .screeningTime(el.getScreeningEntity().getScreeningTime().toString())
                .movieNm(el.getScreeningEntity().getMovieEntity().getMovieNm())
                .theaterName(el.getScreeningEntity().getTheaterEntity().getName())
                .createTime(el.getCreateTime())
                .updateTime(el.getUpdateTime())
                .build()).collect(Collectors.toList());

    }

    @Override
    public void deleteCartItems(List<Long> ids, String email) {
        MemberEntity memberEntity = memberRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("회원정보를 찾을 수 없습니다"));

        CartEntity cartEntity = cartRepository.findByMemberEntityAndStatus(memberEntity, 0)
                .orElseThrow(() -> new IllegalArgumentException("장바구니가 존재하지 않습니다"));

        List<CartItemEntity> itemsToDelete = cartItemRepository.findAllById(ids);

        int totalPriceToRemove = itemsToDelete.stream().mapToInt(CartItemEntity::getPrice).sum();

        cartItemRepository.deleteAll(itemsToDelete);

        // 총 가격 업데이트 (삭제했으니까 장바구니 총가격 변동)
        cartEntity.setTotalPrice(cartEntity.getTotalPrice() - totalPriceToRemove);
        cartRepository.save(cartEntity);
    }

}