package org.spring.moviepj.service.impl;

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
    public void memberInsert(MemberDto memberDto) {

        memberRepository.save(MemberEntity.builder()
                .userEmail(memberDto.getUserEmail())
                .userPw(passwordEncoder.encode(memberDto.getUserPw()))
                .userName(memberDto.getUserName())
                .role(Role.MEMBER)
                .build());
    }

    @Override
    public MemberDto loginUser(String username) {
        MemberEntity memberEntity = memberRepository.findByUserEmail(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return MemberDto.builder()
                .id(memberEntity.getId())
                .userEmail(memberEntity.getUserEmail())
                .userName(memberEntity.getUserName())
                .role(memberEntity.getRole())
                .createTime(memberEntity.getCreateTime())
                .updateTime(memberEntity.getUpdateTime())
                .build();
    }

}
