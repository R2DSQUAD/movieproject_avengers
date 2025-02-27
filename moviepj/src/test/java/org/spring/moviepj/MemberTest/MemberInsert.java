package org.spring.moviepj.MemberTest;

import org.junit.jupiter.api.Test;
import org.spring.moviepj.common.Role;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class MemberInsert {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void insertMember() {

        MemberEntity memberEntity = MemberEntity.builder()
                .email("a1@email.com")
                .pw(passwordEncoder.encode("qwer1234"))
                .nickname("AdminUser")
                .build();

        memberEntity.addRole(Role.ADMIN);

        memberRepository.save(memberEntity);

    }

}
