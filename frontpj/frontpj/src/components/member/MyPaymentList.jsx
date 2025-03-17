import React, { useEffect, useState } from "react";
import jwtAxios from "../../util/jwtUtil";
import "./../../css/MyPaymentList.css";

const MyPaymentList = () => {
  const [groupedPayments, setGroupedPayments] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);

  const paymentMethodLabels = {
    kakaoPay: '카카오페이',
    tossPay: '토스페이',
    credit_card: '신용카드',
    mobile: '휴대폰',
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await jwtAxios.get(
        "http://localhost:8090/api/payment/myPaymentList",
        { withCredentials: true }
      );
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
    fetchPaymentHistory();
  }, []);

  return (
    <div className="paymentHistoryContainer">
      <div className="paymentHistory">
        <h3>결제 내역</h3>
        {Object.keys(groupedPayments).length > 0 ? (
          <div className="paymentList">
            {Object.entries(groupedPayments).map(([time, group], index) => (
              <div key={index} className="paymentGroup">
                <div
                  className="paymentHeader"
                  onClick={() =>
                    setExpandedGroup(expandedGroup === time ? null : time)
                  }
                >
                  <span>{new Date(time).toLocaleDateString()} 결제</span>
                  <span className="totalAmount">
                    {group.representativePayment.totalAmount.toLocaleString()}{" "}
                    원
                  </span>
                </div>

                {expandedGroup === time && (
                  <div className="paymentDetails">
                    {group.payments.map((payment, idx) => (
                      <div key={idx} className="paymentItem">
                        <img
                          src={payment.posterPath}
                          alt={payment.movieNm}
                          className="poster"
                        />
                        <div className="paymentInfo">
                          <div>
                            <span>{payment.movieNm}</span>
                          </div>
                          <div>
                            <span className="paymentCinema-title">{payment.cinemaName} Frame In</span> <span>{payment.theaterName}</span> <span>{payment.seatNumber}</span>
                          </div>
                          <div>
                            <span>상영일:</span> <span>{payment.screeningDate}{" "}</span>
                            <span>{payment.screeningTime} ~ {payment.screeningEndTime}</span>
                          </div>
                          <div>
                            <span>결제 방법:</span> <span>{paymentMethodLabels[payment.paymentMethod]}</span>
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

export default MyPaymentList;
