package org.spring.moviepj.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.spring.moviepj.dto.BoardDto;
import org.spring.moviepj.dto.ReplyDto;
import org.spring.moviepj.service.impl.BoardServiceImpl;
import org.spring.moviepj.service.impl.ReplyServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReplyController {
     private final ReplyServiceImpl replyService;
    private final BoardServiceImpl boardService;
        @PreAuthorize("isAuthenticated()")
        @PostMapping("/reply/write")
        public ResponseEntity<Map<String, Object>> write(@RequestBody ReplyDto replyDto){

        Map<String,Object> map=new HashMap<>();
        replyService.insertReply(replyDto);

        System.out.println(replyDto);
        BoardDto boardDto=boardService.detail(replyDto.getBoardId());
        System.out.println(boardDto.getId());

        int replyCount=boardService.replyCount(boardDto.getId());
        boardDto.setReplyCount(replyCount);
        
          // 댓글 수를 업데이트
          boardService.updateBoardReplyCount(boardDto);

          map.put("message", "댓글 작성 완료");
       
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

        @GetMapping("/reply/replyList/{id}")
    public ResponseEntity<Map<String, Object>> replyList(@PathVariable("id") Long id){
        Map<String,Object> map=new HashMap<>();
        System.out.println("@@@@@@@@@@@@@@@@@@@@"+ id);
        List<ReplyDto> replylisst=replyService.replyList(id);
        map.put("replyList",replylisst);

        return new ResponseEntity<>(map, HttpStatus.OK);

    }
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/reply/delete/{id}/{boardId}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id, @PathVariable("boardId")Long boardId){
        
        replyService.replyDelete(id);
        BoardDto boardDto=boardService.detail(boardId);
        int replyCount=boardService.replyCount(boardDto.getId());

        boardDto.setReplyCount(replyCount);

        boardService.updateBoardReplyCount(boardDto);


        return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
    }

}
