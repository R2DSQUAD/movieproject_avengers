package org.spring.moviepj.repository;

import org.spring.moviepj.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity,Long> {
    @Modifying
    @Query(value = " update BoardEntity b set b.hit=b.hit+1 where b.id=:id")
    void updateHit(@Param("id")Long id);

    @Query(value= " select count(*) " +
    " from board_tb b inner join reply_tb r " +
    " on b.board_id=r.board_id " +
    " where b.board_id=:id " ,nativeQuery = true)
    int boardReplyCount(@Param("id") Long id);
//    Optional<ItemImgEntity> findByItemEntity(ItemEntity itemEntity);
}
