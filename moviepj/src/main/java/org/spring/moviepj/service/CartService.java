package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.CartItemDto;
import org.spring.moviepj.dto.CartItemRequestDto;
import org.spring.moviepj.entity.CartItemEntity;

public interface CartService {

    void addCart(CartItemRequestDto cartItemRequestDto, String email);

    List<CartItemDto> myCartList(String email);

    void deleteCartItems(List<Long> ids, String email);

    List<CartItemDto> getSelectedCartItems(List<Long> cartItemIds, String email);

}