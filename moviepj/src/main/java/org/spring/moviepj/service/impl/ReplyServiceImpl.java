package org.spring.moviepj.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.spring.moviepj.dto.ReplyDto;
import org.spring.moviepj.entity.BoardEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.ReplyEntity;
import org.spring.moviepj.repository.BoardRepository;
import org.spring.moviepj.repository.ReplyRepository;
import org.spring.moviepj.service.ReplyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReplyServiceImpl implements ReplyService {
    private final ReplyRepository replyRepository;
    private final BoardRepository boardRepository;


 

    @Override
    public List<ReplyDto> replyList(Long id) {
        Optional<BoardEntity>optionalBoardEntity= boardRepository.findById(id);
        if(!optionalBoardEntity.isPresent()){
            throw new IllegalArgumentException("아이디 Fail");
        }
        List<ReplyEntity> replyEntities=replyRepository.findAllByBoardEntity(optionalBoardEntity.get());

        System.out.println(replyEntities);
        return replyEntities.stream().map(ReplyDto::toReplyDto).collect(Collectors.toList());
    }

    @Override
    public void insertReply(ReplyDto replyDto) {
        Optional<BoardEntity> optionalBoardEntity=boardRepository.findById(replyDto.getBoardId());
        if(!optionalBoardEntity.isPresent()){
            throw new IllegalArgumentException("아이디 x");
        }
        replyRepository.save(ReplyEntity.builder()
                        .replyContent(replyDto.getReplyContent())
                        .memberEntity(MemberEntity.builder().email(replyDto.getEmail()).build())
                        .boardEntity(BoardEntity.builder()
                                .id(replyDto.getBoardId()).build())
                .build());
    }

    @Override
    public void replyDelete(Long id) {
        Optional<ReplyEntity>optionalReplyEntity=replyRepository.findById(id);
        if(!optionalReplyEntity.isPresent()){
            throw new IllegalArgumentException("삭제할 댓글이 없습니다");
        }
        replyRepository.deleteById(id);
    }

    public ReplyDto getReplyById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getReplyById'");
    }

   
}
