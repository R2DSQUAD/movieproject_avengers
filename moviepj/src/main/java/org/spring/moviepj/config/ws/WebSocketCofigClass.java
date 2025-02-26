package org.spring.moviepj.config.ws;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
@Service
@ServerEndpoint("/chat")
public class WebSocketCofigClass {

  // 접속자 -> session에 저장
  private static Set<Session> clientInfo= Collections.synchronizedSet(new HashSet<>());

  //1 .접속시
  @OnOpen
  public void onOpen(Session session){
    System.out.println("Session Start -> "+session.toString());
    //현재 접속이 되지 않았으면
    if(!clientInfo.contains(session)){
      clientInfo.add(session);//  clientInfo-> session정보를 추가
      System.out.println(" Session open -> "+session);
    }else{
      System.out.println(" Session Pre !! -> 이미 존재!! ");
    }
  }
  // 2. 클라이언트 매시지 -> 수신  -> 답장
  @OnMessage
  public void onMessage(String message,Session session) throws Exception{
    System.out.println(" Receive Message -> "+ message);
    for(Session session1: clientInfo){
      System.out.println(" 전송 메시지 -> "+message);
      // 수신 받은 URL
      session1.getBasicRemote().sendText(message);
    }
  }
  //3. 종료 -> 접속해제
  @OnClose
  public void onClose(Session session){
    System.out.println(" Session Close -> "+session);
    clientInfo.remove(session);
  }

  //4. 에러발생시
  @OnError
  public void onError(Throwable throwable){
    System.out.println(" Session Error !! : ");
    throwable.printStackTrace();
  }
}
