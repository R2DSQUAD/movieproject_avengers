package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.MemberDto;

public interface MemberService {

    void insertMember(MemberDto memberDto);

    MemberDto memberDetail(String email);

    List<MemberDto> memberList();

}