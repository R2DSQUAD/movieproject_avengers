"use strict";(self.webpackChunkfrontpj=self.webpackChunkfrontpj||[]).push([[395],{2395:(e,t,s)=>{s.r(t),s.d(t,{default:()=>r});var i=s(5043),c=s(6213),n=s(579);const o=()=>{const[e,t]=(0,i.useState)([]),[s,o]=(0,i.useState)(!0);return(0,i.useEffect)((()=>{c.A.get("http://43.201.20.172:8090/movie/boxoffice").then((e=>{const s=e.data.boxOfficeResult.dailyBoxOfficeList;t(s),o(!1)})).catch((e=>{console.error("Error fetching box office data:",e),o(!1)}))}),[]),s?(0,n.jsx)("div",{children:"Loading..."}):(0,n.jsxs)("div",{children:[(0,n.jsx)("h2",{children:"\ubc15\uc2a4\uc624\ud53c\uc2a4 \uc21c\uc704"}),(0,n.jsx)("ul",{children:e.map((e=>(0,n.jsxs)("li",{children:[e.rank,". ",e.movieNm," (",e.openDt,")"]},e.movieCd)))})]})},r=()=>(0,n.jsx)("div",{children:(0,n.jsx)(o,{})})}}]);
//# sourceMappingURL=395.82e7566e.chunk.js.map