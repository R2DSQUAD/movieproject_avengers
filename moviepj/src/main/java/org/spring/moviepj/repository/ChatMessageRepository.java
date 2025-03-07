package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

}
