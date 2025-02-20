package org.spring.moviepj.service;

import org.spring.moviepj.dto.MemberDto;

public interface MemberService {

    void memberInsert(MemberDto memberDto);

    MemberDto loginUser(String username);

}
