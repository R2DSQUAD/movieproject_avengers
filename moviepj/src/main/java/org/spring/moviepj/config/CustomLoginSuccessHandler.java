package org.spring.moviepj.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    // JwtTokenProvider 의존성 주입
    public CustomLoginSuccessHandler(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // 인증된 사용자 정보 (예: username)
        String username = authentication.getName();

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(username);

        // 응답에 JWT 토큰 포함
        response.setContentType("application/json");
        response.getWriter().write("{ \"token\": \"" + token + "\" }");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
