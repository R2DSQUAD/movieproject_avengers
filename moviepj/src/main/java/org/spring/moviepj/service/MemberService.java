package org.spring.moviepj.service;

import java.util.List;
import java.util.Map;

import org.spring.moviepj.dto.MemberDto;
import org.springframework.validation.BindingResult;

public interface MemberService {

    void insertMember(MemberDto memberDto);

    MemberDto memberDetail(String email);

    List<MemberDto> memberList();
}