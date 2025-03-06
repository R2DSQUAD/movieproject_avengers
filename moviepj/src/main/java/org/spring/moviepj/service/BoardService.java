package org.spring.moviepj.service;



import java.io.IOException;
import java.util.List;

import org.spring.moviepj.dto.BoardDto;

public interface BoardService {
    void boardInsert(BoardDto itemDto) throws IOException;

    List<BoardDto> boardList();

    BoardDto detail(Long id);

    void boardUpdate(BoardDto itemDto) throws IOException;

    void updateHit(Long id);

    void boardDelete(Long id);

}
