package org.spring.moviepj.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.spring.moviepj.common.Role;
import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.service.MemberService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
                                memberEntity.getMemberRoleList().stream().map(Enum::name).toList());
        }

        @Override
        public List<MemberDto> memberList() {
                List<MemberEntity> memberEntities = memberRepository.findAll();
                // 빈 목록인 경우 빈 리스트 반환
                return memberEntities.stream()
                                .map(memberEntity -> new MemberDto(
                                                memberEntity.getEmail(),
                                                memberEntity.getPw(),
                                                memberEntity.getNickname(),
                                                memberEntity.isSocial(),
                                                memberEntity.getMemberRoleList().stream().map(Enum::name).toList()))
                                .toList();
        }

        @Override
        public MemberDto updateMember(String email, MemberDto memberDto) {
                MemberEntity memberEntity = memberRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));
                // 수정할 필드 업데이트 (비밀번호는 입력된 경우에만 업데이트)
                memberEntity.setNickname(memberDto.getNickname());
                if (memberDto.getPw() != null && !memberDto.getPw().isEmpty()) {
                        memberEntity.setPw(passwordEncoder.encode(memberDto.getPw()));
                }
                memberEntity.setSocial(memberDto.isSocial());

                MemberEntity updatedEntity = memberRepository.save(memberEntity);
                return new MemberDto(
                                updatedEntity.getEmail(),
                                updatedEntity.getPw(),
                                updatedEntity.getNickname(),
                                updatedEntity.isSocial(),
                                updatedEntity.getMemberRoleList().stream().map(Enum::name).toList());
        }

        @Override
        public void deleteMember(String email) {
                MemberEntity memberEntity = memberRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));
                memberRepository.delete(memberEntity);
        }

        @Override
        public Page<MemberDto> searchMembers(String email, String nickname, Pageable pageable) {
                Page<MemberEntity> memberPage;
                if (email != null && !email.isEmpty()) {
                        memberPage = memberRepository.findByEmailContaining(email, pageable);
                } else if (nickname != null && !nickname.isEmpty()) {
                        memberPage = memberRepository.findByNicknameContaining(nickname, pageable);
                } else {
                        memberPage = memberRepository.findAll(pageable);
                }
                return memberPage.map(memberEntity -> new MemberDto(
                                memberEntity.getEmail(),
                                memberEntity.getPw(),
                                memberEntity.getNickname(),
                                memberEntity.isSocial(),
                                memberEntity.getMemberRoleList().stream().map(Enum::name)
                                                .collect(Collectors.toList())));
        }
}
