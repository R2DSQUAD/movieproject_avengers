import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import '../../css/ChatRoom.css'; // CSS 파일 import

const ChatRoom = () => {
  const loginState = useSelector((state) => state.loginSlice);
  const webSocket = useRef(null);
  const [message, setMessage] = useState(''); // 입력된 메시지 상태
  const [messages, setMessages] = useState([]); // 메시지 목록 상태
  const url = 'ws://localhost:8090/chat'; // 웹소켓 서버 URL
  const chatBoxRef = useRef(null); // 채팅박스 DOM을 참조

  // 웹소켓 연결 및 이벤트 핸들링
  useEffect(() => {
    webSocket.current = new WebSocket(url);

    // 웹소켓 열렸을 때
    webSocket.current.onopen = () => {
      console.log('웹소켓 연결 성공');
      console.log(loginState)
      // 서버에 닉네임 전송
      if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
        const nicknameMessage = `nickname:${loginState.nickname}`; // 닉네임을 서버에 전송
        webSocket.current.send(nicknameMessage);
      }
    };

    // 서버로부터 메시지 수신
    webSocket.current.onmessage = (event) => {
      console.log('서버에서 받은 메시지:', event.data);
      const currentTime = new Date().toLocaleTimeString(); // 현재 시간 얻기
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'received', text: event.data, time: currentTime, sender: event.data.split(':')[0] }, // 받은 메시지에 시간과 발신자 추가
      ]);
    };

    // 웹소켓 연결 종료 시 처리
    webSocket.current.onclose = () => {
      console.log('웹소켓 연결 종료');
    };

    // 컴포넌트 언마운트 시 웹소켓 종료
    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, []); // 컴포넌트가 마운트 될 때만 실행

  // 메시지 입력 핸들러
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // 메시지 보내기 핸들러
  const handleSendMessage = () => {
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      const currentTime = new Date().toLocaleTimeString(); // 현재 시간 얻기
      // 로그인된 사용자의 닉네임을 포함하여 메시지를 전송
      const formattedMessage = `${loginState.nickname}: ${message}`;
      webSocket.current.send(formattedMessage); // 웹소켓을 통해 메시지 전송
      console.log('보낸 메시지:', formattedMessage);
      setMessage(''); // 메시지 전송 후 입력 필드를 비움
    } else {
      console.log('웹소켓 연결이 되어 있지 않습니다.');
    }
  };

  // 엔터키를 눌렀을 때 메시지 보내기 또는 줄바꿈 처리
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Shift 키가 눌리지 않은 상태에서 Enter 키를 누르면 메시지를 보내고
      handleSendMessage(); // 메시지 보내기
      event.preventDefault(); // 기본 동작인 줄바꿈을 방지
    }
  };

  // 새 메시지가 추가될 때마다 채팅박스 맨 아래로 스크롤
  useEffect(() => {
    // 채팅박스가 있을 경우 맨 아래로 스크롤
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // messages 상태가 업데이트 될 때마다 실행

  // 메시지에서 줄바꿈을 <br />로 변환하는 함수
  const formatMessageWithLineBreaks = (text) => {
    return text.split("\n").map((line, index) => (
      <span key={index} style={{ color: 'black' }} >
        {line}
        <br />
      </span>
    ));
  };

  // 메시지에서 닉네임만 제거하고 본문만 반환하는 함수
  const formatMessageText = (text) => {
    const parts = text.split(':'); // 닉네임과 메시지를 분리
    return parts.length > 1 ? parts.slice(1).join(':').trim() : text; // 닉네임 부분을 제거한 나머지 텍스트 반환
  };

  return (
    <>
      <div className="chatContainer">
        <h1 style={{ color: 'black' }}>ChatRoom</h1>
        <div className="chatBox" ref={chatBoxRef}>
          {messages
            .filter((msg) => msg.type === 'received' || msg.type === 'sent') // 받은 메시지와 보낸 메시지 모두 표시
            .map((msg, index) => (
              <div 
                key={index} 
                className="message" 
                style={{
                  justifyContent: msg.sender === loginState.nickname ? 'flex-end' : 'flex-start' 
                  // 메시지의 sender가 로그인된 사용자의 닉네임이면 오른쪽에 정렬
                }}
              >
                {/* 여기에서 닉네임을 제거한 메시지만 표시 */}
                <div className="messageText">
                  {msg.sender !== loginState.nickname && <strong>{msg.sender}</strong>}
                  {formatMessageText(msg.text)} {/* 닉네임 부분을 제거한 메시지 본문만 표시 */}
                </div>
                <div className="time">{msg.time}</div> {/* 메시지 옆에 시간 표시 */}
              </div>
            ))}
        </div>
        <div className="inputContainer">
          <textarea
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
            placeholder="메시지를 입력하세요"
            className="input"
          />
          <button onClick={handleSendMessage} className="button">
            메시지 보내기
          </button>
        </div>
      </div>
      <div>
        <Link to="/Komoran">Komoran</Link>
      </div>
    </>
  );
};

export default ChatRoom;
