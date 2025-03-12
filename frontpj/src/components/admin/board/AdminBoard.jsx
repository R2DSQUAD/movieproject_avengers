import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../../css/admin/Cinemas.css";
import { useSelector } from "react-redux";
import jwtAxios from "../../../util/jwtUtil";

const AdminBoard = () => {
  const [boardList, setBoardList] = useState([]); // 전체 게시글 리스트 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [filteredBoardList, setFilteredBoardList] = useState([]); // 필터링된 게시글 리스트
  const [searchOption, setSearchOption] = useState("title"); // 검색 항목 (제목, 내용, 글쓴이)
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [messagesPerPage] = useState(10); // 페이지당 게시글 수
  const [selectedCategory, setSelectedCategory] = useState("all"); // 선택된 카테고리
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.loginSlice);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    email: "",
    itemFile: null, // 파일 상태 추가
  });
  
  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get("http://localhost:8090/board/List");
        setBoardList(response.data);  // 받아온 데이터로 상태 업데이트
        setFilteredBoardList(response.data); // 초기에는 모든 게시글을 표시
      } catch (err) {
        console.error("아이템 리스트 불러오기 실패", err);
      }
    };
    fetchBoardList();
  }, []);

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr); // 문자열을 Date 객체로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    if(year<2000){
      return null;
    }
    return `${year}년-${month}월-${day}일 ${hours}시:${minutes}분`;
  };

  // 카테고리 버튼 클릭 시 카테고리 필터링
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    let filtered = [];
    if (category === "all") {
      filtered = boardList; // 모든 게시글을 다시 표시
    } else {
      filtered = boardList.filter(board => board.category === category);
    }
    setFilteredBoardList(filtered);
    setCurrentPage(1); // 카테고리 필터링 후 첫 페이지로 이동
  };

  // 검색 버튼 클릭 시 필터링된 게시글 리스트 설정
  const handleSearch = () => {
    const filteredList = boardList.filter(board => {
      switch (searchOption) {
        case "title":
          return board.title.toLowerCase().includes(searchQuery.toLowerCase());
        case "content":
          return board.content.toLowerCase().includes(searchQuery.toLowerCase());
        case "email":
          return board.email.toLowerCase().includes(searchQuery.toLowerCase());
        default:
          return true;
      }
    });

    // 카테고리가 필터링되었다면 그 카테고리에 맞는 리스트만 필터링
    let finalFilteredList = selectedCategory !== "all" 
      ? filteredList.filter(board => board.category === selectedCategory)
      : filteredList;
    setFilteredBoardList(finalFilteredList); // 정렬된 게시글 리스트 상태 업데이트
    setCurrentPage(1); // 검색 후 첫 페이지로 이동
  };

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredBoardList.slice(indexOfFirstMessage, indexOfLastMessage) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalMessages = filteredBoardList.length || 0;
  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  const getPaginationRange = () => {
    const pageLimit = 5;
    const rangeStart = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    const rangeEnd = Math.min(rangeStart + pageLimit - 1, totalPages);
    return { rangeStart, rangeEnd };
  };

  const { rangeStart, rangeEnd } = getPaginationRange();


  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "itemFile") {
      setFormData((prev) => ({ ...prev, itemFile: files[0] })); // 파일 업데이트
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleDelete = async () => {
    try {
      await jwtAxios.delete(`http://localhost:8090/admin/board/delete/${selectedBoard.id}`);
      const response = await axios.get("http://localhost:8090/board/List");
      setBoardList(response.data);  // 받아온 데이터로 상태 업데이트
      setFilteredBoardList(response.data); // 초기에는 모든 게시글을 표시
      setShowModal(false);
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("email", formData.email);
  
    // 파일이 있으면 함께 추가
    if (formData.itemFile) {
      formDataToSend.append("itemFile", formData.itemFile);
    }
  
    try {
      await jwtAxios.post(`http://localhost:8090/admin/board/update`, formDataToSend);
  
      // 업데이트 후 게시글 리스트를 새로고침
      const response = await axios.get("http://localhost:8090/board/List");
      setBoardList(response.data);
      setFilteredBoardList(response.data);
      setShowModal(false); // 모달 닫기
    } catch (error) {
      console.error("게시글 업데이트 실패:", error);
    }
  };
  const handleEditClick = (board) => {
    // 선택된 게시글 데이터를 폼에 채워 넣기
    setFormData({
      id: board.id,
      title: board.title,
      content: board.content,
      category: board.category,
      email: board.email,
      itemFile: null, // 파일을 초기화. 파일 수정이 아니라면 null로 설정
    });
    setSelectedBoard(board); // 선택된 게시글 정보 저장
    setShowModal(true); // 모달 표시
  };
  
  return (
    <div>
      <h2>게시글 리스트</h2>
 


      {/* 카테고리 선택 버튼 추가 */}
      <div>
        <button 
          onClick={() => handleCategoryFilter("all")} 
          className={selectedCategory === "all" ? "active-category" : ""}
        >
          전체 게시판
        </button>
        <button 
          onClick={() => handleCategoryFilter("문의게시판")} 
          className={selectedCategory === "문의게시판" ? "active-category" : ""}
        >
          문의게시판
        </button>
        <button 
          onClick={() => handleCategoryFilter("자유게시판")} 
          className={selectedCategory === "자유게시판" ? "active-category" : ""}
        >
          자유게시판
        </button>
        <button 
          onClick={() => handleCategoryFilter("영화게시판")} 
          className={selectedCategory === "영화게시판" ? "active-category" : ""}
        >
          영화게시판
        </button>
        <button 
          onClick={() => handleCategoryFilter("공지사항")} 
          className={selectedCategory === "공지사항" ? "active-category" : ""}
        >
          공지사항
        </button>
      </div>

      {/* 검색 기능 */}
      <div>
        <select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)} // 검색 옵션 상태 업데이트
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="email">글쓴이</option>
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 검색어 상태 업데이트
        />
        <button onClick={handleSearch}>검색</button> {/* 검색 버튼 클릭 시 handleSearch 실행 */}
      </div>

        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>카테고리</th>
            <th>글쓴이</th>
            <th>조회수</th>
            <th>댓글수</th>
            <th>파일</th>
            <th>createTime</th>
            <th>updateTime</th>
            <th>수정</th>
          </tr>
        </thead>
         <tbody>
            {currentMessages.map((board) => (
              <tr key={board.id}>
                <td>{board.id}</td>
                <td>{board.title}</td>
                <td>{board.category}</td>
                <td>{board.email}</td>
                <td>{board.hit}</td>
                <td>{board.replyCount}</td>
              <td>  {board.newImgName ? (
  <img
    src={`http://localhost:8090/upload/${board.newImgName}`}
    alt={board.oldImgName}
    style={{ maxWidth: "30px", maxHeight: "18px" }}
  />
) : (
  <img
    src="http://localhost:8090/upload/default-img.jpg"  // 임시 사진 경로
    style={{ maxWidth: "30px", maxHeight: "18px" }}
  />
)}</td>
                <td>{formatDate(board.createTime)}</td>
                <td>{formatDate(board.updateTime)}</td>
                <td><button onClick={() => handleEditClick(board)}> 수정</button></td>
                </tr>  
            ))}
          </tbody>
          </table>
          {/* 페이징 처리 */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
          &lt;&lt;
          </button>
            {[...Array(rangeEnd - rangeStart + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(rangeStart + index)}
                className={currentPage === rangeStart + index ? "active" : ""}
              >
                {rangeStart + index}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
                   &gt;&gt;

            </button>
          </div>
          {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>게시글 수정</h3>
            <label>
              제목:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              카테고리:

              <select
            value={formData.category}
            onChange={handleInputChange}
            required
            name="category">
            <option value="">카테고리 선택</option>
            <option value="영화게시판">영화게시판</option>
            <option value="자유게시판">자유게시판</option>
            <option value="문의게시판">문의게시판</option>
            {loginState.roleNames?.includes("ADMIN") ? (<option value="공지사항">공지사항</option>
):( <></>)}
          </select>
            </label>
            <label>
              내용:
              <input
                type="text"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
              />
            </label>
            <label>
                파일:
             <input
             type="file"
            name="itemFile"
            onChange={handleInputChange} // 파일 입력 변경 처리
                />
            </label>

            <label>
              작성자:
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-actions">
            <button onClick={handleDelete}>게시글 삭제</button>
              <button onClick={handleUpdate}>수정 완료</button>  
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✖</button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBoard;
