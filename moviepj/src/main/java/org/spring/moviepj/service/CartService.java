package org.spring.moviepj.service;

import org.spring.moviepj.dto.CartItemRequestDto;

public interface CartService {

    void addCart(CartItemRequestDto cartItemRequestDto, String email);

}
