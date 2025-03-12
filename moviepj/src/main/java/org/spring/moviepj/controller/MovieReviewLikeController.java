package org.spring.moviepj.controller;

import org.spring.moviepj.service.impl.MovieReviewLikeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
public class MovieReviewLikeController {

    @Autowired
    private MovieReviewLikeServiceImpl movieReviewLikeServiceImpl;

    // 좋아요 추가
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/like")
    public ResponseEntity<?> likeReview(@RequestParam Long movieReviewId, @RequestParam String email) {
        try {
            movieReviewLikeServiceImpl.addLike(movieReviewId, email);
            return ResponseEntity.ok("좋아요가 추가되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 좋아요 취소
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/unlike")
    public ResponseEntity<?> unlikeReview(@RequestParam Long movieReviewId, @RequestParam String email) {
        try {
            movieReviewLikeServiceImpl.removeLike(movieReviewId, email);
            return ResponseEntity.ok("좋아요가 취소되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   
}

