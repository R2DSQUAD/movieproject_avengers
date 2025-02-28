package org.spring.moviepj.controller.admin;

import java.util.List;

import org.spring.moviepj.dto.MemberDto;
import org.spring.moviepj.service.impl.MemberServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/members")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMemberController {

    private final MemberServiceImpl memberService;

    // 모든 회원 조회
    @GetMapping
    public ResponseEntity<List<MemberDto>> getAllMembers() {
        List<MemberDto> members = memberService.memberList();
        return ResponseEntity.ok(members);
    }

    // 신규 회원 생성 필요 없는 로직.
    // @PostMapping
    // public ResponseEntity<MemberDto> createMember(@RequestBody MemberDto
    // memberDto) {
    // memberService.insertMember(memberDto);
    // MemberDto createdMember = memberService.memberDetail(memberDto.getEmail());
    // return ResponseEntity.status(HttpStatus.CREATED).body(createdMember);
    // }

    // 회원 정보 수정 (이메일을 기준으로 업데이트)
    @PutMapping("/{email}")
    public ResponseEntity<MemberDto> updateMember(@PathVariable String email, @RequestBody MemberDto memberDto) {
        MemberDto updatedMember = memberService.updateMember(email, memberDto);
        return ResponseEntity.ok(updatedMember);
    }

    // 회원 삭제
    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteMember(@PathVariable String email) {
        memberService.deleteMember(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MemberDto>> searchMembers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String nickname) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        Page<MemberDto> result = memberService.searchMembers(email, nickname, pageable);
        return ResponseEntity.ok(result);
    }
}
