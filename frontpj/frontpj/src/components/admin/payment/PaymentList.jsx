import React, { useEffect, useState } from 'react';
import jwtAxios from "../../../util/jwtUtil";
import "../../../css/admin/PaymentList.css";

const PaymentList = () => {
    const [groupedPayments, setGroupedPayments] = useState([]);
    const [searchType, setSearchType] = useState("email"); // 기본값: 이메일 검색
    const [searchValue, setSearchValue] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 개수

    useEffect(() => {
        fetchPayments();
    }, [page]); // 페이지 변경 시 재조회

    const fetchPayments = async () => {
        try {
            const params = { page, size };
            if (searchValue.trim()) {
                if (searchType === "email") {
                    params.email = searchValue;
                } else if (searchType === "paymentMethod") {
                    params.paymentMethod = searchValue;
                }
            }

            const response = await jwtAxios.get(`http://localhost:8090/admin/payment/search`, { params });

            groupPayments(response.data.content);
            setTotalPages(response.data.totalPages); // 전체 페이지 개수 업데이트
        } catch (error) {
            console.error('결제 리스트를 불러오는 중 오류 발생:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0); // 검색 시 첫 페이지로 리셋
        fetchPayments();
    };

    const groupPayments = (payments) => {
        const grouped = payments.reduce((acc, payment) => {
            const key = new Date(payment.createTime).toLocaleString();

            if (!acc[key]) {
                acc[key] = {
                    createTime: payment.createTime,
                    email: payment.email,
                    paymentMethod: payment.paymentMethod,
                    totalAmount: payment.totalAmount,
                    payments: []
                };
            }
            acc[key].payments.push(payment);
            return acc;
        }, {});

        setGroupedPayments(Object.values(grouped));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
          setPage(newPage);
        }
      };
    
      const startPage = Math.max(0, page - 2);
      const endPage = Math.min(totalPages - 1, page + 2);
      const pageNumbers = [];
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

    return (
        <div className='payment-list'>
            <h2>결제 리스트</h2>

            {/* 검색 입력 필드 */}
            <form onSubmit={handleSearch} className='search-form'>
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="email">이메일</option>
                    <option value="paymentMethod">결제 방법</option>
                </select>
                <input
                    type="text"
                    placeholder={searchType === "email" ? "이메일 입력" : "결제 방법 입력 (예: kakaopay)"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button type="submit">검색</button>
            </form>

            {/* 결제 리스트 테이블 */}
            <table border="1">
                <thead>
                    <tr>
                        <th>결제 날짜</th>
                        <th>이메일</th>
                        <th>결제 방법</th>
                        <th>총 결제 금액</th>
                        <th>영화 제목</th>
                        <th>상영일</th>
                        <th>상영 시작 시간</th>
                        <th>상영 종료 시간</th>
                        <th>좌석</th>
                    </tr>
                </thead>
                <tbody>
                    {groupedPayments.length > 0 ? (
                        groupedPayments.map((group, groupIndex) => (
                            group.payments.map((payment, index) => (
                                <tr key={`${groupIndex}-${index}`}>
                                    {index === 0 ? (
                                        <>
                                            <td rowSpan={group.payments.length}>{new Date(group.createTime).toLocaleString()}</td>
                                            <td rowSpan={group.payments.length}>{group.email || "N/A"}</td>
                                            <td rowSpan={group.payments.length}>{group.paymentMethod}</td>
                                            <td rowSpan={group.payments.length}>{group.totalAmount.toLocaleString()}원</td>
                                        </>
                                    ) : null}
                                    <td>{payment.movieNm}</td>
                                    <td>{payment.screeningDate}</td>
                                    <td>{payment.screeningTime}</td>
                                    <td>{payment.screeningEndTime}</td>
                                    <td>{payment.seatNumber}</td>
                                </tr>
                            ))
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">결제 내역이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
        <button onClick={() => handlePageChange(0)} disabled={page === 0}>
          처음
        </button>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          이전
        </button>

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={page === pageNum ? "active" : ""}
          >
            {pageNum + 1}
          </button>
        ))}

        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
          다음
        </button>
        <button onClick={() => handlePageChange(totalPages - 1)} disabled={page === totalPages - 1}>
          마지막
        </button>
      </div>
        </div>
    );
};

export default PaymentList;
