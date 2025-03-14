package org.spring.moviepj.entity;

import org.spring.moviepj.common.BasicTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chat_message_tb")
public class ChatMessageEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 메시지 ID

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_email") // email을 외래키로 설정
    private MemberEntity memberEntity; // MemberEntity와의 관계

    @Column(nullable = false)
    private String content; // 메시지 내용

    @Column(nullable = false)
    private String nickname; // 메시지를 보낸 회원의 닉네임 추가

    // 생성자와 메서드를 추가할 수 있습니다.
}
