package org.spring.moviepj.controller;

import org.spring.moviepj.entity.ChatMessageEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.repository.ChatMessageRepository;
import org.spring.moviepj.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/chat")
public class MessageController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ChatMessageRepository chatmessageRepository;

    // 메시지 받기 API
    @PostMapping("/messages")
    public ResponseEntity<String> receiveMessage(@RequestBody MessageRequest messageRequest) {
        // email을 통해 MemberEntity 찾기
        MemberEntity member = memberRepository.findByEmail(messageRequest.getSender())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // 메시지 엔티티 생성
        ChatMessageEntity chatmessageEntity = ChatMessageEntity.builder()
                .memberEntity(member) // 외래키로 MemberEntity 설정
                .content(messageRequest.getMessage()) // 메시지 본문
                .nickname(member.getNickname()) // 닉네임 설정 (이메일에 맞는 닉네임)
                .build();

        // 메시지 저장
        chatmessageRepository.save(chatmessageEntity);

        return ResponseEntity.ok("Message received and saved.");
    }

    public static class MessageRequest {
        private String sender;
        private String message;

        // Getters and Setters
        public String getSender() {
            return sender;
        }

        public void setSender(String sender) {
            this.sender = sender;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}

