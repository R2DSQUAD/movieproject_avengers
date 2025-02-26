import React, { useState, useEffect } from 'react';

const Komoran = () => {
  const [message, setMessage] = useState('');
  const [chatContent, setChatContent] = useState('');
  const [response, setResponse] = useState('');  // 서버 응답 상태 관리
  const [movieDetails, setMovieDetails] = useState(null);  // 영화 정보 상태 관리

  // useEffect로 컴포넌트가 마운트될 때 "안녕" 메시지 보내기
  useEffect(() => {
    sendMessage("안녕");
  }, []); // 빈 배열([])을 넣으면, 컴포넌트가 처음 렌더링될 때만 실행됩니다.

  const btnMsgSendClicked = () => {
    const questionText = message.trim();
    if (questionText === "" || questionText.length < 2) return;

    sendMessage(questionText);
    
    // 보내는 메시지를 chatContent에 추가
    const messageHtml = inputTagString(questionText);
    setChatContent(prevContent => prevContent + messageHtml);

    setMessage(''); // 입력 필드 리셋
  };

  const inputTagString = (text) => {
    const now = new Date();
    const ampm = now.getHours() > 11 ? "오후" : "오전";
    const time = `${ampm} ${now.getHours() % 12}:${now.getMinutes()}`;

    return `
      <div class="msg user flex end">
        <div class="message">
          <div class="part">
            <p>${text}</p>
          </div>
          <div class="time">${time}</div>
        </div>
      </div>
    `;
  };

  // 메시지 보내기 (fetch 사용)
  const sendMessage = async (message) => {
    try {
      const response = await fetch('http://localhost:8090/botController', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          message: message,
        }),
      });

      // 서버 응답을 JSON 형태로 받음
      const responseData = await response.json(); // JSON 파싱
      setResponse(responseData.answer.content); // 서버 응답의 content만 상태에 저장

      // "안녕" 메시지를 보낸 경우, 영화 정보는 표시하지 않음
      if (message === "안녕") {
        setMovieDetails(null); // "안녕" 메시지일 때는 영화 정보를 null로 설정
      } else {
        setMovieDetails(responseData.answer.movie); // 영화 정보 저장
      }

      showMessage(responseData.answer.content); // 화면에 응답 표시
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // 받은 메시지 화면에 출력
  const showMessage = (messageHtml) => {
    setChatContent(prevContent => prevContent + messageHtml);
    const chatContentElement = document.getElementById("chat-content");
    chatContentElement.scrollTop = chatContentElement.scrollHeight;
  };

  return (
    <div>
      <button onClick={btnMsgSendClicked}>Send</button>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div id="chat-content" dangerouslySetInnerHTML={{ __html: chatContent }} />
      
      {/* 서버 응답의 content만 화면에 표시 */}
      

      {/* 영화 데이터가 있을 경우에만 영화 정보 표시 */}
      {movieDetails && movieDetails.id && (
        <div className="movie-details">
          <p><strong>영화 ID:</strong> {movieDetails.id}</p>
          <p><strong>영화 코드:</strong> {movieDetails.movieCd}</p>
          <p><strong>영화 이름:</strong> {movieDetails.movieNm}</p>
        </div>
      )}
    </div>
  );
};

export default Komoran;
