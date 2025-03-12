import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Board.css";
import { useSelector } from "react-redux";

const BoardList = () => {
  const [boardList, setBoardList] = useState([]); // 전체 게시글 리스트 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [filteredBoardList, setFilteredBoardList] = useState([]); // 필터링된 게시글 리스트
  const [searchOption, setSearchOption] = useState("title"); // 검색 항목 (제목, 내용, 글쓴이)
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [messagesPerPage] = useState(5); // 페이지당 게시글 수
  const [selectedCategory, setSelectedCategory] = useState("all"); // 선택된 카테고리
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.loginSlice);

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get("http://localhost:8090/board/List");
        const sortedBoardList = response.data.sort((a, b) => {
          const timeA = a.updateTime || a.createTime; // updateTime이 있으면 updateTime을 사용
          const timeB = b.updateTime || b.createTime; // updateTime이 있으면 updateTime을 사용
          return new Date(timeB) - new Date(timeA); // 최신순으로 정렬
        });
        setBoardList(sortedBoardList);  // 받아온 데이터로 상태 업데이트
        setFilteredBoardList(sortedBoardList); // 초기에는 모든 게시글을 표시
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

    // 게시글을 createTime 또는 updateTime을 기준으로 최신순으로 정렬
    filtered.sort((a, b) => {
      const timeA = a.updateTime || a.createTime;
      const timeB = b.updateTime || b.createTime;
      return new Date(timeB) - new Date(timeA); // 최신순으로 정렬
    });

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

    finalFilteredList.sort((a, b) => {
      const timeA = a.updateTime || a.createTime;
      const timeB = b.updateTime || b.createTime;
      return new Date(timeB) - new Date(timeA); // 최신순으로 정렬
    });

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

  const handleCreatePost = () => {
    if (!loginState.email) {
      // 로그인되어 있지 않으면 로그인 페이지로 이동
      navigate('/member/login');
    } else {
      // 로그인되어 있으면 게시글 작성 페이지로 이동
      navigate('/board/insert');
    }
  };

  return (
    <div>
      <h2>게시글 리스트</h2>
  <div>
  <button onClick={handleCreatePost} className="nav-link">
        게시글 작성
      </button>
  </div>


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

      {filteredBoardList.length === 0 ? (  
        <p>등록된 게시글이 없습니다.</p>
      ) : (
        <>
          <ul>
            {currentMessages.map((board) => (
              <li key={board.id}>
                <h3>제목: {board.title}</h3>
                <p>카테고리: {board.category}</p>
                <p>글쓴이(이메일): {board.email}</p>
                <p>글쓴이(닉네임): {board.memberNickName}</p>
                <p>조회수: {board.hit}</p>
                <p>댓글수: {board.replyCount}</p>
                {board.updateTime !== null ? (
                  <p>업로드시간: {formatDate(board.updateTime)}</p>
                ) : (
                  <p>업로드시간: {formatDate(board.createTime)}</p>
                )}
                <button
                  onClick={() => navigate(`/board/detail/${board.id}`)}
                >
                  보기
                </button>
                <hr />
              </li>
            ))}
          </ul>

          {/* 페이징 처리 */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              맨 처음
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              이전
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
              다음
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              맨 끝
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default BoardList;
