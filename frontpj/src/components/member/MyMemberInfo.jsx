import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/MyMemberInfo.css";
import jwtAxios from "../../util/jwtUtil";

const MyMemberInfo = () => {
  const [member, setMember] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const navigate = useNavigate();


  const fetchMemberInfo = async () => {
    try {
      const response = await jwtAxios.get(
        "http://localhost:8090/api/myinfo/detail"
      );
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
      const response = await jwtAxios.get(
        "http://localhost:8090/api/payment/myPaymentList",
        { withCredentials: true }
      );
      setPaymentHistory(Array.isArray(response.data) ? response.data : []); // 배열이 아닐 경우 빈 배열로 설정
    } catch (error) {
      console.error("결제 내역 가져오는 중 오류 발생:", error);
    }
  };


  useEffect(() => {
    fetchMemberInfo();
    fetchPaymentHistory();
  }, []);

  return (
    <div className="memberInfo">
      <div className="userTitle">
        <span>안녕하세요!</span>
        <span>{member ? member.nickname : ""}님</span>
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

      <div className="paymentHistory">
        <h3>결제 내역</h3>
        {paymentHistory.length > 0 ? (
          <div className="paymentList">
            {paymentHistory.map((payment, index) => (
              <div key={index} className="paymentItem">
                <img
                  src={payment.posterPath}
                  alt={payment.movieNm}
                  style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                />
                <div>영화명: {payment.movieNm}</div>
                <div>영화관: {payment.cinemaName}</div>
                <div>상영관: {payment.theaterName}</div>
                <div>좌석 번호: {payment.seatNumber}</div>
                <div>상영 날짜: {payment.screeningDate}</div>
                <div>상영 시간: {payment.screeningTime}~{payment.screeningEndTime}</div>
                <div>결제 금액: {payment.totalAmount.toLocaleString()} 원</div>
                <div>결제 방법: {payment.paymentMethod}</div>
                <div>결제 일시: {payment.createTime}</div>
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
