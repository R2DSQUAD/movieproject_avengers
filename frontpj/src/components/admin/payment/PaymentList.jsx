import React, { useEffect, useState } from 'react';
import jwtAxios from "../../../util/jwtUtil";

const PaymentList = () => {
    const [groupedPayments, setGroupedPayments] = useState([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await jwtAxios.get('http://localhost:8090/admin/payment/paymentList');
            groupPayments(response.data);
        } catch (error) {
            console.error('결제 리스트를 불러오는 중 오류 발생:', error);
        }
    };

    const groupPayments = (payments) => {
        const grouped = payments.reduce((acc, payment) => {
            const key = new Date(payment.createTime).toLocaleString(); // 결제 날짜 및 시간 기준으로 그룹화

            if (!acc[key]) {
                acc[key] = {
                    createTime: payment.createTime,
                    email: payment.email, // 결제한 사람 이메일 추가
                    paymentMethod: payment.paymentMethod,
                    totalAmount: payment.totalAmount, // 첫 번째 항목의 결제 금액 사용
                    payments: []
                };
            }
            acc[key].payments.push(payment);
            return acc;
        }, {});

        setGroupedPayments(Object.values(grouped));
    };

    return (
        <div>
            <h2>결제 리스트</h2>
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
                                            <td rowSpan={group.payments.length}>{group.email}</td>
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
        </div>
    );
};

export default PaymentList;
