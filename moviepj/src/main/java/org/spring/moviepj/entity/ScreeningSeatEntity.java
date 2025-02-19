package org.spring.moviepj.entity;

import org.spring.moviepj.common.BasicTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "screening_seat_tb", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "screening_id", "seatNumber" })
})
public class ScreeningSeatEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "screeningSeat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screening_id", nullable = false)
    private ScreeningEntity screeningEntity;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int seatStatus;

    private String seatNumber;

    private int seatCount; // 예약가능한 좌석수

}
