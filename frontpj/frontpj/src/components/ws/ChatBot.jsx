import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Link } from 'react-router-dom';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const questionRef = useRef();
    const chatContentRef = useRef();
    let stompClient = useRef(null); // stompClient는 useRef로 관리

    // 채팅창 열기
    const openChat = () => {
        setIsOpen(true);
        onConnect();
    };

    // WebSocket 연결 및 STOMP 설정
    const onConnect = () => {
        alert("접속");

        // 1. WebSocket 연결
        const socket = new SockJS('http://localhost:8090/chatEndpoint');
        
        // 2. STOMP 연결
        stompClient.current = Stomp.over(socket);
        
        stompClient.current.connect({}, (stomFr) => {
            console.log("Connected: ->", stomFr);

            // 3. 서버로 메시지 보내기
            stompClient.current.send("/app/hello", {}, JSON.stringify({ 'content': 'GUEST' }));

            // 4. 서버에서 메시지 받기 (첫번째 메시지)
            stompClient.current.subscribe("/topic/greetings", (botMessage) => {
                console.log(botMessage.body);
                showMessageFn(JSON.parse(botMessage.body).body.message);


            });

            // 5. 클라이언트에서 서버로 메시지 보내기 (질문을 보낼 수 있도록)

            stompClient.current.subscribe("/topic/message", (botMessage) => {
                console.log(botMessage.body);
                showMessageFn(JSON.parse(botMessage.body).body.message);

                
            });
        });
    };

    // 메시지 화면에 표시
    const showMessageFn = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]); // 새로운 메시지 추가
    };

    // 메시지 보내기
    const msgSendClickFn = () => {
        const question = questionRef.current.value.trim();
        if (question.length === 0) {
            alert("질문 내용을 입력해주세요");
            return;
        }

        // 자기 메시지 보이기
        showMessageFn(question);

        // 서버로 메시지 보내기 (STOMP 클라이언트 연결 후에만 전송)
        if (stompClient.current) {
            stompClient.current.send("/app/message", {}, JSON.stringify({ 'content': (question) }));
        }
    };

    // 채팅 종료
    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
        setIsOpen(false);
        setMessages([]);
    };

    return (
        <>
        <div className="chat">
            <div id="chat-bot">
                <div className="wrap">
                    <button type="button" id="btn-chat-open" onClick={openChat}>OPEN</button>
                    {isOpen && (
                        <div id="chat-disp" className="show">
                            <div id="chat-disp-con">
                                <div id="chat-header">
                                    <span>Chat-Bot(WebSocket)</span>
                                    <button type="button" id="close" onClick={disconnect}>X</button>
                                </div>
                                <div id="chat-content" ref={chatContentRef}>
                                    {messages.map((msg, index) => (
                                        <div key={index} className="data-con">{msg}</div> // 메시지 목록
                                    ))}
                                </div>
                                <div id="chat-question" className="flex between">
                                    <input
                                        type="text"
                                        id="question"
                                        ref={questionRef}
                                        placeholder="질문을 입력하세요"
                                    />
                                    <button type="button" id="btn-msg-send" onClick={msgSendClickFn}>전송</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <Link to="/Komoran">Komoran</Link>
        </>
    );
};

export default ChatBot;
