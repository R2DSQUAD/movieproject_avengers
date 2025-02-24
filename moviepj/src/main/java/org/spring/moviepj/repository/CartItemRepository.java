package org.spring.moviepj.repository;

import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    boolean existsByCartEntityAndSeatNumber(CartEntity cartEntity, String seat);

}
