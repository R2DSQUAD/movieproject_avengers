package org.spring.moviepj.config.ws.service;

import org.spring.moviepj.config.ws.entity.AnswerEntity;
import org.spring.moviepj.config.ws.entity.HelpMessageEntity;
import org.spring.moviepj.config.ws.entity.IntentionEntity;
import org.spring.moviepj.config.ws.repository.AnswerRepository;
import org.spring.moviepj.config.ws.repository.HelpMessageRepository;
import org.spring.moviepj.config.ws.repository.IntentionRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DefaultKomoranService {

  private final AnswerRepository answerRepository;
  private final IntentionRepository intentionRepository;
  private final HelpMessageRepository helpMessageRepository;

  @Transactional
  public void insertAnswerJdbc() {
    // AnswerEntity 생성 (no와 answer를 정의)
    List<AnswerEntity> answers = List.of(
        new AnswerEntity(1L, "안녕하세요 영화 길잡이입니다. 무엇을 도와드릴까요?", "안녕"),
        new AnswerEntity(2L, "영화에 대한 검색 결과 입니다.", "영화"),
        new AnswerEntity(3L, "영화관에 대한 검색결과 입니다.", "영화관"),
        new AnswerEntity(4L, "검색결과를 찾을 수 없습니다. 도움말을 통해 검색해보세요!", "기타"),
        new AnswerEntity(5L, "도움말을 보고 영화 길잡이에게 질문해보세요!", "도움말"));

    // 이미 존재하는 항목을 제외하고 저장
    List<Long> answerNos = answers.stream().map(AnswerEntity::getNo).collect(Collectors.toList());
    List<AnswerEntity> existingAnswers = answerRepository.findAllByNoIn(answerNos);

    List<AnswerEntity> newAnswers = answers.stream()
        .filter(answer -> !existingAnswers.stream()
            .anyMatch(existingAnswer -> existingAnswer.getNo() == answer.getNo())) // no 값 비교
        .collect(Collectors.toList());

    if (!newAnswers.isEmpty()) {
        answerRepository.saveAll(newAnswers);
    }

    // IntentionEntity 생성 (no와 name을 정의, name은 keyword와 동일)
    List<IntentionEntity> intentions = newAnswers.stream()
        .map(answer -> new IntentionEntity(answer.getNo(), answer.getKeyword(), answer, null)) // AnswerEntity와 연결
        .collect(Collectors.toList());

    // 이미 존재하는 IntentionEntity 항목을 제외하고 저장
    List<Long> intentionNos = intentions.stream().map(IntentionEntity::getNo).collect(Collectors.toList());
    List<IntentionEntity> existingIntentions = intentionRepository.findAllByNoIn(intentionNos);

    List<IntentionEntity> newIntentions = intentions.stream()
        .filter(intention -> !existingIntentions.stream()
            .anyMatch(existingIntention -> existingIntention.getNo() == intention.getNo())) // no 값 비교
        .collect(Collectors.toList());

    if (!newIntentions.isEmpty()) {
        intentionRepository.saveAll(newIntentions);
    }
  }

  @Transactional
  public void insertIntentionJdbc() {
    // IntentionEntity 생성 (name은 AnswerEntity의 keyword와 동일)
    List<IntentionEntity> intentions = List.of(
        new IntentionEntity(1L, "안녕", getAnswerEntityByNo(1L), null),  // upper를 null로 설정
        new IntentionEntity(2L, "영화", getAnswerEntityByNo(2L), null),
        new IntentionEntity(3L, "영화관", getAnswerEntityByNo(3L), null),
        new IntentionEntity(4L, "기타", getAnswerEntityByNo(4L), null),
        new IntentionEntity(5L, "도움말", getAnswerEntityByNo(5L), null));

    // 이미 존재하는 항목을 제외하고 저장
    List<String> intentionNames = intentions.stream().map(IntentionEntity::getName).collect(Collectors.toList());
    List<IntentionEntity> existingIntentions = intentionRepository.findAllByNameIn(intentionNames);

    List<IntentionEntity> newIntentions = intentions.stream()
        .filter(intention -> !existingIntentions.stream()
            .anyMatch(existingIntention -> existingIntention.getName().equals(intention.getName())))
        .collect(Collectors.toList());

    if (!newIntentions.isEmpty()) {
      intentionRepository.saveAll(newIntentions);
    }
  }

  // 답변 번호로 AnswerEntity를 조회하는 메서드
  private AnswerEntity getAnswerEntityByNo(Long no) {
    return answerRepository.findById(no).orElse(null);
  }

  @Transactional
  public void insertHelpMessageJdbc() {
    List<HelpMessageEntity> helpMessages = List.of(
        new HelpMessageEntity("영화를 검색하시려면 '영화 [영화 제목] '라고 입력해주세요."),
        new HelpMessageEntity("영화관을 검색하시려면 '영화관 [영화관 이름] '라고 입력해주세요."));

    List<String> messages = helpMessages.stream()
        .map(HelpMessageEntity::getMessage)
        .collect(Collectors.toList());

    List<HelpMessageEntity> existingHelpMessages = helpMessageRepository.findAllByMessageIn(messages);
    List<HelpMessageEntity> newHelpMessages = helpMessages.stream()
        .filter(helpMessage -> !existingHelpMessages.stream()
            .anyMatch(existingMessage -> existingMessage.getMessage().equals(helpMessage.getMessage())))
        .collect(Collectors.toList());

    if (!newHelpMessages.isEmpty()) {
        helpMessageRepository.saveAll(newHelpMessages);
    }
  }
}
