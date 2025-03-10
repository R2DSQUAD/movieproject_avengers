package org.spring.moviepj.repository;

import org.spring.moviepj.entity.BoardEntity;
import org.spring.moviepj.entity.ReplyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<ReplyEntity,Long> {

    //게시글 번호에 작성된 덧글 리스트를 조회
    List<ReplyEntity> findAllByBoardEntity(BoardEntity boardEntity);
}
