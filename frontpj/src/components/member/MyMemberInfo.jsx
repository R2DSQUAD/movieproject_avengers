import React, { useEffect, useState } from 'react';
import jwtAxios from '../../util/jwtUtil';
import { useNavigate } from 'react-router-dom';

const MyMemberInfo = () => {
    const [member, setMember] = useState(null);
    const navigate = useNavigate();


    const fetchMemberInfo = async () => {
        try {
            const response = await jwtAxios.get('http://localhost:8090/api/myinfo/detail');
            setMember(response.data); // 사용자 정보 상태에 저장
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/member/login', { replace: true });
            } else {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        }
    };

    useEffect(() => {
        fetchMemberInfo();
    }, []);

    return (
        <div>
            <h1>내 정보</h1>
            <div>개인정보 수정/삭제 로직 나중에 추가예정입니다</div>
            {member ? (
                <div>
                    <p><strong>이메일:</strong> {member.email}</p>
                    <p><strong>닉네임:</strong> {member.nickname}</p>
                    <p><strong>소셜 계정:</strong> {member.social ? '사용 중' : '사용 안 함'}</p>
                    <p><strong>권한:</strong> {member.roleNames.join(', ')}</p>
                </div>
            ) : (
                <p>사용자 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );
};

export default MyMemberInfo;
