package org.spring.moviepj.repository;

import org.spring.moviepj.entity.TrailerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrailerRepository extends JpaRepository<TrailerEntity, Long> {

}
