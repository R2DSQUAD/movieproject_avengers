package org.spring.moviepj.config.ws;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //서버에서 -> 클라이언트
    registry.enableSimpleBroker("/topic");
    //클라이언트 -> 서버
    registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //서버 엔드포인트
       registry.addEndpoint("/chatEndpoint")
       .setAllowedOrigins("http://localhost:3000")
       .withSockJS();
    }
}


