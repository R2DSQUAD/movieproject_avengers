"use strict";(self.webpackChunkfrontpj=self.webpackChunkfrontpj||[]).push([[613],{6613:(e,r,t)=>{t.r(r),t.d(r,{default:()=>o});var s=t(5043),n=t(9320),a=t(579);const c=()=>{const[e,r]=(0,s.useState)("");return(0,s.useEffect)((()=>{(async()=>{try{const e=await n.A.get("http://43.201.20.172:8090/api/test");r(e.data.admin)}catch(e){console.error("Error fetching data:",e),r("\uc811\uadfc \uad8c\ud55c\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.")}})()}),[]),(0,a.jsx)("div",{children:(0,a.jsx)("h1",{children:e})})},o=()=>(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(c,{})})},9320:(e,r,t)=>{t.d(r,{A:()=>c});var s=t(6213),n=t(8056);const a=s.A.create();a.interceptors.request.use((e=>{const r=(0,n.Ri)("member");if(!r)return Promise.reject({response:{data:{error:"REQUIRE_LOGIN"}}});const{accessToken:t}=r;return e.headers.Authorization=`Bearer ${t}`,e}),(e=>Promise.reject(e))),a.interceptors.response.use((async e=>{const r=e.data;if(r&&"ERROR_ACCESS_TOKEN"===r.error){const r=(0,n.Ri)("member"),t=await(async(e,r)=>{const t={headers:{Authorization:`Bearer ${e}`}};return(await s.A.get(`http://43.201.20.172:8090/api/member/refresh?refreshToken=${r}`,t)).data})(r.accessToken,r.refreshToken);r.accessToken=t.accessToken,r.refreshToken=t.refreshToken,(0,n.TV)("member",JSON.stringify(r),1);const a=e.config;return a.headers.Authorization=`Bearer ${t.accessToken}`,await(0,s.A)(a)}return e}),(e=>Promise.reject(e)));const c=a}}]);
//# sourceMappingURL=613.3e6a3783.chunk.js.map