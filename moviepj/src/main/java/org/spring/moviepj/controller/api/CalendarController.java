package org.spring.moviepj.controller.api;

import java.util.List;

import org.spring.moviepj.dto.CalendarDto;
import org.spring.moviepj.service.impl.CalendarServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/api", produces = "application/json")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarServiceImpl calendarService;

    @GetMapping("/events")
    public List<CalendarDto> eventsCalender() {
        List<CalendarDto> eventDtoList = calendarService.eventListAll();
        return eventDtoList;
    }

    @PostMapping("/calendar")
    public List<CalendarDto> setCalendar(@RequestBody CalendarDto dto) {
        calendarService.setCalendar(dto);
        return calendarService.eventListAll();
    }

    @GetMapping("/calendar")
    public List<CalendarDto> getCalendar() {
        return calendarService.eventListAll();
    }

}
