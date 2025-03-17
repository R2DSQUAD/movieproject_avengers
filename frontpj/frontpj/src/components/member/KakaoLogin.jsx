import React from 'react'
import { Link } from 'react-router-dom'
import { getKakaoLoginLink } from '../../api/kakaoApi'

const KakaoLogin = () => {
  const link = getKakaoLoginLink()

  return (
    <>
      <Link to={link}>KAKAO LOGIN</Link>
    </>
  )
}

export default KakaoLogin