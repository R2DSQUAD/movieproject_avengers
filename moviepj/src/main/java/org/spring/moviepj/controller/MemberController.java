// package org.spring.moviepj.controller;

// import org.spring.moviepj.config.JwtTokenProvider;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.AuthenticationManager;
// import
// org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/member")
// public class MemberController {

// private final AuthenticationManager authenticationManager;
// private final JwtTokenProvider jwtTokenProvider;

// public MemberController(AuthenticationManager authenticationManager,
// JwtTokenProvider jwtTokenProvider) {
// this.authenticationManager = authenticationManager;
// this.jwtTokenProvider = jwtTokenProvider;
// }
// @CrossOrigin(origins = "http://localhost:3000")
// @PostMapping("/login")
// public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
// // 로그인 인증
// Authentication authentication = authenticationManager.authenticate(
// new UsernamePasswordAuthenticationToken(loginRequest.getUserEmail(),
// loginRequest.getUserPw())
// );

// // 인증 후 SecurityContext에 저장
// SecurityContextHolder.getContext().setAuthentication(authentication);

// // JWT 토큰 생성
// String token = jwtTokenProvider.createToken(authentication.getName());

// return ResponseEntity.ok(new JwtResponse(token));
// }

// // 로그인 요청을 받을 DTO 클래스
// public static class LoginRequest {
// private String userEmail;
// private String userPw;

// // getter와 setter 메서드 추가
// public String getUserEmail() {
// return userEmail;
// }

// public void setUserEmail(String userEmail) {
// this.userEmail = userEmail;
// }

// public String getUserPw() {
// return userPw;
// }

// public void setUserPw(String userPw) {
// this.userPw = userPw;
// }
// }

// // JWT 응답 DTO 클래스
// public static class JwtResponse {
// private String token;

// public JwtResponse(String token) {
// this.token = token;
// }

// public String getToken() {
// return token;
// }
// }
// }
