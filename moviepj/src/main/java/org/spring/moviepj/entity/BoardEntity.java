package org.spring.moviepj.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.dto.BoardDto;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "board_tb")
public class BoardEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "board_id")
    private Long id;

    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    private int hit;

    @Column(nullable = false)
    private int attachFile;

    private String oldImgName; // 원본 이미지 이름

    private String newImgName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_email")
    @JsonIgnore
    private MemberEntity memberEntity;

//    private MultipartFile itemFile;

    @OneToMany(mappedBy = "boardEntity" ,fetch = FetchType.LAZY
            ,cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<BoardImgEntity> boardImgEntities;

    public static BoardEntity toInsertBoardEntity(BoardDto boardDto){
        BoardEntity boardEntity= new BoardEntity();
        boardEntity.setTitle(boardDto.getTitle());
        boardEntity.setCategory(boardDto.getCategory());
        boardEntity.setContent(boardDto.getContent());
        boardEntity.setAttachFile(0);
        boardEntity.setHit(0);
        // itemEntity.setMemberEntity(MemberEntity.builder().id(boardDto.getMemberId()).build());
        boardEntity.setMemberEntity(MemberEntity.builder().email(boardDto.getEmail()).build());


        return boardEntity;
    }
    public static BoardEntity toUpdateFileBoardEntity(BoardDto boardDto){
        BoardEntity boardEntity= new BoardEntity();
        boardEntity.setTitle(boardDto.getTitle());
        boardEntity.setCategory(boardDto.getCategory());
        boardEntity.setContent(boardDto.getContent());
        boardEntity.setId(boardDto.getId());
        boardEntity.setMemberEntity(MemberEntity.builder().email(boardDto.getEmail()).build());
        boardEntity.setAttachFile(1);
        boardEntity.setHit(boardDto.getHit());
        return boardEntity;
    }

    public static BoardEntity toFileInsertBoardEntity(BoardDto boardDto) {
        BoardEntity boardEntity= new BoardEntity();
        boardEntity.setTitle(boardDto.getTitle());
        boardEntity.setCategory(boardDto.getCategory());
        boardEntity.setContent(boardDto.getContent());
        boardEntity.setAttachFile(1);
        boardEntity.setHit(0);
        boardEntity.setMemberEntity(MemberEntity.builder().email(boardDto.getEmail()).build());
        return boardEntity;
    }
    public static BoardEntity toUpdateBoardEntity(BoardDto boardDto) {
        BoardEntity boardEntity=new BoardEntity();
        boardEntity.setId(boardDto.getId());
        boardEntity.setTitle(boardDto.getTitle());
        boardEntity.setContent(boardDto.getContent());
        boardEntity.setCategory(boardDto.getCategory());
        boardEntity.setMemberEntity(MemberEntity.builder()
            .email(boardDto.getEmail()).build());
            boardEntity.setHit(boardDto.getHit());
            boardEntity.setAttachFile(0); //파일 없다 0
    
        return boardEntity;
      }
    
}
