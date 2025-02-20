package org.spring.moviepj.controller;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.service.impl.MemberServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberOnlyController {

    private final MemberServiceImpl memberServiceImpl;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody MemberDto memberDto) {

        memberServiceImpl.memberInsert(memberDto);

        return ResponseEntity.status(HttpStatus.OK).body("회원가입성공");
    }

    @GetMapping("/login")
    public ResponseEntity<String> login() {
        return ResponseEntity.ok("로그인 페이지입니다.");
    }

}
