package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.CartItemDto;
import org.spring.moviepj.dto.CartItemRequestDto;

public interface CartService {

    void addCart(CartItemRequestDto cartItemRequestDto, String email);

    List<CartItemDto> myCartList(String email, int status);

    void deleteCartItems(List<Long> ids, String email);
}
