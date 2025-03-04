package org.spring.moviepj.controller.api;

import java.util.List;
import java.util.Optional;

import org.spring.moviepj.dto.CalendarDto;
import org.spring.moviepj.entity.CalendarEntity;
import org.spring.moviepj.repository.CalendarRepository;
import org.spring.moviepj.service.impl.CalendarServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/admin/calendar", produces = "application/json")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarRepository calendarRepository;
    private final CalendarServiceImpl calendarService;

    @GetMapping("/events")
    public List<CalendarDto> eventsCalender() {
        List<CalendarDto> eventDtoList = calendarService.eventListAll();
        return eventDtoList;
    }

    @PostMapping("")
    public List<CalendarDto> setCalendar(@RequestBody CalendarDto dto) {
        calendarService.setCalendar(dto);
        return calendarService.eventListAll();
    }

    @GetMapping("")
    public List<CalendarDto> getCalendar() {
        return calendarService.eventListAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        Optional<CalendarEntity> event = calendarRepository.findById(id);
        if (event.isPresent()) {
            calendarRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
}
