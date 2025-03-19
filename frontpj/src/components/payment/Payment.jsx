import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jwtAxios from "../../util/jwtUtil";
import "../../css/Payment.css";

const Payment = () => {
  const [paymentItems, setPaymentItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemIds = location.state?.cartItemIds || [];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await jwtAxios.get(
          "http://43.201.20.172:8090/api/myinfo/detail",
          {
            withCredentials: true,
          }
        );
        console.log(" 사용자 정보:", response.data);
        setUserInfo(response.data);
      } catch (error) {
        console.error(" 사용자 정보 가져오기 오류:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchPaymentItems = async () => {
      try {
        const response = await jwtAxios.post(
          "http://43.201.20.172:8090/api/payment/orderSettlement",
          cartItemIds,
          { withCredentials: true }
        );
        console.log(" 결제 정보:", response.data);
        setPaymentItems(response.data);
      } catch (error) {
        console.error("결제 정보 가져오기 오류:", error);
      }
    };

    if (cartItemIds.length > 0) {
      fetchPaymentItems();
    }
  }, [cartItemIds]);

  const totalPrice = paymentItems.reduce(
    (total, item) => total + item.price,
    0
  );

  const paymentGo = async () => {
    if (!paymentMethod) {
      alert("결제 수단을 선택하세요.");
      return;
    }

    if (!userInfo) {
      alert("로그인 정보가 없습니다. 다시 로그인하세요.");
      return;
    }

    if (cartItemIds.length === 0) {
      alert("결제할 항목이 없습니다.");
      return;
    }

    console.log(" 장바구니 항목 ID:", cartItemIds);

    const { IMP } = window;
    IMP.init("imp06751501");

    let pgProvider = "";
    switch (paymentMethod) {
      case "kakaoPay":
        pgProvider = "kakaopay.TC0ONETIME";
        break;
      case "credit_card":
        pgProvider = "html5_inicis.INIBillTst";
        break;
      case "tossPay":
        pgProvider = "uplus.tlgdacomxpay";
        break;
      case "mobile":
        pgProvider = "danal_tpay.9810030929";
        break;
      default:
        alert("올바른 결제 수단을 선택하세요.");
        return;
    }

    console.log(" 선택한 PG사:", pgProvider);

    const merchantUid = `order_${new Date().getTime()}`;

    IMP.request_pay(
      {
        pg: pgProvider,
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "영화 예매",
        amount: totalPrice,
        buyer_email: userInfo.email,
        buyer_name: userInfo.nickname,
      },
      async (response) => {
        if (response.success) {
          console.log(" 결제 성공:", response);

          try {
            console.log(" 결제 검증 요청 시작:", response.imp_uid);
            const verifyResponse = await jwtAxios.post(
              "http://43.201.20.172:8090/api/payment/verify",
              {
                imp_uid: response.imp_uid,
                amount: totalPrice,
              },
              { withCredentials: true }
            ); //  이 설정이 없으면 CORS 에러 가능

            console.log(" 결제 검증 결과:", verifyResponse.data);

            if (verifyResponse.data === "결제 검증 성공") {
              console.log(" 결제 정보 저장 요청 시작");
              const saveResponse = await jwtAxios.post(
                "http://43.201.20.172:8090/api/payment/save",
                {
                  cartItemIds: cartItemIds,
                  paymentMethod: paymentMethod,
                  totalPrice: totalPrice,
                }
              );

              console.log(" 결제 저장 결과:", saveResponse.data);
              alert("결제가 완료되었습니다.");
              navigate("/");
            } else {
              alert(" 결제 검증 실패");
            }
          } catch (error) {
            console.error(" 결제 검증 또는 저장 오류:", error);
            alert("결제 처리 중 오류가 발생했습니다.");
          }
        } else {
          console.error(" 결제 실패:", response.error_msg);
          alert(`결제 실패: ${response.error_msg}`);
        }
      }
    );
  };
  return (
    <div className="payment">
      <h1>결제 페이지</h1>
      <div className="payment-con">
        <div className="reservation">
          <h3>예매 정보</h3>
          {paymentItems.length > 0 ? (
            paymentItems.map((item, index) => (
              <div key={index} className="payment-item">
                <img
                  src={item.poster_path}
                  alt={item.movieNm}
                />
                <div className="movieDetail">
                  <span> 영화: {item.movieNm}</span>
                  <span> 상영 날짜: {item.screeningDate}</span>
                  <span> 상영 시간: {item.screeningTime}</span>
                  <span> 상영관: {item.theaterName}</span>
                  <span> 좌석 번호: {item.seatNumber}</span>
                  <span> 가격: {item.price.toLocaleString()} 원</span>
                  <span> 영화관: {item.cinemaName}</span>
                </div>
              </div>
            ))
          ) : (
            <p>결제할 항목이 없습니다.</p>
          )}
        </div>

        <div className="payment-selection">
          <h3>결제수단</h3>
          <div className="payment-method-con">
            <div className="payment-method">
              <button
                className={paymentMethod === "credit_card" ? "selected" : ""}
                onClick={() => setPaymentMethod("credit_card")}
              >
                신용카드
              </button>

              <button
                className={paymentMethod === "kakaoPay" ? "selected" : ""}
                onClick={() => setPaymentMethod("kakaoPay")}
              >
                카카오페이
              </button>

              <button
                className={paymentMethod === "tossPay" ? "selected" : ""}
                onClick={() => setPaymentMethod("tossPay")}
              >
                토스페이
              </button>

              <button
                className={paymentMethod === "mobile" ? "selected" : ""}
                onClick={() => setPaymentMethod("mobile")}
              >
                휴대폰
              </button>
            </div>
            <div className="payment-motion">
              {paymentMethod === "credit_card" && (
                <div className="credit-card-motion">
                  <div className="credit-card-inner">
                    <div className="credit-card-front">
                      <div className="front-chip">
                        <img
                          src="./../image/chip.png"
                          alt="chip"
                          className="chip"
                        />
                      </div>
                    </div>
                    <div className="credit-card-back">
                      <div className="credit-card-back-inner"></div>
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === "kakaoPay" && (
                <div className="kakaoPay-motion">
                  <div className="kakaoPay-inner">
                    <div className="kakaoPay-front">
                      <img
                        src="./../image/kakaoPayCard.png"
                        alt="card"
                        className="card"
                      />
                    </div>
                    <div className="kakaoPay-back">
                      <div className="kakaoPay-back-inner"></div>
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === "tossPay" && (
                <div className="tossPay-motion">
                  <div className="tossPay-inner">
                    <div className="tossPay-front">
                      <video
                        autoPlay
                        loop
                        muted
                        className="tossPay-video"
                        src="./../video/tossMotion_dark.mp4"
                      />
                    </div>
                    <div className="tossPay-back">
                      <video
                        autoPlay
                        loop
                        muted
                        className="tossPay-video"
                        src="./../video/tossMotion_light.mp4"
                      />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === "mobile" && (
                <div className="mobile-motion">
                  <div className="mobile-inner">
                    <div className="mobile-front">
                      <div className="mobile-front-inner">
                        <div className="notch"></div>
                      </div>
                    </div>
                    <div className="mobile-back">
                      <div className="mobile-back-camera"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="payment-go">
          <div className="payment-go-top">
          </div>
          <div className="payment-footer">
            <h2>결제 금액: {totalPrice.toLocaleString()} 원</h2>
            <button onClick={paymentGo}>결제하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
