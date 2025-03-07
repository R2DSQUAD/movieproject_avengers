package org.spring.moviepj.repository;

import org.spring.moviepj.entity.SearchTrailerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchTrailerRepository extends JpaRepository<SearchTrailerEntity, Long> {

}
