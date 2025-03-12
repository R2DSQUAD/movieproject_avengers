package org.spring.moviepj.controller;

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
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            FieldError::getDefaultMessage,
                            (existing, replacement) -> existing));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        memberServiceImpl.insertMember(memberDto);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/myinfo/detail")
    public ResponseEntity<MemberDto> memberDetail(@AuthenticationPrincipal MemberDto memberDto) {
        if (memberDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        MemberDto detail = memberServiceImpl.memberDetail(memberDto.getEmail());
        return ResponseEntity.ok(detail);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/auth/verify-password")
    public ResponseEntity<Map<String, Boolean>> verifyPassword(
            @AuthenticationPrincipal MemberDto principal,
            @RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        MemberEntity memberEntity = memberRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + principal.getEmail()));
        boolean isVerified = passwordEncoder.matches(currentPassword, memberEntity.getPw());
        Map<String, Boolean> response = Map.of("verified", isVerified);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/myinfo/update")
    public ResponseEntity<?> updateMyInfo(
            @AuthenticationPrincipal MemberDto principal,
            @RequestBody Map<String, String> updateData) {

        String newNickname = updateData.get("nickname");
        String newPassword = updateData.get("pw");
        
        if(newNickname == null || newNickname.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("닉네임을 입력해주세요.");
        }

        MemberEntity memberEntity = memberRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + principal.getEmail()));

        // 새 비밀번호가 입력되었을 경우, 유효성 검사
        if (newPassword != null && !newPassword.isEmpty()) {
            if (newPassword.length() < 8 || newPassword.length() > 20) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호는 8~20자 이내여야 합니다.");
            }
            if (!newPassword.matches("^(?=.*[A-Za-z])(?=.*\\d).+$")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호는 영문과 숫자를 포함해야 합니다.");
            }
            // 새 비밀번호를 암호화하여 저장
            memberEntity.setPw(passwordEncoder.encode(newPassword));
        }

        // 닉네임 업데이트
        memberEntity.setNickname(newNickname);

        // 저장된 엔티티를 업데이트
        MemberEntity updated = memberRepository.save(memberEntity);

        // 업데이트된 정보를 MemberDto로 반환
        MemberDto updatedDto = new MemberDto(
                updated.getEmail(),
                updated.getPw(),
                updated.getNickname(),
                updated.isSocial(),
                updated.getMemberRoleList().stream().map(Enum::name).collect(Collectors.toList()));

        return ResponseEntity.ok(updatedDto);
    }

}
