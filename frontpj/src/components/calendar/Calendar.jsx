import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

import EventModal from "./EventModal";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    content: "",
    start: "",
    end: "",
  });

  // DB에서 일정 가져오기
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/calendar");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addEvent = async () => {
    try {
      console.log("보내는 이벤트 데이터: ", newEvent);

      await axios.post("http://localhost:8090/api/calendar", newEvent, {
        headers: { "Content-Type": "application/json" }
      });
      fetchEvents();
      setModalOpen(false);
      setNewEvent({ content: "", start: "", end: "" });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };


  const handleSelect = (selectInfo) => {
    // 날짜 변환 (YYYY-MM-DD → YYYY-MM-DDT00:00)
    const startDateTime = selectInfo.startStr + "T00:00";
  
    // FullCalendar가 end 날짜를 +1일로 줌 → 하루 빼줘야 정확한 종료 날짜
    const realEndDate = new Date(selectInfo.endStr);
    realEndDate.setDate(realEndDate.getDate() - 1);
    const endDateTime = realEndDate.toISOString().split("T")[0] + "T23:59";
  
    setNewEvent({
      content: "",
      start: startDateTime,
      end: endDateTime,
    });
  
    setModalOpen(true);
  };

  const handleEventClick = async (event) => {
    const eventId = event.event.id;  // id 값 가져오기
  
    // 삭제 확인
    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
      try {
        // DELETE 요청 보내기
        await axios.delete(`http://localhost:8090/api/calendar/${eventId}`);
        alert("일정이 삭제되었습니다.");
        fetchEvents(); // 일정 목록 새로 고침
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("일정 삭제 중 오류가 발생했습니다.");
      }
    }
  };
  

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map(event => ({
          id: event.id, // 이벤트 ID 추가
          title: event.content,
          start: event.start,
          end: event.end,
        }))}
        selectable={true}
        select={handleSelect} // 드래그 기능 추가
        eventClick={handleEventClick} // 이벤트 클릭 시 삭제
        eventContent={(arg) => {
          const eventTime = new Date(arg.event.start).toLocaleString("ko-KR", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return { html: `<b>${eventTime}</b> ${arg.event.title}` };
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

      {/* 모달 컴포넌트 */}
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
