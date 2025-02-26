package org.spring.moviepj.entity;

import java.util.List;

import org.spring.moviepj.common.BasicTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Entity
@Table(name = "cart_tb")
public class CartEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @JsonIgnore
    private MemberEntity memberEntity;

    @Column(nullable = false)
    private int status;

    @Column(nullable = false)
    private int totalPrice;

    @OneToMany(mappedBy = "cartEntity", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<CartItemEntity> cartItemEntities;

    @OneToOne(mappedBy = "cartEntity", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private PaymentEntity paymentEntity;

}
