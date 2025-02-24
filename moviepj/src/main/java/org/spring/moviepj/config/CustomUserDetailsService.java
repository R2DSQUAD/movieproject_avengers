package org.spring.moviepj.config;

import java.util.stream.Collectors;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{

    private final MemberRepository memberRepository;

    @Override //사용자 정보를 조회하고 인증과 권한 처리
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        MemberEntity memberEntity=memberRepository.getWithRoles(username);
        if(memberEntity==null){
            throw new UsernameNotFoundException("Not Found");
        }

        MemberDto memberDto= new MemberDto(
            memberEntity.getEmail(),
            memberEntity.getPw(),
            memberEntity.getNickname(),
            memberEntity.isSocial(),
            memberEntity.getMemberRoleList().stream().map(role->role.name()).collect(Collectors.toList()));

        
        return memberDto;
    }

    


   
    
}
