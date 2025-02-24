package org.spring.moviepj.repository;

import org.spring.moviepj.entity.CalendarEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarRepository extends JpaRepository<CalendarEntity, Integer> {

}
