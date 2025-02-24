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
      console.error(" Error fetching events:", error);
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
      console.error(" Error adding event:", error);
    }
  };
  

  return (
    <div>
  <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events.map(event => ({
    title: event.content,
    start: event.start,
    end: event.end,
  }))}
  selectable={true}
  eventContent={(arg) => {
    const eventTime = new Date(arg.event.start).toLocaleString("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return {
      html: `<b>${eventTime}</b> ${arg.event.title}`
    };
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
