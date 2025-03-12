package org.spring.moviepj.controller;

import org.spring.moviepj.service.impl.ReplyLikeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reply")
public class ReplyLikeController {

    @Autowired
    private ReplyLikeServiceImpl replyLikeServiceImpl;

    // 좋아요 추가
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/like")
    public ResponseEntity<?> likeReply(@RequestParam("replyId") Long replyId, @RequestParam("email") String email) {
        try {
            replyLikeServiceImpl.addLike(replyId, email);
            return ResponseEntity.ok("좋아요가 추가되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 좋아요 취소
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/unlike")
    public ResponseEntity<?> unlikeReply(@RequestParam("replyId") Long replyId, @RequestParam("email") String email) {
        try {
            replyLikeServiceImpl.removeLike(replyId, email);
            return ResponseEntity.ok("좋아요가 취소되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   
}

