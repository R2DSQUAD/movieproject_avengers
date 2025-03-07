package org.spring.moviepj.service.impl;

import java.util.List;

import org.spring.moviepj.entity.ChatMessageEntity;
import org.spring.moviepj.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl {

    private final ChatMessageRepository messageRepository;

    public List<ChatMessageEntity> getAllMessages() {
        return messageRepository.findAll();
    }
}
