package org.spring.moviepj.repository;

import org.spring.moviepj.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

    // 사용자 이메일로 리프레시 토큰 찾기 (이메일을 기준으로 검색)
    RefreshTokenEntity findByUserEmail(String userEmail);
}
