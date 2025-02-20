// package org.spring.moviepj.config;

// import lombok.RequiredArgsConstructor;

// import org.spring.moviepj.entity.MemberEntity;
// import org.spring.moviepj.repository.MemberRepository;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import
// org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import java.util.Optional;

// @Service
// @RequiredArgsConstructor
// public class MyUserDetailsService implements UserDetailsService {

// private final MemberRepository memberRepository;
// @Override
// public UserDetails loadUserByUsername(String userEmail) throws
// UsernameNotFoundException {

// Optional<MemberEntity> optionalMemberEntity=
// memberRepository.findByUserEmail(userEmail);

// if(!optionalMemberEntity.isPresent()){
// throw new UsernameNotFoundException("이메일이 존재 하지 않습니다.");
// }
// //Security -> 자동 정보관리
// return new MyUserDetails(optionalMemberEntity.get());
// }
// }
