import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Join = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userName, setUserName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8090/member/join', {
                userEmail,
                userPw,
                userName,
                address,
                phoneNumber
            }, {
                withCredentials: true // ✅ 쿠키 및 인증 정보 포함
            });
            if (response.status === 200) {
                alert('회원가입 성공');
                navigate('/member/login');
            }
        } catch (error) {
            alert('회원가입 실패');
            console.error(error);
        }
    };

    return (
        <div className="join-container">
            <h1>회원가입</h1>
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
            <div>
                <label>이름</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>주소</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>전화번호</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <button onClick={handleSubmit}>회원가입</button>
        </div>
    );
};

export default Join;
