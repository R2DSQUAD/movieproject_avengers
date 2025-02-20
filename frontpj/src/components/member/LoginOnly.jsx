import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginOnly = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPw, setUserPw] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8090/member/join', {
                userEmail,
                userPw
            });
            if (response.status === 200) {
                alert('로그인 성공');
                navigate('/');
            }
        } catch (error) {
            alert('로그인 실패');
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <h1>로그인</h1>
            <div>
                <label>이메일</label>
                <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>비밀번호</label>
                <input
                    type="password"
                    value={userPw}
                    onChange={(e) => setUserPw(e.target.value)}
                    required
                />
            </div>
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
};

export default LoginOnly;
