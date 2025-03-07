package org.spring.moviepj.dto;

import lombok.*;


import java.time.LocalDateTime;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.entity.BoardEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardImgDto extends BasicTime {
    private Long id;

    private String oldImgName; // 원본 이미지 이름

    private String newImgName;//새 이미지 이름 -> 암호화

    private BoardEntity boardEntity;

    private LocalDateTime createTime;

    private  LocalDateTime updateTime;

    private Long itemId;
}
