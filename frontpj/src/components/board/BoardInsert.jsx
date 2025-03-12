import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../util/jwtUtil";

const BoardInsert = () => {
  // 상태 변수 설정
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("자유게시판");  // 카테고리 기본값을 자유게시판으로 설정
  const [content, setContent] = useState("");
  const [itemFile, setItemFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Redux에서 로그인 상태 가져오기
  const loginState = useSelector((state) => state.loginSlice);

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);  // 카테고리 추가
    formData.append("email", loginState.email); // Redux에서 이메일 가져오기
    if (itemFile) {
      formData.append("itemFile", itemFile);
    }

    try {
      // 서버로 데이터 전송 (Content-Type을 명시하지 않음)
      const response = await jwtAxios.post("http://localhost:8090/board/insert", formData, {
        // "Content-Type"을 명시하지 않으면 브라우저가 자동으로 multipart/form-data로 설정해줌
      });
      // 성공 메시지 처리
      setMessage(response.data);
    } catch (error) {
      // 에러 처리
      setMessage("아이템 추가에 실패했습니다.");
      console.error("Error:", error);
    }
    navigate("/board");
  };

  return (
    <div>
      <h2>게시글 추가</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ color: 'white' }}>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ color: 'white' }}>
          <label>카테고리:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            required
          >
            <option value="영화게시판">영화게시판</option>
            <option value="자유게시판">자유게시판</option>
            <option value="문의게시판">문의게시판</option>
            {loginState.roleNames?.includes("ADMIN") ? (<option value="공지사항">공지사항</option>
):( <></>)}
          </select>
        </div>
        <div style={{ color: 'white' }}>
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div style={{ color: 'white' }}>
          <label>파일:</label>
          <input
            type="file"
            onChange={(e) => setItemFile(e.target.files[0])}
          />
        </div>
        <button type="submit">게시글 추가</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BoardInsert;
