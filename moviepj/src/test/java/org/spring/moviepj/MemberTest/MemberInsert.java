package org.spring.moviepj.MemberTest;

import org.junit.jupiter.api.Test;
import org.spring.moviepj.common.Role;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@SpringBootTest
@ActiveProfiles("test")
public class MemberInsert {

    // WebSocket 관련 빈을 Mock 처리하여 테스트 실행 시 로드되지 않도록 함
    @MockBean
    private SimpMessagingTemplate simpMessagingTemplate;

    @MockBean
    private ServerEndpointExporter serverEndpointExporter;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @Transactional
    @Rollback(false) // 자동 롤백 방지
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