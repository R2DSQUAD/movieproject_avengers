package org.spring.moviepj.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.MemberDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.BindingResult;
import org.spring.moviepj.entity.MemberEntity;

public interface MemberService {

    void insertMember(MemberDto memberDto);

    MemberDto memberDetail(String email);

    List<MemberDto> memberList();

    MemberDto updateMember(String email, MemberDto memberDto);

    void deleteMember(String email);

    Page<MemberDto> searchMembers(String email, String nickname, Pageable pageable);

    MemberDto getKakaoMember(String accessToken);

    default MemberDto entityToDto(MemberEntity memberEntity) {
        MemberDto memberDto = new MemberDto(
                memberEntity.getEmail(),
                memberEntity.getPw(),
                memberEntity.getNickname(),
                memberEntity.isSocial(),
                memberEntity.getMemberRoleList().stream().map(memberRole -> memberRole.name())
                        .collect(Collectors.toList()));

        return memberDto;
    }

}