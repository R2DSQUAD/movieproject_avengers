package org.spring.moviepj.entity;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.dto.BoardImgDto;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "boardImg_tb")
public class BoardImgEntity extends BasicTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "boardImg_id")
    private Long id;

    @Column(nullable = false)
    private String oldImgName; // 원본 이미지 이름

    @Column(nullable = false)
    private String newImgName;//새 이미지 이름 -> 암호화

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private BoardEntity boardEntity;

    public static BoardImgEntity toBoardImgEntity(BoardImgDto boardImgDto) {
        BoardImgEntity boardImgEntity= new BoardImgEntity();

        boardImgEntity.setNewImgName(boardImgDto.getNewImgName());
        boardImgEntity.setOldImgName(boardImgDto.getOldImgName());
        boardImgEntity.setBoardEntity(boardImgDto.getBoardEntity());

        return boardImgEntity;
    }
   
}
