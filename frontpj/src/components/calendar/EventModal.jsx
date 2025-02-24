import React from "react";
import { Modal, Button, TextField } from "@mui/material";

const EventModal = ({ open, setOpen, newEvent, setNewEvent, addEvent }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div style={{ padding: 20, background: "#fff", margin: "10% auto", width: 400 }}>
        <h3>일정 추가</h3>
        <TextField
          label="일정 내용"
          fullWidth
          value={newEvent.content}
          onChange={(e) => setNewEvent({ ...newEvent, content: e.target.value })}
        />
        <TextField
          label="시작 날짜"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newEvent.start}
          onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
        />
        <TextField
          label="종료 날짜"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={newEvent.end}
          onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
        />
        <Button variant="contained" color="primary" onClick={addEvent} fullWidth>
          추가
          
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setOpen(false)} fullWidth>
          취소
        </Button>
      </div>
    </Modal>
  );
};

export default EventModal;
