import axios from "axios";


export const loginPost= async (loginParam)=>{
    const header= {headers: {"Content-Type": "x-www-form-urlencoded"}}

    const form = new FormData()
    form.append('username', loginParam.email)
    form.append('password',loginParam.pw)

    const res= await axios.post("http://localhost:8090/api/member/login", form, header)

    return res.data
}