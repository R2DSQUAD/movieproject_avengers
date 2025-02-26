import { useEffect, useState } from "react";
import axios from "axios";
import "../../../css/admin/MemberList.css"; 

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8090/api/memberList")
      .then((res) => {
        setMembers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("회원 목록을 불러오는 중 오류 발생");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="member-list">
      <h2>회원 목록</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>소셜 로그인</th>
            <th>역할</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.email}>
              <td>{index + 1}</td>
              <td>{member.nickname}</td>
              <td>{member.email}</td>
              <td>{member.social ? "O" : "X"}</td>
              <td>{member.roles.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberList;
