// ===== 専用キーボード（英・西・伊・中・韓・タイ・ベトナム語）=====
// 入力欄(#ti)の末尾に文字を足す方式。日本語の答えは端末のキーボードを使うため、ここは外国語の答え専用。
const KBD={shift:0,buf:'',PY:null,ld:0,rr:0};

// --- 韓国語: ハングルの組み立て（2ボル式配列）---
const HG={L:'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ',V:'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ',T:' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ',
 VC:{'ㅗㅏ':'ㅘ','ㅗㅐ':'ㅙ','ㅗㅣ':'ㅚ','ㅜㅓ':'ㅝ','ㅜㅔ':'ㅞ','ㅜㅣ':'ㅟ','ㅡㅣ':'ㅢ'},
 TC:{'ㄱㅅ':'ㄳ','ㄴㅈ':'ㄵ','ㄴㅎ':'ㄶ','ㄹㄱ':'ㄺ','ㄹㅁ':'ㄻ','ㄹㅂ':'ㄼ','ㄹㅅ':'ㄽ','ㄹㅌ':'ㄾ','ㄹㅍ':'ㄿ','ㄹㅎ':'ㅀ','ㅂㅅ':'ㅄ'}};
const hgInv=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[v,[...k]]));
HG.VS=hgInv(HG.VC);HG.TS=hgInv(HG.TC);
const hgMk=(l,v,t)=>String.fromCharCode(0xAC00+(HG.L.indexOf(l)*21+HG.V.indexOf(v))*28+(t?HG.T.indexOf(t):0));
function hgParse(c){if(!c)return{};const n=c.charCodeAt(0)-0xAC00;
 if(n>=0&&n<11172)return{syl:1,l:HG.L[(n/588)|0],v:HG.V[((n%588)/28)|0],t:n%28?HG.T[n%28]:''};
 if(HG.L.includes(c))return{cons:1};
 if(HG.V.includes(c))return{vow:1};
 return{}}
function hgAdd(s,j){const last=s.slice(-1),head=s.slice(0,-1),st=hgParse(last);
 if(HG.V.includes(j)){ // 母音
  if(st.syl){
   if(st.t){const sp=HG.TS[st.t]||['',st.t];return head+hgMk(st.l,st.v,sp[0])+hgMk(sp[1],j,'')} // パッチムを次の音節へ送る
   const cb=HG.VC[st.v+j];return cb?head+hgMk(st.l,cb,''):s+j}
  if(st.cons)return head+hgMk(last,j,'');
  return s+j}
 if(st.syl){ // 子音
  if(!st.t)return HG.T.includes(j)&&!'ㄸㅃㅉ'.includes(j)?head+hgMk(st.l,st.v,j):s+j;
  const cb=HG.TC[st.t+j];return cb?head+hgMk(st.l,st.v,cb):s+j}
 return s+j}
function hgBack(s){const last=s.slice(-1),head=s.slice(0,-1),st=hgParse(last);
 if(st.syl){
  if(st.t){const sp=HG.TS[st.t];return head+hgMk(st.l,st.v,sp?sp[0]:'')}
  const un=HG.VS[st.v];return un?head+hgMk(st.l,un[0],''):head+st.l}
 return head}

// --- ベトナム語: 声調記号キー（直前の母音に付ける）---
const VI_T=['̀','́','̉','̃','̣'];
function viTone(s,m){if(!s)return s;const i=s.length-1,d=s[i].normalize('NFD').replace(/[̣̀́̃̉]/g,'');
 if(!/^[aeiouyăâêôơư]/i.test(d))return s;return s.slice(0,i)+(d+m).normalize('NFC')}

// --- 中国語: ピンイン→漢字の候補（data/pinyin.json。ü は v で入力）---
function kbSetPY(d){const o={};for(const k in d)o[k]=d[k];
 for(const k in d)if(k.includes('v')){const a=k.replace(/v/g,'u');o[a]=(o[a]||'')+d[k]} // lu と lv どちらでも候補に出す
 KBD.PY=o}
function zhCand(buf,PY,limit=40){if(!buf||!PY)return[];const out=[];
 const add=s=>{for(const c of s)if(!out.includes(c)){out.push(c);if(out.length>=limit)return true}return false};
 if(PY[buf]&&add(PY[buf]))return out;
 for(const k of Object.keys(PY).sort())if(k!=buf&&k.startsWith(buf)&&add(PY[k]))break;
 return out}

// --- キー配列 ---
const KB_LAT=['1234567890','qwertyuiop','asdfghjkl','zxcvbnm'];
const KB_XT={4:'áéíóúüñ¿¡',5:'àèéìíòóùú',7:'ăâêôơưđ'};
const KB_KO=[['ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ','ㅁㄴㅇㄹㅎㅗㅓㅏㅣ','ㅋㅌㅊㅍㅠㅜㅡ'],['ㅃㅉㄸㄲㅆㅛㅕㅑㅒㅖ','ㅁㄴㅇㄹㅎㅗㅓㅏㅣ','ㅋㅌㅊㅍㅠㅜㅡ']];
const KB_TH=['กขฃคฅฆงจฉชซ','ฌญฎฏฐฑฒณดตถ','ทธนบปผฝพฟภม','ยรลวศษสหฬอฮ','เแโใไาำะฤฦๆฯ','ัิีึืุู็่้๊๋์','๐๑๒๓๔๕๖๗๘๙','1234567890'];
const KB_PU={1:",.?!'-",2:'，。？！',3:',.?!',4:",.?!'-",5:",.?!'-",6:',.?!',7:',.?!'};
const KB_COMB=/[ัิ-ฺ็-๎]/;
const ea=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const kbtn=(k,lab,cls)=>`<button type=button class="k${cls?' '+cls:''}" data-k="${ea(k)}">${lab}</button>`;
const kchars=s=>[...s].map(c=>kbtn('c:'+c,KB_COMB.test(c)?'◌'+c:c));
const krow=a=>`<div class=kr>${a.join('')}</div>`;
function kbHTML(lang){let rows;
 const bottom=(pre)=>krow([...(pre||[]),kbtn('s:','␣','kw'),kbtn('b:','⌫','kd')]);
 const pu=krow(kchars(KB_PU[lang]));
 if(lang==6)rows=[...KB_TH.map(r=>krow(kchars(r))),pu,bottom()];
 else if(lang==3)rows=[krow(kchars('1234567890')),...KB_KO[KBD.shift?1:0].map(r=>krow(kchars(r))),pu,bottom([kbtn('h:','⇧',KBD.shift?'kon':'')])];
 else if(lang==2)rows=[krow(kchars('qwertyuiop')),krow(kchars('asdfghjkl')),krow(kchars('zxcvbnm')),pu,bottom()];
 else{rows=KB_LAT.map(r=>krow(kchars(r)));
  if(KB_XT[lang])rows.push(krow(kchars(KB_XT[lang])));
  if(lang==7)rows.push(krow(VI_T.map(m=>kbtn('t:'+m,'◌'+m))));
  rows.push(pu,bottom())}
 return rows.join('')}

// --- 実行 ---
function kbExec(lang,s,t,v){
 if(t=='b'){if(lang==2&&KBD.buf){KBD.buf=KBD.buf.slice(0,-1);return s}return lang==3?hgBack(s):[...s].slice(0,-1).join('')}
 if(t=='s'){if(lang==2&&KBD.buf){const c=zhCand(KBD.buf,KBD.PY);if(c.length){KBD.buf='';return s+c[0]}}return s+' '}
 if(t=='p'){KBD.buf='';return s+v}
 if(t=='h'){KBD.shift=KBD.shift?0:1;KBD.rr=1;return s}
 if(t=='t')return viTone(s,v);
 if(lang==3){const r=HG.L.includes(v)||HG.V.includes(v)?hgAdd(s,v):s+v;if(KBD.shift){KBD.shift=0;KBD.rr=1}return r}
 if(lang==2&&/^[a-z]$/.test(v)){KBD.buf+=v;return s}
 return s+v}
function zhRender(){const z=document.getElementById('zc');if(!z)return;
 if(!KBD.PY){z.innerHTML='<small>辞書を読み込み中…</small>';return}
 const c=zhCand(KBD.buf,KBD.PY);
 z.innerHTML=`<span class=zb>${KBD.buf||'ピンインで入力'}</span>`+c.map(x=>kbtn('p:'+x,x,'zk')).join('')}
function kbClick(e){const b=e.target.closest('button[data-k]');if(!b)return;
 const ti=document.getElementById('ti');if(!ti||ti.disabled||!Q||!Q.cur)return;
 const k=b.dataset.k,l=Q.cur.alang;ti.value=kbExec(l,ti.value,k[0],k.slice(2));
 if(l==2)zhRender();
 if(KBD.rr){KBD.rr=0;document.getElementById('kbx').innerHTML=kbHTML(l)}
 ti.focus()}
async function kbLoadPY(){if(KBD.PY||KBD.ld)return;KBD.ld=1;
 try{kbSetPY(await fetch('data/pinyin.json').then(r=>r.json()));zhRender()}catch(e){KBD.ld=0;const z=document.getElementById('zc');if(z)z.innerHTML='<small>ピンイン辞書を読み込めませんでした。「端末のキーボード」に切り替えてね</small>'}}
// 問題画面に取り付け（入力式で、答えが外国語のときだけ）
function kbMount(){const ti=document.getElementById('ti'),box=document.getElementById('kbx');if(!ti||!box)return;
 const l=Q.cur.alang,on=S.kb&&l>0;KBD.buf='';KBD.shift=0;KBD.rr=0;
 ti.setAttribute('inputmode',on?'none':'text');box.innerHTML=on?kbHTML(l):'';
 const z=document.getElementById('zc');if(z)z.style.display=on&&l==2?'flex':'none';
 const tg=document.getElementById('kbt');if(tg)tg.textContent=on?'⌨ 端末のキーボードを使う':'⌨ 専用キーボードを使う';
 if(on&&l==2){zhRender();kbLoadPY()}}
function kbToggle(){S.kb=S.kb?0:1;save();kbMount();const ti=document.getElementById('ti');if(ti)ti.focus()}
