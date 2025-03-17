import React, { useEffect, useState } from "react";
import jwtAxios from "../../util/jwtUtil";
import "../../css/MyChatList.css"; // CSS 파일 import

// 날짜 포맷 함수
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const MyChatList = () => {
    const [messages, setMessages] = useState([]);

    const fetchMemberInfo = async () => {
        try {
            const response = await jwtAxios.get("http://localhost:8090/api/myinfo/detail");
            const sortedMessages = response.data.chatMessageEntities || [];

            // createTime을 기준으로 내림차순 정렬
            sortedMessages.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

            setMessages(sortedMessages);
        } catch (error) {
            console.error("메시지 목록 가져오는 중 오류 발생:", error);
        }
    };

    console.log(messages);

    useEffect(() => {
        fetchMemberInfo();
    }, []);

    return (
        <div className="chatList">
            <h3>메시지 목록</h3>
            {messages.length > 0 ? (
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            <div className="message">
                                <span className="messageContent">{message.content}</span>
                                <span className="messageTime">
                                    {message.createTime ? formatDate(message.createTime) : "시간 정보 없음"}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>메시지가 없습니다.</p>
            )}
        </div>
    );
};

export default MyChatList;
