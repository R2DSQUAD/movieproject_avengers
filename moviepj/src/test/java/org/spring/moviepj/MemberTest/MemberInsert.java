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

        for (int i = 10; i < 11; i++) {
            MemberEntity memberEntity = MemberEntity.builder()
                    .email("user" + i + "@email.com")
                    .pw(passwordEncoder.encode("123456789a"))
                    .nickname("USER" + i)
                    .build();

            memberEntity.addRole(Role.ADMIN);

            memberRepository.save(memberEntity);

        }
    }

    @Test
    public void testRead() {
        String eamil = "user9@email.com";
        MemberEntity memberEntity = memberRepository.getWithRoles(eamil);

    }

}
