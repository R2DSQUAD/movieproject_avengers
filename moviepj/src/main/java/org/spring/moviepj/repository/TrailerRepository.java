package org.spring.moviepj.repository;

import java.util.List;

import org.spring.moviepj.entity.TrailerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TrailerRepository extends JpaRepository<TrailerEntity, Long> {

    @Query("SELECT t FROM TrailerEntity t WHERE FUNCTION('DATE', t.movieEntity.createTime) = (SELECT FUNCTION('DATE', MAX(m.createTime)) FROM MovieEntity m) ORDER BY t.movieEntity.rank ASC")
    List<TrailerEntity> findLatestMovieTrailers();

}
