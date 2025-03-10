package org.spring.moviepj.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.spring.moviepj.dto.BoardDto;
import org.spring.moviepj.dto.MovieDto;
import org.spring.moviepj.dto.MovieReviewDto;
import org.spring.moviepj.dto.ReplyDto;
import org.spring.moviepj.service.MovieService;
import org.spring.moviepj.service.impl.BoardServiceImpl;
import org.spring.moviepj.service.impl.MovieReviewServiceImpl;
import org.spring.moviepj.service.impl.MovieServiceImpl;
import org.spring.moviepj.service.impl.ReplyServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class MovieReviewController {
     private final MovieReviewServiceImpl movieReviewServiceImpl;

        @PostMapping("/review/write")
        public ResponseEntity<Map<String, Object>> write(@RequestBody MovieReviewDto movieReviewDto){

        Map<String,Object> map=new HashMap<>();
        movieReviewServiceImpl.insertMovieReview(movieReviewDto);

        System.out.println(movieReviewDto);
   

          map.put("message", "리뷰 작성 완료");
       
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

        @GetMapping("/review/reviewList/{id}")
    public ResponseEntity<Map<String, Object>> reviewList(@PathVariable("id") Long id){
        Map<String,Object> map=new HashMap<>();
        System.out.println("@@@@@@@@@@@@@@@@@@@@"+ id);
        List<MovieReviewDto> reviewDtos=movieReviewServiceImpl.movieReviewList(id);
        map.put("reviewDtos",reviewDtos);
        return new ResponseEntity<>(map, HttpStatus.OK);

    }

    @PostMapping("/reply/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id){
        movieReviewServiceImpl.movieReviewDelete(id);
        return ResponseEntity.ok("댓글이 성공적으로 삭제되었습니다.");
    }

}
