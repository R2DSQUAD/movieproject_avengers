package org.spring.moviepj.service;

import java.util.List;
import java.util.Map;

import org.spring.moviepj.dto.MemberDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.BindingResult;

public interface MemberService {

    void insertMember(MemberDto memberDto);

    MemberDto memberDetail(String email);

    List<MemberDto> memberList();

    MemberDto updateMember(String email, MemberDto memberDto);

    void deleteMember(String email);

    Page<MemberDto> searchMembers(String email, String nickname, Pageable pageable);
}