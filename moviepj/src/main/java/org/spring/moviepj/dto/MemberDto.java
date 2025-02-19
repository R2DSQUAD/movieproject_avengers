package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.spring.moviepj.common.Role;
import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.PaymentEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDto {

    private Long id;

    private String userEmail;

    private String userPw;

    private String userName;

    private String address;

    private int phoneNumber;

    private Role role;

    private Long cartId;
    private List<CartEntity> cartEntities;

    private Long paymentId;
    private List<PaymentEntity> paymentEntities;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

}
