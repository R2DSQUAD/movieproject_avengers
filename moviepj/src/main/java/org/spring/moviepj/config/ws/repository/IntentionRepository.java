package org.spring.moviepj.config.ws.repository;

import org.spring.moviepj.config.ws.entity.IntentionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface IntentionRepository extends JpaRepository<IntentionEntity,Long > {
  Optional<IntentionEntity> findByName(String token);

  Optional<IntentionEntity> findByNameAndUpper(String token, IntentionEntity upper);
}
