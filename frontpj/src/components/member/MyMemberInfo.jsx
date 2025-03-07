import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/MyMemberInfo.css";
import jwtAxios from "../../util/jwtUtil";

const MyMemberInfo = () => {
  const [member, setMember] = useState(null);
  const [groupedPayments, setGroupedPayments] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [updateForm, setUpdateForm] = useState({
    nickname: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const fetchMemberInfo = async () => {
    try {
      const response = await jwtAxios.get("http://localhost:8090/api/myinfo/detail");
      setMember(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/member/login", { replace: true });
      } else {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await jwtAxios.get("http://localhost:8090/api/payment/myPaymentList", { withCredentials: true });
      const payments = Array.isArray(response.data) ? response.data : [];
      const grouped = payments.reduce((acc, payment) => {
        const key = payment.createTime.substring(0, 19);
        if (!acc[key]) {
          acc[key] = { representativePayment: payment, payments: [] };
        }
        acc[key].payments.push(payment);
        return acc;
      }, {});
      setGroupedPayments(grouped);
    } catch (error) {
      console.error("결제 내역 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchMemberInfo();
    fetchPaymentHistory();
  }, []);

  const handleOpenUpdateModal = () => {
    setShowUpdateModal(true);
    setIsVerified(false);
    setCurrentPassword("");
    setUpdateForm({
      nickname: member ? member.nickname : "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleVerifyPassword = async () => {
    try {
      await jwtAxios.put("http://localhost:8090/api/myinfo/update", {
        currentPassword: currentPassword,
        nickname: member.nickname,
        newPassword: "",
      });
      setIsVerified(true);
    } catch (error) {
      alert("현재 비밀번호가 올바르지 않습니다.");
      console.error("비밀번호 검증 실패:", error);
    }
  };

  const handleUpdateMember = async () => {
    // 새 비밀번호가 입력된 경우에만 검증 진행
    if (updateForm.newPassword) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
      if (!passwordRegex.test(updateForm.newPassword)) {
        alert("비밀번호는 영문과 숫자를 포함한 8~20자여야 합니다.");
        return;
      }
      if (updateForm.newPassword !== updateForm.confirmPassword) {
        alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
      }
    }
    try {
      await jwtAxios.put("http://localhost:8090/api/myinfo/update", {
        currentPassword: currentPassword,
        nickname: updateForm.nickname,
        newPassword: updateForm.newPassword, // 만약 비어있다면 백엔드에서 비밀번호 변경 없이 닉네임만 업데이트 처리하도록 함
      });
      alert("정보가 업데이트되었습니다.");
      setShowUpdateModal(false);
      fetchMemberInfo();
    } catch (error) {
      console.error("정보 업데이트 실패:", error);
      alert("정보 업데이트에 실패했습니다.");
    }
  };
  

  return (
    <div className="memberInfo">
      <div className="userTitle">
        <span>안녕하세요!</span>
        <span>{member ? member.nickname : ""}님</span>
        <button onClick={handleOpenUpdateModal}>정보 수정하기</button>
      </div>

      {member ? (
        <div className="memberInfoContent">
          <div className="email">
            <span>이메일</span>
            <span>{member.email}</span>
          </div>
          <div className="social">
            <span>소셜 계정</span>
            <span>{member.social ? "사용 중" : "사용 안 함"}</span>
          </div>
          <div className="role">
            <span>권한</span>
            <span>{member.roleNames.join(", ")}</span>
          </div>
        </div>
      ) : (
        <span>사용자 정보를 불러오는 중입니다...</span>
      )}
{showUpdateModal && (
  <div className="modal">
    <div className="modal-content">
      {!isVerified ? (
        <div>
          <h3>현재 비밀번호 확인</h3>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호"
          />
          <div className="modal-actions">
            <button onClick={handleVerifyPassword}>확인</button>
            <button onClick={() => setShowUpdateModal(false)}>취소</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>정보 수정</h3>
          <label>닉네임 변경:</label>
          <input
            type="text"
            value={updateForm.nickname}
            onChange={(e) => setUpdateForm({ ...updateForm, nickname: e.target.value })}
          />
          <label>새로운 비밀번호:</label>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={updateForm.newPassword}
            onChange={(e) => setUpdateForm({ ...updateForm, newPassword: e.target.value })}
          />
          <label>비밀번호 확인:</label>
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={updateForm.confirmPassword}
            onChange={(e) => setUpdateForm({ ...updateForm, confirmPassword: e.target.value })}
          />
          <div className="modal-actions">
            <button onClick={handleUpdateMember}>수정 완료</button>
            <button onClick={() => setShowUpdateModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  </div>
)}


<div className="paymentHistory">
        <h3>결제 내역</h3>
        {Object.keys(groupedPayments).length > 0 ? (
          <div className="paymentList">
            {Object.entries(groupedPayments).map(([time, group], index) => (
              <div key={index} className="paymentGroup">
                <div className="paymentHeader" onClick={() => setExpandedGroup(expandedGroup === time ? null : time)}>
                  <span>{new Date(time).toLocaleDateString()} 결제</span>
                  <span className="totalAmount">{group.representativePayment.totalAmount.toLocaleString()} 원</span>
                </div>

                {expandedGroup === time && (
                  <div className="paymentDetails">
                    {group.payments.map((payment, idx) => (
                      <div key={idx} className="paymentItem">
                        <img src={payment.posterPath} alt={payment.movieNm} className="poster" />
                        <div className="paymentInfo">
                          <div>
                            <strong>영화명:</strong> {payment.movieNm}
                          </div>
                          <div>
                            <strong>영화관:</strong> {payment.cinemaName}
                          </div>
                          <div>
                            <strong>상영관:</strong> {payment.theaterName}
                          </div>
                          <div>
                            <strong>좌석:</strong> {payment.seatNumber}
                          </div>
                          <div>
                            <strong>상영일:</strong> {payment.screeningDate} {payment.screeningTime} ~ {payment.screeningEndTime}
                          </div>
                          <div>
                            <strong>결제 방법:</strong> {payment.paymentMethod}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span>결제 내역이 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default MyMemberInfo;
