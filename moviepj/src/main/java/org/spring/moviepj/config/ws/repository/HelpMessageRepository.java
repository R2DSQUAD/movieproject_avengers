package org.spring.moviepj.config.ws.repository;

import java.util.List;

import org.spring.moviepj.config.ws.entity.AnswerEntity;
import org.spring.moviepj.config.ws.entity.HelpMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelpMessageRepository extends JpaRepository<HelpMessageEntity, Long> {

  List<HelpMessageEntity> findAllByMessageIn(List<String> messages);
}
