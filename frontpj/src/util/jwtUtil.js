import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";

const jwtAxios=axios.create()

const refreshJWT= async (accessToken, refreshToken)=>{
    const header= {headers: {"Authorization": `Bearer ${accessToken}`}}
    const res = await axios.get(`http://43.201.20.172:8090/api/member/refresh?refreshToken=${refreshToken}`, header)

    return res.data
}

const beforeReq= (config) =>{
    const memberInfo=getCookie("member")
    if(!memberInfo){
        return Promise.reject(
            {response:
             {data: 
              {error: "REQUIRE_LOGIN"}
                }
            }
        )
    }
    const {accessToken} = memberInfo
    config.headers.Authorization= `Bearer ${accessToken}`
    return config
}

const requestFail=(err)=>{
    return Promise.reject(err)
}

const beforeRes=async (res)=>{

    const data= res.data
    if(data && data.error ==='ERROR_ACCESS_TOKEN'){
        const memberCookieValue=getCookie("member")
        const result=await refreshJWT(memberCookieValue.accessToken,
            memberCookieValue.refreshToken)
        memberCookieValue.accessToken=result.accessToken
        memberCookieValue.refreshToken=result.refreshToken

        setCookie("member", JSON.stringify(memberCookieValue), 1)

        const originalRequest=res.config
        originalRequest.headers.Authorization= `Bearer ${result.accessToken}`

        return await axios(originalRequest)
    }


    return res
}

const responseFail=(err)=>{
    return Promise.reject(err)
}

jwtAxios.interceptors.request.use( beforeReq, requestFail)
jwtAxios.interceptors.response.use(beforeRes,responseFail)

export default jwtAxios