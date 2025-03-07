package org.spring.moviepj.controller;

import lombok.RequiredArgsConstructor;

import org.spring.moviepj.dto.BoardDto;
import org.spring.moviepj.service.impl.BoardServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardServiceImpl boardService;
    // 아이템 추가
    // @PostMapping("/insert")
    // public ResponseEntity<String> insertOk(@RequestBody BoardDto boardDto) throws IOException {
    //     boardService.boardInsert(boardDto);
    //     return ResponseEntity.ok("아이템이 성공적으로 추가되었습니다.");
    // }

    @PostMapping("/insert")
    public ResponseEntity<String> insertOk(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("email") String email,
            @RequestParam("category") String category,
            @RequestParam(value = "itemFile", required = false) MultipartFile itemFile) throws IOException {
                
                System.out.println(itemFile);
        // BoardDto 생성
        BoardDto boardDto = new BoardDto().builder()
                .title(title)
                .content(content)
                .email(email)
                .category(category)
                .itemFile(itemFile)  // itemFile이 null일 수 있음
                .build();
    
        // 서비스 메소드 호출
        boardService.boardInsert(boardDto);
    
        return ResponseEntity.ok("게시글이 성공적으로 추가되었습니다.");
    }
    


    // 아이템 목록 조회
    @GetMapping("/List")
    public ResponseEntity<List<BoardDto>> itemList(){
        List<BoardDto> boardDtos = boardService.boardList();
        return ResponseEntity.ok(boardDtos);
    }

    // 아이템 상세 조회
    @GetMapping("/detail/{id}")
    public ResponseEntity<BoardDto> detail(@PathVariable("id") Long id){
        BoardDto boardDto = boardService.detail(id);
        return ResponseEntity.ok(boardDto);
    }

    @GetMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id){
        boardService.boardDelete(id);
        return ResponseEntity.ok("게시글이 성공적으로 삭제되었습니다.");
    }

    // 아이템 수정
    @PostMapping("/update")
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
    
        return ResponseEntity.ok("게시글이 성공적으로 수정되었습니다.");
    }
    
   
}
