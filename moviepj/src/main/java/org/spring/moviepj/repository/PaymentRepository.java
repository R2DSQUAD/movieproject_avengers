package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.PaymentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    List<PaymentEntity> findByMemberEntityEmail(String email);

    Page<PaymentEntity> findByMemberEntityEmailContaining(String email, Pageable pageable);

    Page<PaymentEntity> findByPaymentMethodContaining(String paymentMethod, Pageable pageable);

}
