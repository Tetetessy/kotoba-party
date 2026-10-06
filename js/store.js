// 保存・アカウント（この端末のlocalStorageに保存。サーバー不要・無料）
const ls={get(k,d){try{return JSON.parse(localStorage.getItem('kp.'+k))||d}catch(e){return d}},set(k,v){try{localStorage.setItem('kp.'+k,JSON.stringify(v))}catch(e){}}};
const blank=()=>({items:{},tot:{},hist:[],titles:{}});
let S={lang:1,lvl:0,kind:'mix',fmt:'mix',mode:0,time:0,auto:0,snd:1,...ls.get('set',{})};
let AC=ls.get('acc',{}),ACC=ls.get('cur',null),D;
if(!AC[ACC])ACC=null;
const loadD=()=>{D={...blank(),...ls.get('d.'+(ACC||'guest'),{})}};loadD();
const save=()=>{ls.set('set',S);ls.set('d.'+(ACC||'guest'),D)};
const uname=()=>ACC?AC[ACC].name:'ゲスト';
async function hs(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('kp'+s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=5381;for(const c of s)h=(h*33^c.charCodeAt(0))>>>0;return''+h}}
const setAcc=e=>{ACC=e;ls.set('cur',e);loadD()};
async function reg(e,p){e=e.trim().toLowerCase();
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))return'メールアドレスの形式を確認してね';
 if(!/^[A-Za-z0-9]{6,}$/.test(p))return'パスワードは半角英数字6文字以上だよ';
 if(AC[e])return'このアドレスは登録済みです';
 AC[e]={h:await hs(e+p),name:'ユーザー'};ls.set('acc',AC);setAcc(e);return''}
async function login(e,p){e=e.trim().toLowerCase();
 if(!AC[e]||AC[e].h!==await hs(e+p))return'アドレスかパスワードが違います（未登録なら新規登録へ）';
 setAcc(e);return''}
const rename=n=>{n=n.trim().slice(0,12);if(ACC&&n){AC[ACC].name=n;ls.set('acc',AC)}};
const resetRec=()=>{D=blank();save()};
