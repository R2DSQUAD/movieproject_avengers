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
        <p  style={{ color: 'black'}}>{message}</p>
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
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달을 표시할지 여부를 결정
  const navigate = useNavigate();

  // Redux에서 로그인 상태 가져오기
  const loginState = useSelector((state) => state.loginSlice);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        // 서버로 GET 요청
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

  const handleDelete = async () => {
    try {
      await axios.get(`http://localhost:8090/board/delete/${id}`);
      navigate("/board"); 
    } catch (err) {
      console.error("게시글 삭제 실패", err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const openModal = () => {
    setShowModal(true); // 모달 열기
  };

  const closeModal = () => {
    setShowModal(false); // 모달 닫기
  };

  if (loading) {
    return <p>로딩 중...</p>; // 로딩 상태일 때
  }

  if (error) {
    return <p>{error}</p>; // 에러 상태일 때
  }

  // 로그인한 사용자의 이메일과 게시글 작성자의 이메일이 같거나, ADMIN 권한을 가진 경우
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
              src={`http://localhost:8090/upload/${board.newImgName}`} // "/upload/파일명"으로 이미지 요청
              alt={board.oldImgName}
              style={{ maxWidth: "300px", maxHeight: "300px" }} // 이미지 크기 조정
            />
          )}

          {/* 조건에 맞을 경우 수정 버튼과 삭제 버튼 표시 */}
          {canEdit && (
            <>
              <button onClick={() => navigate(`/board/update/${board.id}`)}>수정</button>
              <button onClick={openModal}>삭제</button>
            </>
          )}
        </div>
      ) : (
        <p>게시글을 찾을 수 없습니다.</p>
      )}

      {showModal && (
        <Modal
          message="삭제하시겠습니까?"
          onClose={closeModal}
          onConfirm={() => {
            handleDelete();
            closeModal(); // 삭제 후 모달 닫기
          }}
        />
      )}
    </div>
  );
};

export default BoardDetail;
