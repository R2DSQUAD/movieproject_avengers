import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../util/jwtUtil";

const BoardUpdate = () => {
  const { id } = useParams(); // Get the id from the URL params (for edit scenario)
  const navigate = useNavigate();

  // State variables
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // Category state
  const [content, setContent] = useState("");
  const [itemFile, setItemFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state

  // Redux state (login details)
  const loginState = useSelector((state) => state.loginSlice);

  // Fetch the board detail if it's an edit scenario
  useEffect(() => {
    if (id) {
      const fetchBoardDetail = async () => {
        try {
          const response = await jwtAxios.get(`http://localhost:8090/board/detail/${id}`);
          setTitle(response.data.title);
          setCategory(response.data.category);
          setContent(response.data.content);
          setItemFile(response.data.itemFile); // If there's an existing file
          setLoading(false);
        } catch (err) {
          console.error("게시글 상세 정보 불러오기 실패", err);
          setError("게시글 상세 정보를 불러오는 데 실패했습니다.");
          setLoading(false);
        }
      };
      fetchBoardDetail();
    } else {
      setLoading(false); // If there's no id, stop loading
    }
  }, [id]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData
    const formData = new FormData();
    formData.append("id", id)
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category); 
    formData.append("email", loginState.email); // Email from login state
    if (itemFile) {
      formData.append("itemFile", itemFile); // Add the file if any
    }

    try {
      // Send data to the server (Content-Type handled automatically by FormData)
      const response = await jwtAxios.post("http://localhost:8090/board/update", formData);
      setMessage(response.data);
    } catch (error) {
      setMessage("게시글 수정에 실패했습니다.");
      console.error("Error:", error);
    }
    navigate("/board"); 

  };

  if (loading) {
    return <p>로딩 중...</p>; // Loading state
  }

  if (error) {
    return <p>{error}</p>; // Error state
  }

  return (
    <div>
      <h2>{id ? "게시글 수정" : "게시글 추가"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ color: "white" }}>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ color: "white" }}>
          <label>카테고리:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">카테고리 선택</option>
            <option value="영화게시판">영화게시판</option>
            <option value="자유게시판">자유게시판</option>
            <option value="문의게시판">문의게시판</option>
            {loginState.roleNames?.includes("ADMIN") ? (<option value="공지사항">공지사항</option>
):( <></>)}
          </select>
        </div>
        <div style={{ color: "white" }}>
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div style={{ color: "white" }}>
          <label>파일:</label>
          <input
            type="file"
            onChange={(e) => setItemFile(e.target.files[0])}
          />
        </div>
        <button type="submit">{id ? "게시글 수정" : "게시글 추가"}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BoardUpdate;
