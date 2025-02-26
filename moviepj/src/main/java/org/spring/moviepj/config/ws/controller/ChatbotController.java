package org.spring.moviepj.config.ws.controller;

import lombok.RequiredArgsConstructor;

import org.spring.moviepj.config.ws.entity.BotMessage;
import org.spring.moviepj.config.ws.entity.ClientMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequiredArgsConstructor
public class ChatbotController {

    // 기본 실행
    @MessageMapping("/hello") // /app/hello
    @SendTo("/topic/greetings")
    public ResponseEntity<BotMessage> greeting(ClientMessage message) throws Exception {
        // 처음 접속 했을 때 -> 서버에서 클라이언트로 메시지 보내기
        
        Thread.sleep(50);
        LocalDateTime today = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
        String formatterDay = today.format(formatter);
        String formattedTime = today.format(DateTimeFormatter.ofPattern("a H:mm"));

        String firstMessage =  message.getContent()+"님 " +  "안녕하세요, 챗봇입니다. " +
                "궁금한 점은 저에게 물어보세요 " +
                 formatterDay + " " + formattedTime ;

        BotMessage botMessage = new BotMessage(firstMessage);

        // ResponseEntity로 응답 반환
        return ResponseEntity.ok(botMessage);
    }

    @MessageMapping("/message") // /app/message
    @SendTo("/topic/message")
    public ResponseEntity<BotMessage> message(ClientMessage message) throws Exception {
        Thread.sleep(50);
        LocalDateTime today = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
        String formatterDay = today.format(formatter);
        String formattedTime = today.format(DateTimeFormatter.ofPattern("a H:mm"));

        String responseText = message.getContent() + "에 대한 응답입니다.";

        String firstMessage =  responseText +  formatterDay + " " + formattedTime ;

        BotMessage botMessage = new BotMessage(firstMessage);

        // ResponseEntity로 응답 반환
        return ResponseEntity.ok(botMessage);
    }
}
