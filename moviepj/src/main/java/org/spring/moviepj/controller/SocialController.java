package org.spring.moviepj.controller;

import java.util.Map;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.service.impl.MemberServiceImpl;
import org.spring.moviepj.util.JWTUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SocialController {

    private final MemberServiceImpl memberServiceImpl;

    @GetMapping("/api/member/kakao")
    public Map<String, Object> getMemberFromKakao(@RequestParam("accessToken") String accessToken) {
        MemberDto memberDto = memberServiceImpl.getKakaoMember(accessToken);
        Map<String, Object> claims = memberDto.getClaims();

        String jwtAccessToken = JWTUtil.generateToken(claims, 10);
        String jwtRefreshToken = JWTUtil.generateToken(claims, 60 * 24);
        claims.put("accessToken", jwtAccessToken);
        claims.put("refreshToken", jwtRefreshToken);

        return claims;
    }

}
