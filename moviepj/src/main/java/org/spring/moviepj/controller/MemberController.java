package org.spring.moviepj.controller;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.service.impl.MemberServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {

    private final MemberServiceImpl memberServiceImpl;

    @PostMapping("/member/join")
    public ResponseEntity<?> join(@RequestBody MemberDto memberDto) {

        memberServiceImpl.insertMember(memberDto);

        return ResponseEntity.status(HttpStatus.OK).body(null);
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