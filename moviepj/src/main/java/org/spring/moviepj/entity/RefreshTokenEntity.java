package org.spring.moviepj.entity;

import jakarta.persistence.*;
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
@Table(name = "refresh_token_tb")
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refresh_token_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private MemberEntity memberEntity; // Member와의 관계 설정

    @Column(nullable = false)
    private String refreshToken;

    @Column(nullable = false)
    private boolean expired; // 리프레시 토큰이 만료되었는지 여부

    @Column(nullable = false)
    private String userEmail; // 사용자의 이메일 (Refresh Token을 확인할 때 사용)

    // 생성자, getter, setter 등
}
