import React, { useEffect } from 'react'
import { data, useNavigate, useSearchParams } from 'react-router-dom'
import { getAccessToken, getMemberWithAccessToken } from '../../api/kakaoApi'
import { useDispatch } from 'react-redux'
import { login } from '../../slices/loginSlice'

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authCode = searchParams.get("code")

  useEffect(() => {
    getAccessToken(authCode).then(accessToken => {
      console.log(accessToken)
      getMemberWithAccessToken(accessToken).then(memberInfo => {
        dispatch(login(memberInfo))
        navigate("/", { replace: true });
      })
    })
  }, [authCode])


  return (
    <div>
      {/* <div>Kakao Login Redirect</div> */}
      {/* <div>{authCode}</div> */}
    </div>
  )
}

export default KakaoRedirectPage