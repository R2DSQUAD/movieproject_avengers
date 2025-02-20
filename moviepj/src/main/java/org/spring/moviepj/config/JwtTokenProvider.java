// package org.spring.moviepj.config;

// import java.util.Date;
// import java.util.UUID;

// import org.spring.moviepj.entity.MemberEntity;
// import org.spring.moviepj.entity.RefreshTokenEntity;
// import org.spring.moviepj.repository.RefreshTokenRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.SignatureAlgorithm;

// @Component
// public class JwtTokenProvider {

// private final String SECRET_KEY = "your-secret-key";
// private final long ACCESS_TOKEN_EXPIRATION_TIME = 1000L * 60 * 30; // 30분
// private final long REFRESH_TOKEN_EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 7;
// // 7일

// @Autowired
// private RefreshTokenRepository refreshTokenRepository;

// // 액세스 토큰 생성
// public String createToken(String userEmail) {
// return Jwts.builder()
// .setSubject(userEmail)
// .setIssuedAt(new Date())
// .setExpiration(new Date(System.currentTimeMillis() +
// ACCESS_TOKEN_EXPIRATION_TIME))
// .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
// .compact();
// }

// // 리프레시 토큰 생성
// public String createRefreshToken() {
// return Jwts.builder()
// .setSubject(UUID.randomUUID().toString()) // 리프레시 토큰은 임의의 UUID로 생성
// .setIssuedAt(new Date())
// .setExpiration(new Date(System.currentTimeMillis() +
// REFRESH_TOKEN_EXPIRATION_TIME))
// .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
// .compact();
// }

// // 리프레시 토큰 저장
// public void saveRefreshToken(MemberEntity memberEntity, String refreshToken)
// {
// RefreshTokenEntity tokenEntity = RefreshTokenEntity.builder()
// .memberEntity(memberEntity)
// .refreshToken(refreshToken)
// .expired(false) // 기본적으로 리프레시 토큰은 만료되지 않음
// .userEmail(memberEntity.getUserEmail())
// .build();

// refreshTokenRepository.save(tokenEntity);
// }

// // JWT 토큰 유효성 검사
// public boolean validateToken(String token) {
// try {
// Jwts.parser()
// .setSigningKey(SECRET_KEY)
// .parseClaimsJws(token); // JWT를 파싱하여 유효성 검사
// return true; // 토큰이 유효한 경우
// } catch (Exception e) {
// return false; // 유효하지 않으면 예외 발생
// }
// }

// // JWT 토큰에서 사용자 이름(이메일) 추출
// public String getUsername(String token) {
// Claims claims = Jwts.parser()
// .setSigningKey(SECRET_KEY)
// .parseClaimsJws(token)
// .getBody(); // 토큰의 클레임(본문)을 추출

// return claims.getSubject(); // 사용자 이름(이메일) 반환
// }
// }
