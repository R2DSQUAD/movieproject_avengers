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

        // 기존 장바구니 조회 (status 없이 단순히 멤버 기준)
        Optional<CartEntity> optionalCartEntity = cartRepository.findByMemberEntity(memberEntity);

        CartEntity cartEntity;
        if (optionalCartEntity.isPresent()) {
            cartEntity = optionalCartEntity.get();
        } else {
            cartEntity = cartRepository.save(CartEntity.builder()
                    .memberEntity(memberEntity)
                    .build());
        }

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
                    .status(0) // 미결제 상태로 추가
                    .build();
            cartItemRepository.save(cartItemEntity);
        }
    }

    @Override
    public List<CartItemDto> myCartList(String email) {
        MemberEntity memberEntity = memberRepository.findById(email).orElseThrow(IllegalArgumentException::new);

        Optional<CartEntity> optionalCartEntity = cartRepository.findByMemberEntity(memberEntity);
        if (optionalCartEntity.isEmpty()) {
            throw new IllegalArgumentException("장바구니가 존재하지 않습니다");
        }

        CartEntity cartEntity = optionalCartEntity.get();

        // 결제되지 않은 항목만 조회
        List<CartItemEntity> cartItemEntities = cartItemRepository.findByCartEntityIdAndStatus(cartEntity.getId(), 0);

        return cartItemEntities.stream().map(el -> CartItemDto.builder()
                .id(el.getId())
                .seatNumber(el.getSeatNumber())
                .price(el.getPrice())
                .screeningDate(el.getScreeningEntity().getScreeningDate().toString())
                .screeningTime(el.getScreeningEntity().getScreeningTime().toString())
                .movieNm(el.getScreeningEntity().getMovieEntity().getMovieNm())
                .poster_path(el.getScreeningEntity().getMovieEntity().getPoster_path())
                .theaterName(el.getScreeningEntity().getTheaterEntity().getName())
                .cinemaName(el.getScreeningEntity().getTheaterEntity().getCinemaEntity().getCinemaName())
                .status(el.getStatus())
                .createTime(el.getCreateTime())
                .updateTime(el.getUpdateTime())
                .build()).collect(Collectors.toList());
    }

    @Override
    public void deleteCartItems(List<Long> ids, String email) {
        MemberEntity memberEntity = memberRepository.findById(email)
                .orElseThrow(() -> new IllegalArgumentException("회원정보를 찾을 수 없습니다"));

        CartEntity cartEntity = cartRepository.findByMemberEntity(memberEntity)
                .orElseThrow(() -> new IllegalArgumentException("장바구니가 존재하지 않습니다"));

        List<CartItemEntity> itemsToDelete = cartItemRepository.findAllById(ids);

        cartItemRepository.deleteAll(itemsToDelete);
    }

    @Override
    public List<CartItemDto> getSelectedCartItems(List<Long> cartItemIds, String email) {
        return cartItemRepository.findByIdInAndCartEntity_MemberEntity_Email(cartItemIds, email)
                .stream()
                .map(cartItem -> CartItemDto.builder()
                        .id(cartItem.getId())
                        .seatNumber(cartItem.getSeatNumber())
                        .price(cartItem.getPrice())
                        .screeningDate(cartItem.getScreeningEntity().getScreeningDate().toString())
                        .screeningTime(cartItem.getScreeningEntity().getScreeningTime().toString())
                        .poster_path(cartItem.getScreeningEntity().getMovieEntity().getPoster_path())
                        .movieNm(cartItem.getScreeningEntity().getMovieEntity().getMovieNm())
                        .theaterName(cartItem.getScreeningEntity().getTheaterEntity().getName())
                        .cinemaName(cartItem.getScreeningEntity().getTheaterEntity().getCinemaEntity().getCinemaName())
                        .createTime(cartItem.getCreateTime())
                        .updateTime(cartItem.getUpdateTime())
                        .build())
                .collect(Collectors.toList());
    }

}