import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/MyMemberInfo.css";
import jwtAxios from "../../util/jwtUtil";

const MyMemberInfo = () => {
  const [member, setMember] = useState(null);
  const [groupedPayments, setGroupedPayments] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);
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
    </div >
  );
};

export default MyMemberInfo;
