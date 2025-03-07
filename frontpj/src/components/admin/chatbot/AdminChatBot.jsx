import React, { useState, useEffect } from "react";
import jwtAxios from "../../../util/jwtUtil";

const AdminChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 백엔드에서 도움말 목록 불러오기
  const fetchMessages = async () => {
    try {
      const response = await jwtAxios.get("http://localhost:8090/api/helpMessage");
      setMessages(response.data);
    } catch (error) {
      console.error("메시지 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 새 도움말 추가
  const handleAddMessage = async () => {
    try {
      await jwtAxios.post("http://localhost:8090/api/helpMessage", { message: newMessage }, {
        headers: { "Content-Type": "application/json" },
      });
      setNewMessage("");
      setShowAddInput(false);
      fetchMessages();
    } catch (error) {
      console.error("추가 실패:", error);
    }
  };

  //수정 모달 열기
  const handleEditClick = (msg) => {
    setSelectedMessage(msg);
    setEditMessage(msg.message);
    setShowModal(true);
  };
  //수정
  const handleUpdate = async () => {
    try {
      await jwtAxios.put(`http://localhost:8090/api/helpMessage/${selectedMessage.id}`, { message: editMessage }, {
        headers: { "Content-Type": "application/json" },
      });
      setShowModal(false);
      fetchMessages();
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // 삭제 API 호출
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await jwtAxios.delete(`http://localhost:8090/api/helpMessage/${selectedMessage.id}`);
        setShowModal(false);
        fetchMessages();
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };

  return (
    <div>
      <h2>도움말</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            {msg.message}{" "}
            <button onClick={() => handleEditClick(msg)}>수정</button>
          </li>
        ))}
      </ul>

      {/* 도움말 추가 */}
      <div>
        {!showAddInput ? (
          <button onClick={() => setShowAddInput(true)}>도움말 추가하기</button>
        ) : (
          <div>
            <h3>새 도움말 추가</h3>
            <textarea
              rows="3"
              name="newMessage"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지 입력"
              style={{ width: "100%" }}
            />
            <button onClick={handleAddMessage}>추가</button>
            <button onClick={() => { setShowAddInput(false); setNewMessage(""); }}>취소</button>
          </div>
        )}
      </div>

      {/* 수정/삭제 모달 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>도움말 수정/삭제</h3>
            <label>
              메시지:
              <textarea
                rows="3"
                name="editMessage"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleUpdate}>수정 완료</button>
              <button onClick={handleDelete}>삭제</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatBot;
