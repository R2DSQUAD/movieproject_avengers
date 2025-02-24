package org.spring.moviepj.service.impl;

import lombok.RequiredArgsConstructor;

import org.spring.moviepj.dto.CalendarDto;
import org.spring.moviepj.entity.CalendarEntity;
import org.spring.moviepj.repository.CalendarRepository;
import org.spring.moviepj.service.CalendarService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CalendarServiceImpl implements CalendarService {

  private final CalendarRepository calendarRepository;

  @Override
  public List<CalendarDto> eventListAll() {

    List<CalendarDto> calendarDtoList = new ArrayList<>();
    List<CalendarEntity> calendarEntities = calendarRepository.findAll();

    for (CalendarEntity entity : calendarEntities) {
      CalendarDto calendarDto = CalendarDto.builder()
          .id(entity.getId())
          .start(entity.getStart())
          .content(entity.getContent())
          .end(entity.getEnd())
          .build();
      calendarDtoList.add(calendarDto);
    }
    return calendarDtoList;
  }

  @Override
  public void setCalendar(CalendarDto dto) {
    CalendarEntity entity = CalendarEntity
        .builder()
        .content(dto.getContent())
        .start(dto.getStart())
        .end(dto.getEnd())
        .build();

    CalendarEntity savedEntity = calendarRepository.save(entity);

    System.out.println(" 일정 저장 완료: " + savedEntity);
  }

}
