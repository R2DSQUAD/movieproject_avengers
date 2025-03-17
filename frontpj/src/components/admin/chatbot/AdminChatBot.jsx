import React, { useState, useEffect } from "react";
import jwtAxios from "../../../util/jwtUtil";
import "../../../css/admin/Chatbot.css";

const AdminChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);  // Added state for Add Modal
  const [showEditModal, setShowEditModal] = useState(false);  // State for Edit Modal

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

  // Handle adding new message
  const handleAddMessage = async () => {
    try {
      await jwtAxios.post("http://localhost:8090/api/helpMessage", { message: newMessage }, {
        headers: { "Content-Type": "application/json" },
      });
      setNewMessage("");
      setShowAddModal(false);
      fetchMessages();
    } catch (error) {
      console.error("추가 실패:", error);
    }
  };

  // Handle opening edit modal
  const handleEditClick = (msg) => {
    setSelectedMessage(msg);
    setEditMessage(msg.message);
    setShowEditModal(true);
  };

  // Handle updating the message
  const handleUpdate = async () => {
    try {
      await jwtAxios.put(`http://localhost:8090/api/helpMessage/${selectedMessage.id}`, { message: editMessage }, {
        headers: { "Content-Type": "application/json" },
      });
      setShowEditModal(false);
      fetchMessages();
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // Handle deleting a message
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await jwtAxios.delete(`http://localhost:8090/api/helpMessage/${selectedMessage.id}`);
        setShowEditModal(false);
        fetchMessages();
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };

  return (
    <div className="admin-chatbot-container">
      <h2>도움말 관리</h2>

      {/* 도움말 목록 */}
      <ul className="help-messages-list">
        {messages.map((msg) => (
          <li key={msg.id} className="help-message-item">
            {msg.message}{" "}
            <button onClick={() => handleEditClick(msg)} className="edit-btn">수정</button>
          </li>
        ))}
      </ul>

      {/* 도움말 추가 버튼 */}
      <button onClick={() => setShowAddModal(true)} className="add-message-btn">도움말 추가하기</button>

      {/* 새 도움말 추가 모달 */}
      {showAddModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>새 도움말 추가</h3>
            <textarea
              rows="3"
              name="newMessage"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지 입력"
              className="new-message-input"
            />
            <div className="modal-actions">
              <span
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}  // Close the add modal
              >
                ✖
              </span>
              <button onClick={handleAddMessage} className="add-btn">추가</button>
            </div>
          </div>
        </div>
      )}

      {/* 수정/삭제 모달 */}
      {showEditModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>도움말 수정/삭제</h3>
            <textarea
              rows="3"
              name="editMessage"
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
              className="edit-message-input"
            />
            <div className="modal-actions">
              <span
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}  // Close the edit modal
              >
                ✖
              </span>
              <button onClick={handleDelete} className="delete-btn">삭제</button>
              <button onClick={handleUpdate} className="update-btn">수정 완료</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatBot;
