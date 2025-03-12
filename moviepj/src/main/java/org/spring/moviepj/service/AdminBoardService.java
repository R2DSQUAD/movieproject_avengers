package org.spring.moviepj.service;

import org.spring.moviepj.entity.BoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface AdminBoardService {
    BoardEntity createBoard(BoardEntity board);

    Optional<BoardEntity> getBoardById(Long id);

    List<BoardEntity> getAllBoards();

    BoardEntity updateBoard(Long id, BoardEntity board);

    void deleteBoard(Long id);

    Page<BoardEntity> searchBoards(String boardName, String region, Pageable pageable);
}
