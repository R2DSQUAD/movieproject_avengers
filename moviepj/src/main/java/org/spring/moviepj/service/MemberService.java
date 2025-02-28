package org.spring.moviepj.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.entity.MemberEntity;

public interface MemberService {

    void insertMember(MemberDto memberDto);

    MemberDto memberDetail(String email);

    List<MemberDto> memberList();

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