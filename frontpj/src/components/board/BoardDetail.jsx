import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import '../../css/BoardDetail.css'; // CSS 파일 import

// 모달 컴포넌트
const Modal = ({ message, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p style={{ color: 'black' }}>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-confirm-button">예</button>
          <button onClick={onClose} className="modal-cancel-button">아니오</button>
        </div>
      </div>
    </div>
  );
};

const BoardDetail = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [messagesPerPage] = useState(5); // 페이지당 게시글 수
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 게시글 삭제 모달 상태
  const [showReplyDeleteModal, setShowReplyDeleteModal] = useState(false); // 댓글 삭제 모달 상태
  const [replyToDelete, setReplyToDelete] = useState(null); // 삭제할 댓글 정보
  const [replies, setReplies] = useState([]);// 댓글 리스트 상태
  const navigate = useNavigate();

  // Redux에서 로그인 상태 가져오기
  const loginState = useSelector((state) => state.loginSlice);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/board/detail/${id}`);
        setBoard(response.data);
        setLoading(false);
      } catch (err) {
        console.error("게시글 상세 정보 불러오기 실패", err);
        setError("게시글 상세 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, [id]);

  useEffect(() => {
    const fetchReplyList = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/api/reply/replyList/${id}`);
        setReplies(response.data.replyList);
      } catch (err) {
        console.error("댓글 리스트 불러오기 실패", err);
      }
    };

    fetchReplyList();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.post(`http://localhost:8090/board/delete/${id}`);
      navigate("/board");
    } catch (err) {
      console.error("게시글 삭제 실패", err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = replies.slice(indexOfFirstMessage, indexOfLastMessage) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalMessages = replies.length || 0;
  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  const getPaginationRange = () => {
    const pageLimit = 5;
    const rangeStart = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    const rangeEnd = Math.min(rangeStart + pageLimit - 1, totalPages);
    return { rangeStart, rangeEnd };
  };

  const { rangeStart, rangeEnd } = getPaginationRange();

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const openReplyDeleteModal = (reply) => {
    setReplyToDelete(reply);
    setShowReplyDeleteModal(true);
  };

  const closeReplyDeleteModal = () => {
    setShowReplyDeleteModal(false);
    setReplyToDelete(null);
  };
  
  const replyDelete = async () => {
    if (!replyToDelete) return;
    try {
      await axios.post(`http://localhost:8090/api/reply/delete/${replyToDelete.id},${id}`);
      const replyListResponse = await axios.get(`http://localhost:8090/api/reply/replyList/${id}`);
      setReplies(replyListResponse.data.replyList);
      closeReplyDeleteModal();
    } catch (err) {
      console.error("댓글 삭제 실패", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };
  const handleLike = async (replyId) => {
    const reply = replies.find((r) => r.id === replyId);
  
    // 사용자가 이미 좋아요를 눌렀다면, unlike 요청을 보냄
    if (reply.replyLikeEntities.some((like) => like.email === loginState.email)) {
      try {
        await axios.post(`http://localhost:8090/api/reply/unlike?replyId=${replyId}&email=${loginState.email}`);
  
        // 서버에서 좋아요 취소 성공 후, UI 상태 업데이트
        setReplies((prevReplies) =>
          prevReplies.map((r) =>
            r.id === replyId
              ? {
                  ...r,
                  replyLikeEntities: r.replyLikeEntities.filter((like) => like.email !== loginState.email),
                }
              : r
          )
        );
        const replyListResponse = await axios.get(`http://localhost:8090/api/reply/replyList/${id}`);
        setReplies(replyListResponse.data.replyList);
      } catch (err) {
        console.error("좋아요 취소 실패", err);
        alert("좋아요 취소에 실패했습니다.");
      }
    } else {
      // 좋아요가 눌리지 않은 상태라면, like 요청을 보냄
      try {
        await axios.post(`http://localhost:8090/api/reply/like?replyId=${replyId}&email=${loginState.email}`);
  
        // 서버에서 좋아요 추가 성공 후, UI 상태 업데이트
        setReplies((prevReplies) =>
          prevReplies.map((r) =>
            r.id === replyId
              ? {
                  ...r,
                  replyLikeEntities: [...r.replyLikeEntities, { email: loginState.email }],
                }
              : r
          )
        );

        const replyListResponse = await axios.get(`http://localhost:8090/api/reply/replyList/${id}`);
        setReplies(replyListResponse.data.replyList);
      } catch (err) {
        console.error("좋아요 실패", err);
        alert("좋아요 처리에 실패했습니다.");
      }
    }
  };
  
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      boardId: id,
      replyContent: content,
      email: loginState.email,
    };

    try {
      const response = await axios.post("http://localhost:8090/api/reply/write", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const replyListResponse = await axios.get(`http://localhost:8090/api/reply/replyList/${id}`);
      setReplies(replyListResponse.data.replyList);
      setContent("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}년-${month}월-${day}일 ${hours}시:${minutes}분:${seconds}초`;
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const canEdit = loginState.email === board?.email || loginState.roleNames?.includes("ADMIN");

  return (
    <div>
      {board ? (
        <div>
          <h3>{board.title}</h3>
          <p>{board.content}</p>
          <p>카테고리: {board.category}</p>
          <p>글쓴이: {board.email}</p>
          <p>조회수: {board.hit}</p>
          {board.newImgName && (
            <img
              src={`http://localhost:8090/upload/${board.newImgName}`}
              alt={board.oldImgName}
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          )}

          {canEdit && (
            <>
              <button onClick={() => navigate(`/board/update/${board.id}`)}>수정</button>
              <button onClick={openDeleteModal}>삭제</button>
            </>
          )}
        </div>
      ) : (
        <p>게시글을 찾을 수 없습니다.</p>
      )}

      {/* 게시글 삭제 모달 */}
      {showDeleteModal && (
        <Modal
          message="게시글을 삭제하시겠습니까?"
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      )}

      {/* 댓글 삭제 모달 */}
      {showReplyDeleteModal && (
        <Modal
          message="댓글을 삭제하시겠습니까?"
          onClose={closeReplyDeleteModal}
          onConfirm={replyDelete}
        />
      )}

      {/* 댓글 작성 */}
      {loginState.email ? (
      <div>
        <h2>댓글 작성</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ color: 'white' }}>
            <label>내용:</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit">입력</button>
        </form>
      </div>
) : null}

  {/* 댓글 목록 */}
<div>
  <h2>댓글 목록</h2>
  {replies.length === 0 ? (
    <p>댓글이 없습니다.</p>
  ) : (
    <>
      <ul>
        {currentMessages.map((reply) => (
          <li key={reply.id}>
            <p>작성자: {reply.email}</p>
            <p>내용: {reply.replyContent}</p>
            <p>작성일: {formatDate(reply.createTime)}</p>
            <p>좋아요: {reply.likeCount}개</p>
            {/* 좋아요 버튼 */}
                  {loginState.email ? (

            <button
  onClick={() => handleLike(reply.id)}
  style={{
    backgroundColor: reply.replyLikeEntities?.some(
      (like) => like.email === loginState.email // 이메일 비교
    )
      ? "blue"
      : "gray", // 좋아요를 누른 상태일 경우 파란색, 그렇지 않으면 회색
    color: "white",
  }}
>
  {reply.replyLikeEntities?.some(
    (like) => like.email === loginState.email // 이메일 비교
  )
    ? "좋아요 취소"
    : "좋아요"}
</button>
) : null}


            {/* 댓글 삭제 버튼 (권한 확인) */}
            {(loginState.email === reply.email || loginState.roleNames?.includes("ADMIN")) && (
              <button onClick={() => openReplyDeleteModal(reply)}>삭제</button>
            )}
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
        ) }
      </div>
    </div>
  );
};

export default BoardDetail;
