package org.spring.moviepj.repository;

import java.util.Optional;

import org.spring.moviepj.entity.CalendarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarRepository extends JpaRepository<CalendarEntity, Long> {

    void deleteById(Long eventId);

    boolean existsById(Long eventId);

    Optional<CalendarEntity> findById(Long id);

}
