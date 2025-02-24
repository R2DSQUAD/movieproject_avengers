package org.spring.moviepj.repository;

import java.util.Optional;

import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    Optional<CartEntity> findByMemberEntityAndStatus(MemberEntity memberEntity, int status);

}
