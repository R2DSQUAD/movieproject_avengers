package org.spring.moviepj.repository;


import org.spring.moviepj.entity.BoardEntity;
import org.spring.moviepj.entity.BoardImgEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardImgRepository extends JpaRepository<BoardImgEntity,Long> {

    Optional<BoardImgEntity> findByBoardEntity(BoardEntity build);
}
