package org.spring.moviepj.service.impl;

import java.lang.reflect.Member;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

import org.spring.moviepj.common.Role;
import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.dto.movie.results;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.service.MemberService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

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

    @Override
    public MemberDto getKakaoMember(String accessToken) {

        String email = getEmailFromKakaoAccessToken(accessToken);
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(email);
        // 기존회원
        if (optionalMemberEntity.isPresent()) {
            MemberDto memberDto = entityToDto(optionalMemberEntity.get());
            return memberDto;
        }
        // 기존회원아니면
        MemberEntity memberEntity = makeSocialMember(email);
        memberRepository.save(memberEntity);
        MemberDto memberDto = entityToDto(memberEntity);

        return memberDto;
    }

    private String getEmailFromKakaoAccessToken(String accessToken) {
        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";
        if (accessToken == null) {
            throw new RuntimeException("Access Token is null");
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uriBuilder.toString(), HttpMethod.GET,
                entity, LinkedHashMap.class);
        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
        LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");

        return kakaoAccount.get("email");

    }

    // 비밀번호 임의생성하는 매소드
    private String makeTempPassword() {
        StringBuffer stringBuffer = new StringBuffer();
        for (int i = 0; i < 10; i++) {
            stringBuffer.append((char) ((int) (Math.random() * 55) + 65));
        }
        return stringBuffer.toString();
    }

    private MemberEntity makeSocialMember(String email) {
        String tempPassword = makeTempPassword();
        String nickname = "소셜회원";

        MemberEntity memberEntity = MemberEntity.builder()
                .email(email)
                .pw(passwordEncoder.encode(tempPassword))
                .nickname(nickname)
                .social(true)
                .build();

        memberEntity.addRole(Role.USER);

        return memberEntity;
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
        // 소셜 로그인, 이메일은 수정할 수 없으므로 업데이트하지 않음

        // **권한 업데이트 추가**
        if (memberDto.getRoleNames() != null && !memberDto.getRoleNames().isEmpty()) {
            // 전달된 roleNames를 Role enum 타입으로 변환 후 업데이트
            List<Role> roles = memberDto.getRoleNames().stream()
                    .map(roleName -> Role.valueOf(roleName))
                    .collect(Collectors.toList());
            memberEntity.setMemberRoleList(roles);
        }

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