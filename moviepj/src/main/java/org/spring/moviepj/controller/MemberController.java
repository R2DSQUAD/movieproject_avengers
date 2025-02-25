package org.spring.moviepj.controller;

import java.util.Map;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.service.impl.MemberServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/myinfo/detail")
    public ResponseEntity<MemberDto> memberDetail(@AuthenticationPrincipal MemberDto memberDto) {
        if (memberDto == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 로그인하지 않은 사용자
        }

        MemberDto detail = memberServiceImpl.memberDetail(memberDto.getEmail());
        return ResponseEntity.ok(detail);
    }

    // Member 수정,삭제 나중에 추가예정
}