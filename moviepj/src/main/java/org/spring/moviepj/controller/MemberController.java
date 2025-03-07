package org.spring.moviepj.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.service.impl.MemberServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {

    private final MemberServiceImpl memberServiceImpl;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/member/join")
    public ResponseEntity<?> join(@Valid @RequestBody MemberDto memberDto, BindingResult bindingResult) {

        // 1. 유효성 검사 실패 시 오류 메시지를 반환
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField, // 필드 이름
                            FieldError::getDefaultMessage, // 오류 메시지
                            (existing, replacement) -> existing // 중복 키가 발생할 때 기존 값을 사용
                    ));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        // 2. 유효성 검사를 통과하면 회원가입 진행
        memberServiceImpl.insertMember(memberDto);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myinfo/detail")
    public ResponseEntity<MemberDto> memberDetail(@AuthenticationPrincipal MemberDto memberDto) {
        if (memberDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 로그인하지 않은 사용자
        }

        MemberDto detail = memberServiceImpl.memberDetail(memberDto.getEmail());
        return ResponseEntity.ok(detail);
    }

    // 본인정보수정하기
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/myinfo/update")
    public ResponseEntity<?> updateMyInfo(
            @AuthenticationPrincipal MemberDto principal,
            @RequestBody Map<String, String> updateData) {
        // updateData 예: {"currentPassword": "현재비밀번호", "nickname": "새닉네임",
        // "newPassword": "새비밀번호"}
        String currentPassword = updateData.get("currentPassword");
        String newNickname = updateData.get("nickname");
        String newPassword = updateData.get("newPassword");

        MemberEntity memberEntity = memberRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + principal.getEmail()));

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(currentPassword, memberEntity.getPw())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("현재 비밀번호가 일치하지 않습니다.");
        }

        // 이메일, 소셜, 역할은 수정 불가
        memberEntity.setNickname(newNickname);
        if (newPassword != null && !newPassword.isEmpty()) {
            memberEntity.setPw(passwordEncoder.encode(newPassword));
        }

        MemberEntity updated = memberRepository.save(memberEntity);
        MemberDto updatedDto = new MemberDto(
                updated.getEmail(),
                updated.getPw(),
                updated.getNickname(),
                updated.isSocial(),
                updated.getMemberRoleList().stream().map(Enum::name).collect(Collectors.toList()));
        return ResponseEntity.ok(updatedDto);
    }

}