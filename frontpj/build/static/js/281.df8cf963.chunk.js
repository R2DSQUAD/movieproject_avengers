/*! For license information please see 281.df8cf963.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkfrontpj=self.webpackChunkfrontpj||[]).push([[281],{4281:(e,s,r)=>{r.r(s),r.d(s,{default:()=>N});var a=r(6213),t=r(5043),i=r(1675),n=r(6772);const c=function(){for(var e=arguments.length,s=new Array(e),r=0;r<e;r++)s[r]=arguments[r];return s.filter(((e,s,r)=>Boolean(e)&&""!==e.trim()&&r.indexOf(e)===s)).join(" ").trim()};var l={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const o=(0,t.forwardRef)(((e,s)=>{let{color:r="currentColor",size:a=24,strokeWidth:i=2,absoluteStrokeWidth:n,className:o="",children:d,iconNode:m,...h}=e;return(0,t.createElement)("svg",{ref:s,...l,width:a,height:a,stroke:r,strokeWidth:n?24*Number(i)/Number(a):i,className:c("lucide",o),...h},[...m.map((e=>{let[s,r]=e;return(0,t.createElement)(s,r)})),...Array.isArray(d)?d:[d]])})),d=(e,s)=>{const r=(0,t.forwardRef)(((r,a)=>{let{className:i,...n}=r;return(0,t.createElement)(o,{ref:a,iconNode:s,className:c(`lucide-${l=e,l.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,i),...n});var l}));return r.displayName=`${e}`,r},m=d("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]),h=d("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);var v=r(579);const u=()=>{const e=(0,t.useRef)(null),[s,r]=(0,t.useState)([]),[c,l]=(0,t.useState)([]),o=(0,i.Zp)(),d=s=>{e.current&&e.current.scrollBy({left:"left"===s?-500:500,behavior:"smooth"})};(0,t.useEffect)((()=>{(async()=>{try{const e=(await a.A.get("http://43.201.20.172:8090/api/boxOfficeList")).data;r(e);const s=e[Math.floor(Math.random()*e.length)];l(s)}catch(e){console.error(e)}})()}),[]);const u=(0,n.S)(Number(c.audiAcc)||0,1500);return(0,v.jsx)("div",{className:"index",children:(0,v.jsxs)("div",{className:"index-con",children:[(0,v.jsxs)("div",{className:"title",children:[(0,v.jsx)("img",{src:c.backdrop_path,alt:c.movieNm}),(0,v.jsxs)("div",{className:"title-con",children:[(0,v.jsxs)("h1",{className:"movie-title",children:[c.movieNm,(0,v.jsx)("img",{src:"\uccad\uc18c\ub144\uad00\ub78c\ubd88\uac00"===c.watchGradeNm?"./image/18.png":"15\uc138\uc774\uc0c1\uad00\ub78c\uac00"===c.watchGradeNm?"./image/15.png":"12\uc138\uc774\uc0c1\uad00\ub78c\uac00"===c.watchGradeNm?"./image/12.png":"\uc804\uccb4\uad00\ub78c\uac00"===c.watchGradeNm?"./image/all.png":null,alt:c.watchGradeNm,className:"age-rating-icon"})," "]}),(0,v.jsx)("h4",{className:"movie-plot",children:c.overview}),(0,v.jsxs)("div",{className:"movie-info",children:[(0,v.jsxs)("h6",{className:"movie-people",children:["\ub204\uc801 \uad00\uac1d\uc218: ",u.toLocaleString("ko-KR"),"\uba85"]}),(0,v.jsxs)("h6",{className:"movie-genres",children:["\uc7a5\ub974: ",c.genres]}),(0,v.jsxs)("h6",{className:"movie-director",children:["\uac10\ub3c5: ",c.director]})]}),(0,v.jsx)("div",{className:"movieBtn",children:(0,v.jsx)("button",{onClick:()=>o(`/movie/detail/${c.movieCd}`),children:"\uc0c1\uc138\uc815\ubcf4"})})]})]}),(0,v.jsxs)("div",{className:"main-content",children:[(0,v.jsx)("h3",{children:"\uc778\uae30 \uc601\ud654"}),(0,v.jsxs)("div",{className:"popular-movie",children:[(0,v.jsx)("div",{className:"popular-movie-btn",children:(0,v.jsx)("div",{className:"left",onClick:()=>d("left"),children:(0,v.jsx)(m,{className:"w-6 h-6"})})}),(0,v.jsx)("ul",{ref:e,children:s.sort(((e,s)=>e.rank-s.rank)).map(((e,s)=>(0,v.jsxs)("li",{"data-id":e.id,children:[(0,v.jsxs)("div",{className:"item-front",children:[(0,v.jsx)("img",{src:e.poster_path,alt:e.movieNm}),(0,v.jsx)("span",{className:"movie-rank",children:e.rank})]}),(0,v.jsxs)("div",{className:"item-back",children:[(0,v.jsx)("img",{src:e.poster_path,alt:e.movieNm}),(0,v.jsxs)("div",{className:"boxOfficeDetail",children:[(0,v.jsx)("h4",{children:e.movieNm}),(0,v.jsx)("button",{onClick:()=>o(`/screening/${e.id}`),children:"\uc608\ub9e4\ud558\uae30"}),(0,v.jsx)("button",{onClick:()=>o(`/movie/detail/${e.movieCd}`),children:"\uc0c1\uc138\uc815\ubcf4"})]})]})]},s)))}),(0,v.jsx)("div",{className:"popular-movie-btn",children:(0,v.jsx)("div",{className:"right",onClick:()=>d("right"),children:(0,v.jsx)(h,{className:"w-6 h-6"})})})]})]})]})})},N=()=>(0,v.jsx)(v.Fragment,{children:(0,v.jsx)(u,{})})},6772:(e,s,r)=>{r.d(s,{S:()=>t});var a=r(5043);const t=(e,s)=>{const[r,t]=(0,a.useState)(0),i=1e3/60,n=Math.round(s/i),c=(0,a.useRef)(0);return(0,a.useEffect)((()=>{const s=setInterval((()=>{const r=1===(a=++c.current/n)?1:1-Math.pow(2,-10*a);var a;t(Math.round(e*r)),1===r&&clearInterval(s)}),i);return()=>clearInterval(s)}),[e,s]),r}}}]);
//# sourceMappingURL=281.df8cf963.chunk.js.map