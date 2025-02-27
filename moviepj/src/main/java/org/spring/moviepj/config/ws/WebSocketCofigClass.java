package org.spring.moviepj.config.ws;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
@ServerEndpoint("/chat")
public class WebSocketCofigClass {

    // 접속자 정보를 저장 (세션별로 닉네임을 매핑)
    private static Map<Session, String> clientInfo = Collections.synchronizedMap(new HashMap<>());

    // 접속 시
    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Session Start -> " + session.toString());
    }

    // 메시지 수신 시
    @OnMessage
public void onMessage(String message, Session session) throws Exception {
    // 메시지가 닉네임 설정 요청인지 확인
    if (message.startsWith("nickname:")) {
        String nickname = message.substring("nickname:".length()).trim();
        clientInfo.put(session, nickname);  // 닉네임 저장
        System.out.println("닉네임 설정됨: " + nickname);
    } else {
        // 닉네임이 설정된 상태에서만 메시지 전달
        String senderNickname = clientInfo.get(session);
        if (senderNickname == null) {
            senderNickname = "익명"; // 닉네임이 없는 경우 기본 값 설정
        }

        // 받은 메시지를 모든 클라이언트에 전달
        for (Session clientSession : clientInfo.keySet()) {
            if (clientSession.isOpen()) {
                String formattedMessage =  message; // 닉네임 포함
                clientSession.getBasicRemote().sendText(formattedMessage);
            }
        }
    }
}


    // 접속 종료 시
    @OnClose
    public void onClose(Session session) {
        System.out.println("Session Close -> " + session);
        clientInfo.remove(session);  // 세션 종료 시, 닉네임도 제거
    }

    // 에러 발생 시
    @OnError
    public void onError(Throwable throwable) {
        System.out.println("Session Error !! : ");
        throwable.printStackTrace();
    }
}
