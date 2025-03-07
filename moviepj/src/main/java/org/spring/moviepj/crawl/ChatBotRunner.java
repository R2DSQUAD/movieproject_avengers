package org.spring.moviepj.crawl;

import org.spring.moviepj.config.ws.entity.AnswerEntity;
import org.spring.moviepj.config.ws.entity.IntentionEntity;
import org.spring.moviepj.config.ws.service.DefaultKomoranService;
import org.spring.moviepj.config.ws.repository.AnswerRepository;
import org.spring.moviepj.config.ws.repository.HelpMessageRepository;
import org.spring.moviepj.config.ws.repository.IntentionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ChatBotRunner implements CommandLineRunner {

    private final DefaultKomoranService defaultKomoranService;
    private final AnswerRepository answerRepository;
    private final IntentionRepository intentionRepository;
    private final HelpMessageRepository helpMessageRepository;


    @Override
    public void run(String... args) throws Exception {
        System.out.println("ChatBotRunner 실행됨!");

        // 데이터가 없으면 실행하는 메서드를 호출
        executeIfDataIsMissing(answerRepository, "AnswerEntity", () -> defaultKomoranService.insertAnswerJdbc());
        executeIfDataIsMissing(intentionRepository, "IntentionEntity", () -> defaultKomoranService.insertIntentionJdbc());
        executeIfDataIsMissing(helpMessageRepository, "HelpMessageEntity", () -> defaultKomoranService.insertHelpMessageJdbc());
    }

    // 데이터가 없으면 메서드를 실행하는 일반화된 메서드
    private <T> void executeIfDataIsMissing(Object repository, String entityName, Runnable insertMethod) {
        try {
            List<T> data = ((org.springframework.data.jpa.repository.JpaRepository) repository).findAll();
            if (data.isEmpty()) {
                insertMethod.run();
                System.out.println(entityName + " 데이터가 없어 삽입을 실행했습니다.");
            } else {
                System.out.println("이미 " + entityName + " 데이터가 존재하여 삽입을 실행하지 않습니다.");
            }
        } catch (Exception e) {
            System.out.println(entityName + " 실행 중 오류 발생 : " + e.getMessage());
        }
    }
}
