"use strict";(self.webpackChunkfrontpj=self.webpackChunkfrontpj||[]).push([[445],{9320:(e,a,t)=>{t.d(a,{A:()=>i});var s=t(6213),r=t(8056);const n=s.A.create();n.interceptors.request.use((e=>{const a=(0,r.Ri)("member");if(!a)return Promise.reject({response:{data:{error:"REQUIRE_LOGIN"}}});const{accessToken:t}=a;return e.headers.Authorization=`Bearer ${t}`,e}),(e=>Promise.reject(e))),n.interceptors.response.use((async e=>{const a=e.data;if(a&&"ERROR_ACCESS_TOKEN"===a.error){const a=(0,r.Ri)("member"),t=await(async(e,a)=>{const t={headers:{Authorization:`Bearer ${e}`}};return(await s.A.get(`http://43.201.20.172:8090/api/member/refresh?refreshToken=${a}`,t)).data})(a.accessToken,a.refreshToken);a.accessToken=t.accessToken,a.refreshToken=t.refreshToken,(0,r.TV)("member",JSON.stringify(a),1);const n=e.config;return n.headers.Authorization=`Bearer ${t.accessToken}`,await(0,s.A)(n)}return e}),(e=>Promise.reject(e)));const i=n},9445:(e,a,t)=>{t.r(a),t.d(a,{default:()=>c});var s=t(5043),r=t(3003),n=t(1675),i=t(9320),o=t(579);const l=()=>{var e;const{id:a}=(0,n.g)(),t=(0,n.Zp)(),[l,c]=(0,s.useState)(""),[d,p]=(0,s.useState)(""),[u,h]=(0,s.useState)(""),[m,j]=(0,s.useState)(null),[x,f]=(0,s.useState)(""),[g,v]=(0,s.useState)(!0),[b,y]=(0,s.useState)(null),[N,k]=(0,s.useState)(""),S=(0,r.d4)((e=>e.loginSlice));(0,s.useEffect)((()=>{if(a){(async()=>{try{const e=await i.A.get(`http://43.201.20.172:8090/board/detail/${a}`);c(e.data.title),p(e.data.category),h(e.data.content),j(e.data.itemFile),k(e.data.itemFile),v(!1)}catch(e){console.error("\uac8c\uc2dc\uae00 \uc0c1\uc138 \uc815\ubcf4 \ubd88\ub7ec\uc624\uae30 \uc2e4\ud328",e),y("\uac8c\uc2dc\uae00 \uc0c1\uc138 \uc815\ubcf4\ub97c \ubd88\ub7ec\uc624\ub294 \ub370 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4."),v(!1)}})()}else v(!1)}),[a]);return g?(0,o.jsx)("p",{children:"\ub85c\ub529 \uc911..."}):b?(0,o.jsx)("p",{children:b}):(0,o.jsxs)("div",{className:"boardUpdate",children:[(0,o.jsx)("h2",{children:a?"\uac8c\uc2dc\uae00 \uc218\uc815":"\uac8c\uc2dc\uae00 \ucd94\uac00"}),(0,o.jsxs)("form",{onSubmit:async e=>{e.preventDefault();const s=new FormData;s.append("id",a),s.append("title",l),s.append("content",u),s.append("category",d),s.append("email",S.email),m&&s.append("itemFile",m),s.append("originFileName",N);try{const e=await i.A.post("http://43.201.20.172:8090/board/update",s);f(e.data)}catch(b){f("\uac8c\uc2dc\uae00 \uc218\uc815\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4."),console.error("Error:",b)}t("/board")},children:[(0,o.jsxs)("div",{className:"board-title",children:[(0,o.jsx)("span",{children:"\uc81c\ubaa9"}),(0,o.jsx)("input",{type:"text",value:l,onChange:e=>c(e.target.value),required:!0})]}),(0,o.jsxs)("div",{className:"board-category",children:[(0,o.jsx)("span",{children:"\uce74\ud14c\uace0\ub9ac"}),(0,o.jsxs)("select",{value:d,onChange:e=>p(e.target.value),required:!0,children:[(0,o.jsx)("option",{value:"",children:"\uce74\ud14c\uace0\ub9ac \uc120\ud0dd"}),(0,o.jsx)("option",{value:"\uc601\ud654\uac8c\uc2dc\ud310",children:"\uc601\ud654\uac8c\uc2dc\ud310"}),(0,o.jsx)("option",{value:"\uc790\uc720\uac8c\uc2dc\ud310",children:"\uc790\uc720\uac8c\uc2dc\ud310"}),(0,o.jsx)("option",{value:"\ubb38\uc758\uac8c\uc2dc\ud310",children:"\ubb38\uc758\uac8c\uc2dc\ud310"}),null!==(e=S.roleNames)&&void 0!==e&&e.includes("ADMIN")?(0,o.jsx)("option",{value:"\uacf5\uc9c0\uc0ac\ud56d",children:"\uacf5\uc9c0\uc0ac\ud56d"}):(0,o.jsx)(o.Fragment,{})]})]}),(0,o.jsxs)("div",{className:"board-content",children:[(0,o.jsx)("span",{children:"\ub0b4\uc6a9"}),(0,o.jsx)("textarea",{value:u,onChange:e=>h(e.target.value),required:!0})]}),(0,o.jsxs)("div",{className:"board-upload",children:[(0,o.jsx)("span",{children:"\ud30c\uc77c"}),(0,o.jsx)("input",{type:"file",id:"file-upload",onChange:e=>{const a=e.target.files[0];if(a){const t=["jpg","jpeg","png","gif","bmp","svg"],s=a.name.split(".").pop().toLowerCase();if(!t.includes(s))return alert("\ud5c8\uc6a9\ub418\uc9c0 \uc54a\uc740 \ud30c\uc77c \ud615\uc2dd\uc785\ub2c8\ub2e4."),e.target.value="",void j(null);j(a)}},style:{display:"none"}}),(0,o.jsxs)("div",{className:"file-upload",children:[(0,o.jsx)("label",{htmlFor:"file-upload",className:"upload-btn",children:"\ud30c\uc77c \uc120\ud0dd"}),(0,o.jsx)("span",{id:"file-name-display",children:m?`${m.name}`:N?`${N}`:""})]})]}),(0,o.jsx)("button",{type:"submit",className:"board-submit",children:a?"\uac8c\uc2dc\uae00 \uc218\uc815":"\uac8c\uc2dc\uae00 \ucd94\uac00"})]}),x&&(0,o.jsx)("span",{children:x})]})},c=()=>(0,o.jsx)(l,{})}}]);
//# sourceMappingURL=445.a8d44059.chunk.js.map