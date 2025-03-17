import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import EventModal from "./EventModal";
import jwtAxios from "../../../util/jwtUtil";

// 공휴일 가져오기
const fetchHolidayEvents = async () => {
  try {
    const res = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/ko.south_korea%23holiday%40group.v.calendar.google.com/events",
      { params: { key: "process.env.REACT_APP_GOOGLE_API_KEY" } }
    );
    return res.data.items.map((item) => ({
      id: `holiday-${item.id}`, // ID 추가 (중복 방지)
      title: item.summary,
      start: item.start.date || item.start.dateTime.split("T")[0], // 날짜만 표시
      end: item.end.date || item.end.dateTime.split("T")[0],
      isHoliday: true, // 공휴일 여부 추가
    }));
  } catch (error) {
    console.error("공휴일 로딩 오류:", error);  
    return [];
  }
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]); // 공휴일 별도 관리
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ content: "", start: "", end: "" });

  // 모든 일정 불러오기 (공휴일 포함)
  const fetchAllEvents = async () => {
    try {
      const [dbRes, holidayEvents] = await Promise.all([
        jwtAxios.get("http://localhost:8090/admin/calendar"),
        fetchHolidayEvents(),
      ]);
      setHolidays(holidayEvents); // 공휴일 유지
      setEvents([...dbRes.data, ...holidayEvents]); // 공휴일 + 일반 일정 합치기
    } catch (error) {
      console.error("일정 로딩 오류:", error);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const addEvent = async () => {
    try {
      console.log("보내는 이벤트 데이터: ", newEvent);
      await jwtAxios.post("http://localhost:8090/admin/calendar", newEvent, {
        headers: { "Content-Type": "application/json" },
      });      
      await fetchAllEvents(); // 일정 추가 후 공휴일 유지
      setModalOpen(false);
      setNewEvent({ content: "", start: "", end: "" });
    } catch (error) {
      console.error("일정 추가 오류:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      try {
        await jwtAxios.delete(`http://localhost:8090/admin/calendar/${eventId}`);
        alert("일정이 삭제되었습니다.");
        await fetchAllEvents(); // 삭제 후 공휴일 유지
      } catch (error) {
        console.error("일정 삭제 오류:", error);
      }
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          id: event.id,
          title: event.content || event.title, // 일반 일정 vs 공휴일
          start: event.start,
          end: event.end,
          isHoliday: event.isHoliday, // 공휴일 여부 추가
        }))}
        selectable={true}
        select={(selectInfo) => {
          const startDateTime = selectInfo.startStr + "T00:00";
          const realEndDate = new Date(selectInfo.endStr);
          realEndDate.setDate(realEndDate.getDate() - 1);
          const endDateTime = realEndDate.toISOString().split("T")[0] + "T23:59";

          setNewEvent({ content: "", start: startDateTime, end: endDateTime });
          setModalOpen(true);
        }}
        eventClick={(event) => {
          if (!event.event.extendedProps.isHoliday) {
            handleDeleteEvent(event.event.id);
          }
        }}
        eventContent={(arg) => {
          const { isHoliday } = arg.event.extendedProps;
          const start = arg.event.start;
          let displayHtml = "";

          if (isHoliday) {
            // 공휴일은 시간 없이 날짜만 표시
            displayHtml = `<b>${arg.event.title}</b>`;
          } else if (start && start.toISOString().includes("T")) {
            // 일반 일정이면 시간 포함
            const eventTime = new Date(start).toLocaleTimeString("ko-KR", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            displayHtml = `<b>${eventTime}</b> ${arg.event.title}`;
          } else {
            displayHtml = arg.event.title;
          }
          return { html: displayHtml };
        }}
        customButtons={{
          addEventButton: {
            text: "일정 추가",
            click: () => setModalOpen(true),
          },
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "addEventButton",
        }}
      />

      <EventModal
        open={modalOpen}
        setOpen={setModalOpen}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        addEvent={addEvent}
      />
    </div>
  );
};

export default Calendar;
