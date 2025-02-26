package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.CartItemEntity;
import org.spring.moviepj.entity.ScreeningEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {

    List<CartItemEntity> findByScreeningEntityId(Long screeningId);

    List<CartItemEntity> findByCartEntityId(Long id);

    boolean existsByScreeningEntityAndSeatNumber(ScreeningEntity screeningEntity, String seat);

}