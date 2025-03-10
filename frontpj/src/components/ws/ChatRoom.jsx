import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import '../../css/ChatRoom.css'; // CSS 파일 import
import axios from 'axios'; // axios 사용 (선택 사항, fetch도 가능합니다)

const ChatRoom = () => {
  const loginState = useSelector((state) => state.loginSlice);
  const webSocket = useRef(null);
  const [message, setMessage] = useState(''); // 입력된 메시지 상태
  const [messages, setMessages] = useState([]); // 메시지 목록 상태
  const url = 'ws://localhost:8090/chat'; // 웹소켓 서버 URL
  const chatBoxRef = useRef(null); // 채팅박스 DOM을 참조

  // 웹소켓 연결 및 이벤트 핸들링
  useEffect(() => {
    console.log(loginState);
    webSocket.current = new WebSocket(url);

    // 웹소켓 열렸을 때
    webSocket.current.onopen = () => {
      console.log('웹소켓 연결 성공');
      // 서버에 닉네임 전송
      if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
        const emailMessage = `email:${loginState.email}`; // 닉네임을 서버에 전송
        webSocket.current.send(emailMessage);
      }
    };

    // 서버로부터 메시지 수신
    webSocket.current.onmessage = (event) => {
      console.log('서버에서 받은 메시지:', event.data);
      const currentTime = new Date().toLocaleTimeString(); // 현재 시간 얻기
      const sender = event.data.split(':')[0]; // 메시지의 발신자 추출

      // 이미 받은 메시지가 사용자의 메시지라면, 중복 처리
      if (sender !== loginState.email) {
        setMessages((prevMessages) => {
          const newMessages = [
            ...prevMessages,
            { type: 'received', text: event.data, time: currentTime, sender }
          ];
          localStorage.setItem('chatMessages', JSON.stringify(newMessages)); // 로컬 스토리지에 메시지 저장
          return newMessages;
        });
      }
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
  const handleSendMessage = async () => {
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      const currentTime = new Date().toLocaleTimeString(); // 현재 시간 얻기
      const formattedMessage = `${loginState.email}: ${message}`;

      // WebSocket을 통해 메시지 전송
      webSocket.current.send(formattedMessage);
      console.log('보낸 메시지:', formattedMessage);

      // 메시지를 REST API로도 보내기
      try {
        await axios.post('http://localhost:8090/api/chat/messages', {
          sender: loginState.email,
          message: message,
        });
        console.log('메시지가 REST API에 전송되었습니다.');
      } catch (error) {
        console.error('REST API 메시지 전송 실패:', error);
      }

      // 메시지 상태 업데이트 및 로컬 스토리지 저장
      setMessages((prevMessages) => {
        const newMessages = [
          ...prevMessages,
          { type: 'sent', text: message, time: currentTime, sender: loginState.email }
        ];
        localStorage.setItem('chatMessages', JSON.stringify(newMessages)); // 로컬 스토리지에 메시지 저장
        return newMessages;
      });

      setMessage(''); // 메시지 전송 후 입력 필드를 비움
    } else {
      console.log('웹소켓 연결이 되어 있지 않습니다.');
    }
  };

  // 엔터키를 눌렀을 때 메시지 보내기 또는 줄바꿈 처리
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSendMessage(); // 메시지 보내기
      event.preventDefault(); // 기본 동작인 줄바꿈을 방지
    }
  };

  // 새 메시지가 추가될 때마다 채팅박스 맨 아래로 스크롤
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // messages 상태가 업데이트 될 때마다 실행

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 메시지 불러오기
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages)); // 로컬 스토리지에 저장된 메시지 불러오기
    }
  }, []);

  // 메시지에서 닉네임만 제거하고 본문만 반환하는 함수
  const formatMessageText = (text) => {
    const parts = text.split(':'); // 닉네임과 메시지를 분리
    return parts.length > 1 ? parts.slice(1).join(':').trim() : text; // 닉네임 부분을 제거한 나머지 텍스트 반환
  };

  // 로컬스토리지에 저장된 메시지 지우는 함수
  const clearChatMessages = () => {
    localStorage.removeItem('chatMessages');
    setMessages([]); // 상태도 초기화
    console.log('로컬 스토리지에 저장된 메시지가 삭제되었습니다.');
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
                  justifyContent: msg.sender === loginState.email ? 'flex-end' : 'flex-start' 
                  // 메시지의 sender가 로그인된 사용자의 닉네임이면 오른쪽에 정렬
                }}
              >
                <div className="messageText">
                  {msg.sender !== loginState.email && <strong>{msg.sender}</strong>}
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

        {/* 로그인된 사용자가 ADMIN일 경우만 버튼 표시 */}
        {loginState.roleNames.includes('ADMIN') && (
          <button onClick={clearChatMessages} className="clearButton">
            저장된 메시지 지우기
          </button>
        )}
      </div>
      <div>
        <Link to="/Komoran">Komoran</Link>
      </div>
    </>
  );
};

export default ChatRoom;
