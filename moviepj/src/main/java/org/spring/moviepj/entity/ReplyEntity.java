package org.spring.moviepj.entity;

import java.util.List;

import org.spring.moviepj.common.BasicTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "reply_tb")
public class ReplyEntity extends BasicTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    private Long id;

    @Column(nullable = false)
    private String replyContent;
    // ReplyLikeEntity와의 1:N 관계
    
    // N:1 관계 (MemberEntity와의 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_email")
    @JsonIgnore // 'memberEntity'는 직렬화에서 제외
    private MemberEntity memberEntity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    @JsonIgnore // 'boardEntity'는 직렬화에서 제외
    private BoardEntity boardEntity;
    
    @OneToMany(mappedBy = "replyEntity", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ReplyLikeEntity> replyLikeEntities;
}
