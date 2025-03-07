package org.spring.moviepj.controller.admin;

import java.util.List;
import org.spring.moviepj.config.ws.entity.HelpMessageEntity;
import org.spring.moviepj.config.ws.repository.HelpMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/helpMessage")
public class HelpMessageController {

    private final HelpMessageRepository helpMessageRepository;

    // 전체 도움말 조회
    @GetMapping
    public List<HelpMessageEntity> getHelpMessages() {
        return helpMessageRepository.findAll();
    }

    // 도움말 추가
    @PostMapping
    public HelpMessageEntity createHelpMessage(@RequestBody HelpMessageEntity helpMessage) {
        return helpMessageRepository.save(helpMessage);
    }

    // 도움말 수정
    @PutMapping("/{id}")
    public ResponseEntity<HelpMessageEntity> updateHelpMessage(
            @PathVariable Long id, @RequestBody HelpMessageEntity updatedMessage) {
        return helpMessageRepository.findById(id)
                .map(existingMessage -> {
                    existingMessage.setMessage(updatedMessage.getMessage());
                    HelpMessageEntity saved = helpMessageRepository.save(existingMessage);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 도움말 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHelpMessage(@PathVariable Long id) {
        return helpMessageRepository.findById(id)
                .map(existingMessage -> {
                    helpMessageRepository.delete(existingMessage);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
