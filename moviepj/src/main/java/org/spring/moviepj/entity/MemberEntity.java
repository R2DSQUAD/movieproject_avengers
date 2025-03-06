package org.spring.moviepj.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.spring.moviepj.common.BasicTime;
import org.spring.moviepj.common.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "member_tb")
public class MemberEntity extends BasicTime {

    @Id
    private String email;

    private String pw;

    private String nickname;

    private boolean social; // 소셜 로그인시 필요

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<Role> memberRoleList = new ArrayList<>();

    @OneToMany(mappedBy = "memberEntity", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<CartEntity> cartEntities;

    @OneToMany(mappedBy = "memberEntity", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<PaymentEntity> paymentEntities;

    // 비즈니스 매서드==========================
    public void addRole(Role role) {
        memberRoleList.add(role);
    }

    public void clearRole() {
        memberRoleList.clear();
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePw(String pw) {
        this.pw = pw;
    }

    public void changeSocial(boolean social) {
        this.social = social;
    }

    @OneToMany(mappedBy = "memberEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CalendarEntity> calendarEntities;

    @OneToMany(mappedBy = "memberEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BoardEntity> boardEntities;

}
