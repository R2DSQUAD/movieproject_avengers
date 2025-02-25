package org.spring.moviepj.repository;

import java.util.Collection;
import java.util.List;

import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    boolean existsByCartEntityAndSeatNumber(CartEntity cartEntity, String seat);

    List<CartItemEntity> findByScreeningEntityId(Long screeningId);

}