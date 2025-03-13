package org.spring.moviepj.service.impl;

import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.ReplyEntity;
import org.spring.moviepj.entity.ReplyLikeEntity;
import org.spring.moviepj.repository.MemberRepository;
import org.spring.moviepj.repository.ReplyLikeRepository;
import org.spring.moviepj.repository.ReplyRepository;
import org.spring.moviepj.service.ReplyLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReplyLikeServiceImpl implements ReplyLikeService {

    
    private final ReplyLikeRepository replyLikeRepository;

   
    private final ReplyRepository replyRepository;  // 댓글 엔티티의 repository
   
    private final MemberRepository memberRepository;    // 사용자 엔티티의 repository

    // 좋아요 추가
    public void addLike(Long replyId, String email) {
        // 이미 좋아요를 눌렀는지 확인
        if (replyLikeRepository.existsByReplyEntity_IdAndMemberEntity_Email(replyId, email)) {
            throw new RuntimeException("이미 좋아요를 눌렀습니다.");
        }

        // 좋아요 추가
        ReplyEntity reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));
        MemberEntity member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        ReplyLikeEntity replyLikeEntity = new ReplyLikeEntity(reply, member);
        replyLikeRepository.save(replyLikeEntity);
    }

    // 좋아요 취소
    public void removeLike(Long replyId, String email) {
        // 좋아요 취소
        if (!replyLikeRepository.existsByReplyEntity_IdAndMemberEntity_Email(replyId, email)) {
            throw new RuntimeException("좋아요를 취소할 수 없습니다.");
        }

        replyLikeRepository.deleteByReplyEntity_IdAndMemberEntity_Email(replyId, email);
    }

    public int getLikeCount(Long replyId) {
        return replyLikeRepository.countByReplyEntity_Id(replyId);
    }
}