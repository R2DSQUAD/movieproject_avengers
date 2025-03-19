import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../util/jwtUtil";
import "../../css/BoardUpdate.css";

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
  const [originFileName, setOriginFileName] = useState("");

  // Redux state (login details)
  const loginState = useSelector((state) => state.loginSlice);

  // Fetch the board detail if it's an edit scenario
  useEffect(() => {
    if (id) {
      const fetchBoardDetail = async () => {
        try {
          const response = await jwtAxios.get(
            `http://43.201.20.172:8090/board/detail/${id}`
          );
          setTitle(response.data.title);
          setCategory(response.data.category);
          setContent(response.data.content);
          setItemFile(response.data.itemFile); // If there's an existing file
          setOriginFileName(response.data.itemFile);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
  
      if (!allowedExtensions.includes(fileExtension)) {
        alert("허용되지 않은 파일 형식입니다.");
        e.target.value = "";
        setItemFile(null);
        return;
      }
  
      setItemFile(file); // 상태 업데이트만!
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("email", loginState.email); // Email from login state
    if (itemFile) {
      formData.append("itemFile", itemFile); // Add the file if any
    }formData.append("originFileName", originFileName);

    try {
      // Send data to the server (Content-Type handled automatically by FormData)
      const response = await jwtAxios.post(
        "http://43.201.20.172:8090/board/update",
        formData
      );
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
    <div className="boardUpdate">
      <h2>{id ? "게시글 수정" : "게시글 추가"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="board-title">
          <span>제목</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="board-category">
          <span>카테고리</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">카테고리 선택</option>
            <option value="영화게시판">영화게시판</option>
            <option value="자유게시판">자유게시판</option>
            <option value="문의게시판">문의게시판</option>
            {loginState.roleNames?.includes("ADMIN") ? (
              <option value="공지사항">공지사항</option>
            ) : (
              <></>
            )}
          </select>
        </div>
        <div className="board-content">
          <span>내용</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="board-upload">
          <span>파일</span>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            style={{ display: "none" }} // input 숨기기
          />
          <div className="file-upload">
            <label htmlFor="file-upload" className="upload-btn">
              파일 선택
            </label>
            <span id="file-name-display">
              {itemFile
                ? `${itemFile.name}`
                : originFileName
                ? `${originFileName}`
                : ""}
            </span>

          </div>
        </div>
        <button type="submit" className="board-submit">
          {id ? "게시글 수정" : "게시글 추가"}
        </button>
      </form>
      {message && <span>{message}</span>}
    </div>
  );
};

export default BoardUpdate;
