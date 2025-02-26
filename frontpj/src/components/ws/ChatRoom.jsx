import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

const Main = () => {
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
    };

    // 서버로부터 메시지 수신
    webSocket.current.onmessage = (event) => {
      console.log('서버에서 받은 메시지:', event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'received', text: event.data }, // 받은 메시지로 구분
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
  }, []);

  // 메시지 입력 핸들러
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // 메시지 보내기 핸들러
  const handleSendMessage = () => {
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(message); // 웹소켓을 통해 메시지 전송
      console.log('보낸 메시지:', message);
      setMessage(''); // 메시지 전송 후 입력 필드를 비움
    } else {
      console.log('웹소켓 연결이 되어 있지 않습니다.');
    }
  };

  // 엔터키를 눌렀을 때 메시지 보내기
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage(); // 엔터키가 눌리면 메시지 보내기
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

  return (
    <>
    <div style={styles.chatContainer}>
      <h1>ChatRoom</h1>
      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages
          .filter((msg) => msg.type === 'received') // 받은 메시지만 필터링
          .map((msg, index) => (
            <div key={index} style={styles.message}>
              {msg.text}
            </div>
          ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown} // 엔터키 이벤트 추가
          placeholder="메시지를 입력하세요"
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          메시지 보내기
        </button>
      </div>
    </div>
    <div>
      <Link to="/chatBot">chatBot</Link>
    </div>
    </>
  );
};

// 스타일 객체
const styles = {
  chatContainer: {
    width: '400px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  chatBox: {
    height: '300px',
    overflowY: 'scroll',
    border: '1px solid #ddd',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    textAlign: 'left',
    fontFamily: 'Arial, sans-serif',
  },
  message: {
    padding: '8px',
    color: '#000000',
    borderBottom: '1px solid #eee',
    marginBottom: '8px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  input: {
    width: '80%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  button: {
    width: '15%',
    padding: '10px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '14px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Main;
