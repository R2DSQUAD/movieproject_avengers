package org.spring.moviepj.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.spring.moviepj.common.Role;
import org.spring.moviepj.entity.CartEntity;
import org.spring.moviepj.entity.ChatMessageEntity;
import org.spring.moviepj.entity.MemberEntity;
import org.spring.moviepj.entity.PaymentEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MemberDto extends User {

    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$", message = "이메일 형식에 맞게 입력해주세요.")
    private String email; // 이메일

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$", message = "비밀번호는 영문, 숫자를 포함한 8~20자로 입력해주세요.")
    private String pw; // 비밀번호

    @NotBlank(message = "이름은 필수 입력 값입니다.")
    @Pattern(regexp = "^[a-zA-Z가-힣0-9]{2,10}$", message = "이름은 한글, 영문, 숫자를 포함한 2~10자로 입력해주세요.")
    private String nickname; // 이름

    private boolean social; // 소셜로그인 여부

    private List<String> roleNames = new ArrayList<>(); // 권한 목록

    private Long cartId; // 장바구니
    private List<CartEntity> cartEntities; // 장바구니 목록

    private Long paymentId; // 결제
    private List<PaymentEntity> paymentEntities; // 결제 목록
    private List<ChatMessageEntity> chatMessageEntities;
    private LocalDateTime createTime; // 생성시간

    private LocalDateTime updateTime; // 수정시간

    // 나중에 정보더 추가할 예정

    public MemberDto() {
        super("default", "default", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    public MemberDto(String email, String pw, String nickname, boolean social, List<String> roleNames) {
        super(
                email,
                pw,
                roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList()));

        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.social = social;
        this.roleNames = roleNames;
    }

    public MemberDto(List<ChatMessageEntity> chatMessageEntities2, String email2, String pw2, String nickname2, boolean social2,
    List<String> list) {
        super(
            email2,
            pw2,
            list.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList()));

    this.email = email2;
    this.pw = pw2;
    this.nickname = nickname2;
    this.social = social2;
    this.roleNames = list;
    this.chatMessageEntities=chatMessageEntities2;
}

    // 현재 사용자의 정보-> JWT 생성시 사용(Claims)
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("email", email);
        dataMap.put("pw", pw);
        dataMap.put("nickname", nickname);
        dataMap.put("social", social);
        dataMap.put("roleNames", roleNames);

        return dataMap;
    }

}
