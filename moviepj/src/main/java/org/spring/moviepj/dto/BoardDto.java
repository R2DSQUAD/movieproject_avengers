package org.spring.moviepj.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.entity.BoardEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardDto extends BasicTime {

    private Long id;
   
    private String category;
    @NotBlank(message = "제목을 입력하세요")
    private String title;

    private int hit;

    private int attachFile;

    private LocalDateTime createTime;

    private  LocalDateTime updateTime;
    private String email;

   
    @NotBlank(message = "내용을 입력하세요")
    private String content;
    private MemberEntity memberEntity;


    private MultipartFile itemFile;

    private String oldImgName; // 원본 이미지 이름

    private String newImgName;

    public static BoardDto toBoardDto(BoardEntity boardEntity){
        BoardDto boardDto=new BoardDto();
        boardDto.setId(boardEntity.getId());
        boardDto.setHit(boardEntity.getHit());
        boardDto.setContent(boardEntity.getContent());
        boardDto.setCategory(boardEntity.getCategory());
        boardDto.setTitle(boardEntity.getTitle());
        boardDto.setAttachFile(boardEntity.getAttachFile());
        boardDto.setEmail(boardEntity.getMemberEntity().getEmail());
        //파일이 있을경우
        if(boardEntity.getAttachFile()==1){
            boardDto.setAttachFile(boardEntity.getAttachFile());
            boardDto.setNewImgName(boardEntity.getBoardImgEntities().get(0).getNewImgName());
            boardDto.setOldImgName(boardEntity.getBoardImgEntities().get(0).getOldImgName());
        }else{

            boardDto.setAttachFile(boardEntity.getAttachFile());

        }


        boardDto.setCreateTime(boardEntity.getCreateTime());
        boardDto.setUpdateTime(boardEntity.getUpdateTime());
        return boardDto;
    }
}
