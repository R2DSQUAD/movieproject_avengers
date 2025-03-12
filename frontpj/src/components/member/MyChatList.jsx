import React, { useEffect, useState } from "react";
import jwtAxios from "../../util/jwtUtil";


const MyChatList = () => {
    const [messages, setMessages] = useState([]);

    const fetchMemberInfo = async () => {
        try {
            const response = await jwtAxios.get("http://localhost:8090/api/myinfo/detail");
            setMessages(response.data.chatMessageEntities || []);
        } catch (error) {
            console.error("메시지 목록 가져오는 중 오류 발생:", error);
        }
    };

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
