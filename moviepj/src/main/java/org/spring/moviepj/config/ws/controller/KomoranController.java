package org.spring.moviepj.config.ws.controller;

import org.spring.moviepj.config.ws.dto.MessageDto;
import org.spring.moviepj.config.ws.service.KomoranService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KomoranController {

  @Autowired
  private KomoranService komoranService;

  @PostMapping("/botController")
  public ResponseEntity<?> message(@RequestParam("message")String message, Model model) throws Exception {

    MessageDto messageDto= komoranService.nlpAnalyze(message);
    System.out.println("messageDto  11111"+messageDto);
    return ResponseEntity.ok(messageDto); // ajax -> String 반환 bot-message.html
  }
}
