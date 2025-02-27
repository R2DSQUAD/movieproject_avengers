package org.spring.moviepj.service;

import java.util.List;

import org.spring.moviepj.dto.CalendarDto;

public interface CalendarService {

    public List<CalendarDto> eventListAll();

    public void setCalendar(CalendarDto dto);

    public void deleteEvent(Long id);
}
