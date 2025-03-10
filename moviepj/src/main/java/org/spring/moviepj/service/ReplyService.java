package org.spring.moviepj.service;


import jakarta.validation.Valid;

import java.util.List;

import org.spring.moviepj.dto.ReplyDto;

public interface ReplyService {
    List<ReplyDto> replyList(Long id);
    void insertReply(@Valid ReplyDto replyDto);
    void replyDelete(Long id);

}
