package org.spring.moviepj.dto;

import java.time.LocalDateTime;

import org.spring.moviepj.entity.ChatMessageEntity;


public class ChatMessageDto {
     private Long id;
     private LocalDateTime createTime;

    public ChatMessageDto(ChatMessageEntity messageEntity) {
        this.id = messageEntity.getId();
        this.createTime = messageEntity.getCreateTime();
    }
}
