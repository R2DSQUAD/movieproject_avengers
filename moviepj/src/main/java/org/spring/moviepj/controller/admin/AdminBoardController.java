package org.spring.moviepj.controller.admin;

import java.io.IOException;
import java.util.List;

import org.spring.moviepj.dto.BoardDto;
import org.spring.moviepj.entity.CinemaEntity;
import org.spring.moviepj.service.impl.AdminCinemaServiceImpl;
import org.spring.moviepj.service.impl.BoardServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBoardController {

    private final BoardServiceImpl boardService;


    @PostMapping("/board/update")
    public ResponseEntity<String> updateOk(
            @RequestParam("title") String title,
            @RequestParam("id") Long id,
            @RequestParam("content") String content,
            @RequestParam("email") String email,
            @RequestParam("category") String category,
            @RequestParam(value = "itemFile", required = false) MultipartFile itemFile) throws IOException {
                
                System.out.println(itemFile);
        // BoardDto 생성
        BoardDto boardDto = new BoardDto().builder()
                .id(id)
                .title(title)
                .content(content)
                .email(email)
                .category(category)
                .itemFile(itemFile)  // itemFile이 null일 수 있음
                .build();
    
        // 서비스 메소드 호출
        boardService.boardUpdate(boardDto);

        
        int replyCount=boardService.replyCount(boardDto.getId());
        boardDto.setReplyCount(replyCount);
        
          // 댓글 수를 업데이트
          boardService.updateBoardReplyCount(boardDto);

    
        return ResponseEntity.ok("게시글이 성공적으로 수정되었습니다.");
    }

    @DeleteMapping("/board/delete/{id}")
    public void deleteCinema(@PathVariable Long id) {
        boardService.boardDelete(id);
    }

   
}
