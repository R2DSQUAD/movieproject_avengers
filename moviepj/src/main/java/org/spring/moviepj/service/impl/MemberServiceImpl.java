package org.spring.moviepj.service.impl;

import java.util.Collections;
import java.util.List;

import org.spring.moviepj.common.Role;
import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.service.MemberService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void insertMember(MemberDto memberDto) {
        memberRepository.save(MemberEntity.builder()
                .email(memberDto.getEmail())
                .pw(passwordEncoder.encode(memberDto.getPw()))
                .nickname(memberDto.getNickname())
                .memberRoleList(Collections.singletonList(Role.USER)) // 기본 역할을 USER로 설정
                .build());
    }

    @Override
    public MemberDto memberDetail(String email) {
        MemberEntity memberEntity = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));

        return new MemberDto(
                memberEntity.getEmail(),
                memberEntity.getPw(),
                memberEntity.getNickname(),
                memberEntity.isSocial(),
                memberEntity.getMemberRoleList().stream()
                        .map(Enum::name)
                        .toList());
    }

    @Override
    public List<MemberDto> memberList() {
        List<MemberEntity> memberEntities = memberRepository.findAll();
        if (memberEntities.isEmpty()) {
            throw new IllegalStateException("조회할 회원목록이 없습니다"); //
        }

        return memberEntities.stream()
                .map(memberEntity -> new MemberDto(
                        memberEntity.getEmail(),
                        memberEntity.getPw(),
                        memberEntity.getNickname(),
                        memberEntity.isSocial(),
                        memberEntity.getMemberRoleList().stream()
                                .map(Enum::name)
                                .toList()))
                .toList();
    }

    // 수정,삭제 나중에 추가예정

}