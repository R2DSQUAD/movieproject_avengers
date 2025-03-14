package org.spring.moviepj.dto;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.entity.BoardEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.ReplyEntity;
import org.spring.moviepj.entity.ReplyLikeEntity;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReplyDto extends BasicTime {

    private Long id;

    private String nickname;

    private String replyContent;
    private MemberEntity memberEntity;
    private String email;


    private Long boardId;

    private BoardEntity boardEntity;
    private LocalDateTime createTime;
        private List<ReplyLikeDto> replyLikeEntities;
    private int likeCount;
    private  LocalDateTime updateTime;

  public static ReplyDto toReplyDto(ReplyEntity replyEntity) {
    ReplyDto replyDto = new ReplyDto();
    replyDto.setReplyContent(replyEntity.getReplyContent());
    replyDto.setEmail(replyEntity.getMemberEntity().getEmail());
    replyDto.setId(replyEntity.getId());
    replyDto.setBoardId(replyEntity.getBoardEntity().getId());
    replyDto.setCreateTime(replyEntity.getCreateTime());
    replyDto.setUpdateTime(replyEntity.getUpdateTime() != null ? replyEntity.getUpdateTime() : null);
    replyDto.setLikeCount(replyEntity.getReplyLikeEntities().size());
    replyDto.setNickname(replyEntity.getMemberEntity().getNickname());
    // ReplyLikeEntity 리스트에서 필요한 정보만 추출
    List<ReplyLikeDto> replyLikeDtos = replyEntity.getReplyLikeEntities().stream()
            .map(replyLikeEntity -> {
                ReplyLikeDto replyLikeDto = new ReplyLikeDto();
                replyLikeDto.setId(replyLikeEntity.getId());
                replyLikeDto.setEmail(replyLikeEntity.getMemberEntity().getEmail()); // 좋아요를 누른 사람 이메일
                replyLikeDto.setReplyId(replyLikeEntity.getReplyEntity().getId()); // 댓글 ID
                return replyLikeDto;
            })
            .collect(Collectors.toList());

    replyDto.setReplyLikeEntities(replyLikeDtos);

    return replyDto;
}



}
