package org.spring.moviepj.config;

import java.util.Optional;

import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyOnlyUserDetailServiceImpl implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {

        Optional<MemberEntity> optionalMemberEntity = memberRepository.findByUserEmail(userEmail);
        if (!optionalMemberEntity.isPresent()) {
            throw new UsernameNotFoundException("Security 인증 실패!");
        }

        // 인증 성공하면 -> User(시큐리티에서 관리하는 객체) -> 저장 AuthenticationPrincipal
        // return User.builder().username(optionalMemberEntity.get().getUserEmail())
        // .password(optionalMemberEntity.get().getUserPw())
        // .roles(optionalMemberEntity.get().getRole().toString())
        // .build();

        return new MyOnlyUserDetails(optionalMemberEntity.get());

    }

}
