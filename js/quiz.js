// 出題・判定・称号
let Q,tm;
const okx=x=>x.a[S.lang]&&(!x.lg||x.lg==S.lang);
const rev=()=>P.filter(x=>okx(x)&&(S.ans=='qa')==(x.t=='q')&&((D.items[S.lang+x.k]||{}).s||0)>0); // まちがい復習の対象
const shuf=a=>a.slice().sort(()=>Math.random()-.5);
const norm=s=>s.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\(.*?\)|[\s.,!?¿¡。、！？'"~\-]/g,'');
// 同じ意味の判定: 表記ゆれ(ひらがな/カタカナ等)は自動、言い換えは data/synonyms.json の同義語グループで判定
const strictB=it=>it.t=='b'&&it.lg==7; // ベトナム語の文字の読み書きは声調記号を区別する
const same=(a,b,st)=>{if(st){const f=s=>s.normalize('NFC').toLowerCase().replace(/\s+/g,'');return f(a)==f(b)}const x=norm(a),y=norm(b);return x==y||(GID[x]!==undefined&&GID[x]==GID[y])};
// 称号テーブル [正解率帯][スピード帯]。同条件ならこの中からランダム
const EM=['🦴','🐣','🗣️','😎','👑','💤']; // 5番目(💤)は、とちゅうでおわったとき用
const TT=[[['ダッシュで全滅隊','ハヤブサ級の迷子'],['言語原始人','石器時代の旅人'],['ねむれる原始人','のんびり古代人']],
[['おっちょこ勇者','せっかち見習い'],['ことばひよこ','ヨチヨチ冒険者'],['じっくりカメ','かたつむり学徒']],
[['ひらめき小僧','スピードおしゃべり'],['おしゃべり見習い','旅の相棒'],['コツコツ職人','ていねい旅人']],
[['光速トランスレーター','電光石火の達人'],['会話の達人','ことばの魔法使い'],['慎重な賢者','落ち着きの哲学者']],
[['言語の神','神速マスター'],['言語マスター','パーフェクト王'],['ぎりぎり完璧','無双の学者']]];
// 称号ごとに、すべて別々のキャラ（全36種。順番は TT の a→s→k、そのあと TI の s→k）
const CHF=['🐗','🦅','🦖','🦕','🦥','🐘','🐒','🐇','🐣','🐧','🐢','🐌','🦊','🦜','🐤','🐕','🐜','🐈','🐆','🐬','🦄','🦉','🦌','🐼','🐉','🦈','🦁','🐯','🦔','🐻','🦋','🐝','🐾','🐨','🐹','🐞'];
const chOf=(a,s,k)=>CHF[a==5?30+s*3+k:a*6+s*2+k];
const AL=['正解率0%','正解率1〜49%','正解率50〜79%','正解率80〜99%','正解率100%'],SL=['平均4秒未満','平均4〜8秒','平均8秒以上'];
// とちゅう称号: 10問以内でおわったとき（「ひたすら」も含む）。[1〜3問でおわる / 4〜10問でおわる] からランダム
const TI=[['ふらっと立ち寄り客','ちらっと見学の旅人','おためし一歩さん'],['ひと休み中の冒険者','また来るね名人','のんびり寄り道旅人']],SI=['1〜3問でおわる','4〜10問でおわる'];
const tName=(a,s,k)=>a==5?TI[s][k]:TT[a][s][k];
const tBand=(a,s)=>a==5?'とちゅうでおわった ・ '+SI[s]:AL[a]+' ・ '+SL[s];
const lockTxt=(a,s)=>a==5?'とちゅうでおわる<br>'+SI[s]:AL[a]+'<br>'+SL[s];
const TOTAL=TT.flat(2).length+TI.flat().length;
function awardI(n){const s=n<=3?0:1,k=Math.random()*TI[s].length|0,t=EM[5]+TI[s][k],isNew=!D.titles[t];D.titles[t]=(D.titles[t]||0)+1;return{t,isNew,ch:chOf(5,s,k)}}
function award(p,avg){const a=p==0?0:p<50?1:p<80?2:p<100?3:4,s=avg<4?0:avg<8?1:2,
 k=Math.random()*2|0,t=EM[a]+TT[a][s][k],isNew=!D.titles[t];D.titles[t]=(D.titles[t]||0)+1;return{t,isNew,ch:chOf(a,s,k)}}

function start(){
 if(S.ans!='tr'&&!SS){alert('この端末・ブラウザは読み上げに対応していないため、聞き取り・質疑応答は使えません。回答を「翻訳」にしてね');return}
 if(S.ans!='tr'&&S.vol<=0)toast('音量が0だよ。⚙で上げてね');
Q={n:0,c:0,ms:0,total:S.mode,wrong:[],rc:[],p:.3+Math.random()*.4};next()}
function pick(){
 if(S.ans=='qa'){let pool=P.filter(x=>x.t=='q'&&okx(x)&&(!S.lvl||x.l==S.lvl));const f=pool.filter(x=>!Q.rc.includes(x.k));if(f.length>3)pool=f;
  const w=pool.map(x=>S.boost?1+((D.items[S.lang+x.k]||{}).s||0)*2:1);let r=Math.random()*w.reduce((a,b)=>a+b,0),i=0;while(i<pool.length-1&&(r-=w[i])>0)i++;return pool[i]}
 let t=S.kind=='mix'?(Math.random()<Q.p?'s':'w'):S.kind;
 if(t=='b'&&!P.some(x=>x.lg==S.lang))t='w';
 let pool=P.filter(x=>x.t==t&&okx(x)&&(t=='b'||!S.lvl||x.l==S.lvl));if(!pool.length)pool=P.filter(x=>okx(x)&&x.t!='b'&&x.t!='q');
 if(S.kind=='r'){const r=rev();if(r.length)pool=r}
 const f=pool.filter(x=>!Q.rc.includes(x.k));if(f.length>3)pool=f;
 const w=pool.map(x=>S.boost?1+((D.items[S.lang+x.k]||{}).s||0)*2:1); // 間違えた問題ほど出やすい
 let r=Math.random()*w.reduce((a,b)=>a+b,0),i=0;while(i<pool.length-1&&(r-=w[i])>0)i++;return pool[i]}

function next(){clearTimeout(Q.at);
 if(S.ans!='qa'&&S.kind=='r'&&!rev().length){if(Q.n)return result();alert('まちがえた問題はまだありません。まずは「ミックス」などで遊んでみてね！');return home()}
 if(Q.total&&Q.n>=Q.total)return result();
 const it=pick();Q.rc.push(it.k);if(Q.rc.length>6)Q.rc.shift();
 if(S.ans=='qa'){const ok=it.ok[Math.random()*it.ok.length|0];Q.cur={it,ans:ok,d:0,txt:0,mode:'qa',opts:shuf([ok,...shuf(it.x).slice(0,3)])};Q.lock=0;return draw()}
 const li=S.ans=='li',d=li?true:Math.random()<.5,qi=d?0:S.lang,ai=d?S.lang:0,ans=it.a[ai],txt=S.fmt=='t'||(S.fmt=='mix'&&Math.random()<.5);
 // 聞き取りは、声を聞いて外国語の文字で答える（答えは各言語の単語・文章）
 const ds=shuf([...new Set(P.filter(x=>x.t==it.t&&x.k!=it.k&&x.a[ai]&&(!x.lg||x.lg==S.lang)).map(x=>x.a[ai]).filter(x=>!same(x,ans,strictB(it))))]).slice(0,3);
 Q.cur={it,ans,d,txt,mode:li?'li':'tr',opts:shuf([ans,...ds])};Q.lock=0;draw()}

function draw(){const c=Q.cur,it=c.it,md=c.mode,kn=it.t=='b'?'文字':it.t=='w'?'単語':'文章';
 const head=md=='qa'?F[S.lang]+' '+L[S.lang]+'の質疑応答<br>声と文章の質問に、日本語で答えを選ぼう':md=='li'?'🎧 '+F[S.lang]+' '+L[S.lang]+'の聞き取り<br>聞こえた'+kn+'を'+(c.txt?'入力しよう':'選ぼう'):it.t=='b'?F[S.lang]+' '+L[S.lang]+'の文字の読み書き<br>'+(c.d?'読み → 文字':'文字 → 読み'):c.d?'日本語 → '+L[S.lang]:L[S.lang]+' → 日本語';
 const body=md=='li'?'<h2 style="font-size:3rem;margin:6px 0">🎧</h2><button class=sm onclick="speak(Q.cur.it.a[S.lang])">🔊 もういちど</button> <button class=sm onclick="speak(Q.cur.it.a[S.lang],0,1)">🐢 ゆっくり</button>':md=='qa'?'<h2>'+it.a[S.lang]+'</h2><button class=sm onclick="speak(Q.cur.it.a[S.lang])">🔊 もういちど</button> <button class=sm onclick="speak(Q.cur.it.a[S.lang],0,1)">🐢 ゆっくり</button>':'<h2>'+it.a[c.d?0:S.lang]+'</h2>'+(c.d?'':'<button class=sm onclick="speak(Q.cur.it.a[S.lang])">💡 ヒント（音声）</button> <button class=sm onclick="speak(Q.cur.it.a[S.lang],0,1)">🐢 ゆっくり</button>');
 app.innerHTML=`<div class=top><button class=sm onclick="quit()">おわる</button><span>${Q.n+1}${Q.total?' / '+Q.total:' 問目'}</span><span>⭕ ${Q.c}</span><button class=sm onclick="optOpen()">⚙</button></div>
 ${S.time?'<div class=bar style="margin-top:10px"><i id=tb></i></div>':''}
 <div class=card id=qc><small>${head} <span class=tag>${c.txt?'入力':'4択'}</span></small>${body}</div>
 ${c.txt?'<input id=ti class=in autocomplete=off autocapitalize=off spellcheck=false placeholder="'+(md=='li'?'聞こえたことばを入力':'こたえを入力')+'" onkeydown="if(event.key==\'Enter\')sub()"><button class=big onclick="sub()">こたえる</button>'
 :c.opts.map((o,i)=>`<button class=opt onclick="ans(${i})">${o}</button>`).join('')}<div id=fb></div>`;
 const ti=document.getElementById('ti');if(ti&&md!='li')ti.focus();startT();
 if(md!='tr')speak(it.a[S.lang])} // 聞き取り・質疑応答は、出題と同時に自動で読み上げ（ブラウザに止められたら🔊を押す）

function startT(){clearTimeout(tm);Q.t0=Date.now();
 let b=document.getElementById('tb'); // ⚙で制限時間を変えたときも、バーと実際のタイマーをそろえる
 if(S.time&&!b&&!Q.lock){document.querySelector('.top').insertAdjacentHTML('afterend','<div class=bar style="margin-top:10px"><i id=tb></i></div>');b=document.getElementById('tb')}
 if(!S.time&&b){b.parentElement.remove();b=null}
 if(S.time&&!Q.lock){if(b){b.style.transition='none';b.style.width='100%';b.offsetWidth;b.style.transition=`width ${S.time}s linear`;b.style.width='0'}
 tm=setTimeout(()=>ans(-1),S.time*1000)}}

const sub=()=>ans(-2,document.getElementById('ti').value);
function ans(i,txt){
 if(Q.lock)return;Q.lock=1;clearTimeout(tm);
 const c=Q.cur,out=i==-1,ok=!out&&(c.txt?same(txt,c.ans,strictB(c.it)):c.opts[i]==c.ans),key=S.lang+c.it.k;
 Q.ms+=out?S.time*1000:Date.now()-Q.t0;
 const o=D.items[key]||(D.items[key]={c:0,w:0,s:0}),t=D.tot[S.lang]||(D.tot[S.lang]={n:0,c:0});
 t.n++;if(ok){o.c++;o.s=Math.max(0,o.s-1);t.c++;Q.c++}else{o.w++;o.s+=2;Q.wrong.push(c.it)}
 Q.n++;save();fx(ok);
 document.getElementById('qc').classList.add(ok?'okc':'ngc');
 document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=1;if(c.opts[j]==c.ans)b.classList.add('ok');else if(j==i)b.classList.add('ng')});
 const ti=document.getElementById('ti');if(ti){ti.disabled=1;ti.classList.add(ok?'ok':'ng');ti.nextElementSibling.remove()}
 const last=Q.total&&Q.n>=Q.total;
 document.getElementById('fb').innerHTML=`<div class="card fb"><h2>${ok?'🎉 せいかい！':out?'⏰ 時間切れ！':'💦 おしい！'}</h2>
 <div>${c.mode=='qa'?c.it.a[0]+'<br>'+c.it.a[S.lang]+'<br>答え：'+c.ans:c.it.a[0]+'<br>＝ '+c.it.a[S.lang]} <button class=sm onclick="speak(Q.cur.it.a[S.lang])">👂 発音をきく</button> <button class=sm onclick="speak(Q.cur.it.a[S.lang],0,1)">🐢 ゆっくり</button></div>
 <button class="big m" onclick="next()">${last?'結果を見る':'つぎへ'}</button>${S.auto?'<small>自動で進みます…</small>':''}</div>`;
 if(S.auto)Q.at=setTimeout(next,ok?1300:2600)}

function quit(){clearTimeout(tm);clearTimeout(Q.at);Q.n?result(Q.n<=10&&!(Q.total&&Q.n>=Q.total)):home()} // 10問以内でおわると、とちゅう称号
function result(intr){clearTimeout(tm);clearTimeout(Q.at);
 const p=Math.round(Q.c/Q.n*100),avg=Q.ms/Q.n/1000,r=intr?awardI(Q.n):award(p,avg);
 D.hist.push({d:new Date().toLocaleDateString('ja-JP'),l:S.lang,n:Q.n,c:Q.c});D.hist=D.hist.slice(-30);save();
 const seen=[...new Set(Q.wrong.map(x=>x.k))].map(k=>Q.wrong.find(x=>x.k==k));
 app.innerHTML=`<div class=card><div class=chr>${r.ch}</div><small>${intr?'とちゅうでおわった あなたの称号は…':'あなたの称号は…'}</small><h2 style="font-size:2rem">${r.t}</h2>${r.isNew?'<span class=tag>🎁 NEW! コレクションに追加</span>':'<small>ゲット済みの称号です</small>'}
 <div style="font-size:1.2rem;margin-top:8px">${intr?'ここまで '+Q.n+'問 ・ '+Q.c+'問 正解（'+p+'%）':Q.n+'問中 '+Q.c+'問 正解（'+p+'%）'}</div>${intr?'<small>10問以内でおわったので、とちゅう称号です</small><br>':''}<small>平均 ${avg.toFixed(1)}秒 / 問</small></div>
 ${seen.length?'<h3>まちがえた問題（多めに出ます）</h3>'+seen.map(x=>`<div class=row><span>${x.a[0]}</span><span>${x.a[S.lang]}</span></div>`).join(''):'<h3>ノーミス！すごい🎊</h3>'}
 <button class=big onclick="start()">もう一回！</button><button class="big alt" onclick="home()">ホームへ</button>`}
