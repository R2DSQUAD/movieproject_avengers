package org.spring.moviepj.repository;

import org.spring.moviepj.entity.ScreeningSeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreeningSeatRepository extends JpaRepository<ScreeningSeatEntity, Long> {

}
