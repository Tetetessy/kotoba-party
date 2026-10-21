// 出題・判定・称号
let Q,tm;
const okx=x=>x.a[S.lang]&&(!x.lg||x.lg==S.lang);
const rev=()=>P.filter(x=>okx(x)&&(S.ans=='qa')==(x.t=='q')&&((D.items[S.lang+x.k]||{}).s||0)>0); // まちがい復習の対象
const shuf=a=>a.slice().sort(()=>Math.random()-.5);
const norm=s=>s.normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\(.*?\)|[\s.,!?¿¡。、！？'"~\-]/g,'');
// 同じ意味の判定: 表記ゆれ(ひらがな/カタカナ等)は自動、言い換えは data/synonyms.json の同義語グループで判定
const strictB=it=>it.t=='b'&&it.lg==7; // ベトナム語の文字の読み書きは声調記号を区別する
const same=(a,b,st)=>{if(st){const f=s=>s.normalize('NFC').toLowerCase().replace(/\s+/g,'');return f(a)==f(b)}const x=norm(a),y=norm(b);return x==y||(GID[x]!==undefined&&GID[x]==GID[y])};
// ===== 称号 =====
// 各称号は「正解率」「平均解答時間」と、必要に応じて「よく間違える単語」「発音チェック」の条件で決まる。
// 条件はすべて別々で、ひとつのあそびに当てはまる称号は必ず1つだけ。アイコンも称号ごとに別々。
// a:[正解率の下限,上限(%)]  t:[平均秒の下限(超),上限(以内)]
// f: ''=条件なし / '*'=何でもOK / 'm'=よく間違える単語あり / 'n'=苦手単語なし・発音チェックなし / 'h'=苦手単語なし・発音チェックあり
// q:[問題数の下限,上限]  リタイア（10問以内でおわる）の称号。a は、そのときの正解率
const IN=Infinity;
const TL=[
 // ---- リタイア称号（10問以内でおわった） ----
 {e:'🥷',n:'おそろしく早いリタイア',q:[0,0],a:[0,100]},
 {e:'🥊',n:'開幕ワンパンの人',q:[1,3],a:[0,0]},{e:'🛍️',n:'見てるだけの人',q:[1,3],a:[1,49]},{e:'🚪',n:'いいところで帰る人',q:[1,3],a:[50,79]},{e:'🏃',n:'勝ち逃げ仙人',q:[1,3],a:[80,100]},
 {e:'🪦',n:'真っ白に燃え尽きた人',q:[4,10],a:[0,0]},{e:'📣',n:'試合終了のお知らせ',q:[4,10],a:[1,29]},{e:'🕶️',n:'うぬぼれ刑事',q:[4,10],a:[30,49]},{e:'🍙',n:'半分で満足した人',q:[4,10],a:[50,79]},{e:'🚃',n:'途中下車の天才',q:[4,10],a:[80,100]},
 // ---- 正解率0% ----
 {e:'🧨',n:'ノリで押してる人',a:[0,0],t:[0,3]},{e:'🐱',n:'迷子の子猫ちゃん',a:[0,0],t:[3,8]},{e:'🛌',n:'布団の中の挑戦者',a:[0,0],t:[8,IN]},
 // ---- 正解率1〜29% ----
 {e:'🎲',n:'勘で生きてる人',a:[1,29],t:[0,3]},{e:'🦴',n:'言語原始人',a:[1,29],t:[3,5]},{e:'🐘',n:'マンモスもびっくり',a:[1,29],t:[5,8]},{e:'🦕',n:'化石の発掘待ち',a:[1,29],t:[8,IN]},
 // ---- 正解率30〜49% ----
 {e:'🥈',n:'惜しいで賞の常連',a:[30,49],t:[0,3]},{e:'🐛',n:'脳内辞書バグり気味',a:[30,49],t:[3,5]},{e:'⏳',n:'悩みすぎて時が止まる',a:[30,49],t:[5,8]},{e:'🐌',n:'ゆっくり解説動画の人',a:[30,49],t:[8,IN]},
 // ---- 正解率50〜79% ----
 {e:'🐆',n:'勢いで半分当てる人',a:[50,79],t:[1,2]},{e:'🧭',n:'ほぼ旅人（地図なし）',a:[50,79],t:[2,3]},{e:'🎙️',n:'それっぽい通訳',a:[50,79],t:[3,5]},{e:'🍵',n:'おっとり翻訳家',a:[50,79],t:[5,8]},{e:'🎻',n:'のんびり吟遊詩人',a:[50,79],t:[8,IN]},
 // ---- 正解率80〜89%：よく間違える単語あり / 発音チェックなし / あり ----
 {e:'🦊',n:'うっかり八兵衛',a:[80,89],t:[1,2],f:'m'},{e:'🦂',n:'宿敵ワードの常連',a:[80,89],t:[2,5],f:'m'},{e:'🍌',n:'同じとこでコケる芸人',a:[80,89],t:[5,IN],f:'m'},
 {e:'🧠',n:'耳いらずの直感王',a:[80,89],t:[1,2],f:'n'},{e:'🤠',n:'ノーヒントで勝負する男',a:[80,89],t:[2,5],f:'n'},{e:'🕵️',n:'無音のじっくり探偵',a:[80,89],t:[5,IN],f:'n'},
 {e:'⚡',n:'光速トランスレーター',a:[80,89],t:[1,2],f:'h'},{e:'🧙',n:'会話の魔法使い',a:[80,89],t:[2,5],f:'h'},{e:'🐢',n:'ていねい旅人',a:[80,89],t:[5,IN],f:'h'},
 // ---- 正解率90〜99% ----
 {e:'🐉',n:'ラスボス手前でうっかり',a:[90,99],t:[1,2],f:'m'},{e:'🏹',n:'苦手ワードに負けた天才',a:[90,99],t:[2,5],f:'m'},{e:'🦈',n:'たった一つの宿敵',a:[90,99],t:[5,IN],f:'m'},
 {e:'🙉',n:'ヒント？知らない子ですね',a:[90,99],t:[1,2],f:'n'},{e:'🧘',n:'ヒント断ちの修行僧',a:[90,99],t:[2,5],f:'n'},{e:'🪨',n:'無音の岩',a:[90,99],t:[5,IN],f:'n'},
 {e:'✨',n:'詠唱短縮の達人',a:[90,99],t:[1,2],f:'h'},{e:'🪄',n:'アブラカタブラ',a:[90,99],t:[2,5],f:'h'},{e:'🦉',n:'慎重すぎる大賢者',a:[90,99],t:[5,IN],f:'h'},
 // ---- 正解率100% ----
 {e:'🏎️',n:'解答のシューマッハ',a:[50,100],t:[0,1],f:'*'},
 {e:'🦅',n:'ノーヒントの音速王',a:[100,100],t:[1,2],f:'n'},{e:'🍢',n:'翻訳こんにゃく',a:[100,100],t:[1,2],f:'h'},
 {e:'🥋',n:'ヒント無用の師範代',a:[100,100],t:[2,3],f:'n'},{e:'👑',n:'パーフェクト会話王',a:[100,100],t:[2,3],f:'h'},
 {e:'🛡️',n:'ヒント断ちのメンタル鬼',a:[100,100],t:[3,5],f:'n'},{e:'🍳',n:'じっくり満点シェフ',a:[100,100],t:[3,5],f:'h'},
 {e:'👴',n:'悟りを開いたご隠居',a:[100,100],t:[5,IN],f:'n'},{e:'🎓',n:'慎重すぎる神童',a:[100,100],t:[5,IN],f:'h'}];
const FLB={m:'よく間違える単語あり',n:'苦手単語なし・発音チェックなし',h:'苦手単語なし・発音チェックあり','*':''};
const acc=a=>a[0]==a[1]?'正解率'+a[0]+'%':a[1]==100&&a[0]<100?'正解率'+a[0]+'%以上':'正解率'+a[0]+'〜'+a[1]+'%';
const tsec=t=>t[0]==0?'平均'+t[1]+'秒以内':t[1]==IN?'平均'+t[0]+'秒より長い':'平均'+t[0]+'秒より長く'+t[1]+'秒以内';
const tCond=o=>o.q?(o.q[1]==0?'1問も解かずにリタイア':'リタイア（'+(o.q[0]==o.q[1]?o.q[0]+'問':o.q[0]+'〜'+o.q[1]+'問')+'でおわる）・'+acc(o.a)):acc(o.a)+'・'+tsec(o.t)+(FLB[o.f||'']?'・'+FLB[o.f]:'');
const TOTAL=TL.length,chOf=i=>TL[i].e;
function give(i){const o=TL[i],isNew=!D.titles[o.n];D.titles[o.n]=(D.titles[o.n]||0)+1;return{t:o.n,isNew,ch:o.e,i}}
// リタイア（10問以内）
function awardI(n,p){return give(TL.findIndex(o=>o.q&&n>=o.q[0]&&n<=o.q[1]&&p>=o.a[0]&&p<=o.a[1]))}
// 最後まで解いたとき。miss=よく間違える単語あり / heard=発音ボタンを使った
function award(p,avg,miss,heard){const f=p>=80?(miss&&p<100?'m':heard?'h':'n'):'';
 const ok=o=>!o.q&&p>=o.a[0]&&p<=o.a[1]&&(o.f=='*'||(o.f||'')==f);
 let i=TL.findIndex(o=>ok(o)&&avg>o.t[0]&&avg<=o.t[1]);if(i<0)i=TL.findIndex(ok);
 return give(i)}
const hear=slow=>{Q.sp=(Q.sp||0)+1;speak(Q.cur.it.a[S.lang],0,slow)}; // 発音ボタン（ヒント・ゆっくり・もういちど）。使った回数を数える
// 再読み込みしても、問題の途中から続けられるよう、sessionStorage（ブラウザを閉じると消える）に問題の状態を保存する
const QK='kp_q';
function qsave(){try{if(!Q||!Q.cur)return;const c=Q.cur;sessionStorage.setItem(QK,JSON.stringify({q:{n:Q.n,c:Q.c,ms:Q.ms,total:Q.total,p:Q.p,sp:Q.sp||0,rc:Q.rc,wrong:Q.wrong.map(x=>x.k)},c:{k:c.it.k,ans:c.ans,d:c.d,txt:c.txt,mode:c.mode,alang:c.alang,opts:c.opts},lock:Q.lock?1:0}))}catch(e){}}
function qclear(){try{sessionStorage.removeItem(QK)}catch(e){}}
function qrestore(){try{const s=JSON.parse(sessionStorage.getItem(QK)||'null');if(!s)return false;const m=new Map(P.map(x=>[x.k,x])),it=m.get(s.c.k);if(!it)return false;
 const cur={...s.c,it};delete cur.k;Q={...s.q,wrong:s.q.wrong.map(k=>m.get(k)).filter(Boolean),at:0,lock:0,cur};
 if(s.lock)next();else draw();return true}catch(e){return false}}
function start(){rclear();
 if(S.ans!='tr'&&!SS){alert('この端末・ブラウザは読み上げに対応していないため、聞き取り・質疑応答は使えません。回答を「翻訳」にしてね');return}
 if(S.ans!='tr'&&S.vol<=0)toast('音量が0だよ。⚙で上げてね');
Q={n:0,c:0,ms:0,total:S.mode,wrong:[],rc:[],p:.3+Math.random()*.4};next()}
function pick(){
 if(S.ans=='qa'){let pool=P.filter(x=>x.t=='q'&&okx(x)&&(!S.lvl||x.l==S.lvl));const f=pool.filter(x=>!Q.rc.includes(x.k));if(f.length>3)pool=f;
  const w=pool.map(x=>S.boost?1+((D.items[S.lang+x.k]||{}).s||0)*2:1);let r=Math.random()*w.reduce((a,b)=>a+b,0),i=0;while(i<pool.length-1&&(r-=w[i])>0)i++;return pool[i]}
 let t=S.kind=='mix'?(Math.random()<Q.p?'s':'w'):S.kind;
 if(t=='b'&&!P.some(x=>x.lg==S.lang))t='w';
 let pool=P.filter(x=>x.t==t&&okx(x)&&(t=='b'?(!S.grp||x.g==S.grp):(!S.lvl||x.l==S.lvl)));if(!pool.length)pool=P.filter(x=>okx(x)&&x.t!='b'&&x.t!='q');
 if(S.kind=='r'){const r=rev();if(r.length)pool=r}
 const f=pool.filter(x=>!Q.rc.includes(x.k));if(f.length>3)pool=f;
 const w=pool.map(x=>S.boost?1+((D.items[S.lang+x.k]||{}).s||0)*2:1); // 間違えた問題ほど出やすい
 let r=Math.random()*w.reduce((a,b)=>a+b,0),i=0;while(i<pool.length-1&&(r-=w[i])>0)i++;return pool[i]}

function next(){clearTimeout(Q.at);
 if(S.ans!='qa'&&S.kind=='r'&&!rev().length){if(Q.n)return result();alert('まちがえた問題はまだありません。まずは「ミックス」などで遊んでみてね！');return home()}
 if(Q.total&&Q.n>=Q.total)return result();
 const it=pick();Q.rc.push(it.k);if(Q.rc.length>6)Q.rc.shift();
 if(S.ans=='qa'){const ok=it.ok[Math.random()*it.ok.length|0];Q.cur={it,ans:ok,d:0,txt:0,mode:'qa',opts:shuf([ok,...shuf(it.x).slice(0,3)])};Q.lock=0;return draw()}
 const li=S.ans=='li',d=li?true:S.dir=='j2f'?true:S.dir=='f2j'?false:Math.random()<.5,qi=d?0:S.lang,ai=d?S.lang:0,ans=it.a[ai],txt=S.fmt=='t'||(S.fmt=='mix'&&Math.random()<.5);
 // 聞き取りは、声を聞いて外国語の文字で答える（答えは各言語の単語・文章）
 const ds0=a=>shuf([...new Set(P.filter(x=>x.t==it.t&&x.k!=it.k&&x.a[ai]&&(!x.lg||x.lg==S.lang)&&a(x)).map(x=>x.a[ai]).filter(x=>!same(x,ans,strictB(it))))]).slice(0,3);
 let ds=it.t=='b'?ds0(x=>x.g==it.g):[];if(ds.length<3)ds=ds0(()=>true); // 文字は、同じ種類から選択肢を作る
 Q.cur={it,ans,d,txt,mode:li?'li':'tr',alang:li||d?S.lang:it.t=='b'?(S.lang==7?7:1):0,opts:shuf([ans,...ds])};Q.lock=0;draw()}

function draw(){const c=Q.cur,it=c.it,md=c.mode,kn=it.t=='b'?'文字':it.t=='w'?'単語':'文章';
 const head=md=='qa'?F[S.lang]+' '+L[S.lang]+'の質疑応答<br>声と文章の質問に、日本語で答えを選ぼう':md=='li'?'🎧 '+F[S.lang]+' '+L[S.lang]+'の聞き取り<br>聞こえた'+kn+'を'+(c.txt?'入力しよう':'選ぼう'):it.t=='b'?F[S.lang]+' '+L[S.lang]+'の文字の読み書き<br>'+(c.d?'読み → 文字':'文字 → 読み'):c.d?'日本語 → '+L[S.lang]:L[S.lang]+' → 日本語';
 const body=md=='li'?'<h2 style="font-size:3rem;margin:6px 0">🎧</h2><button class=sm onclick="hear()">🔊 もういちど</button> <button class=sm onclick="hear(1)">🐢 ゆっくり</button>':md=='qa'?'<h2>'+it.a[S.lang]+'</h2><button class=sm onclick="hear()">🔊 もういちど</button> <button class=sm onclick="hear(1)">🐢 ゆっくり</button>':'<h2>'+it.a[c.d?0:S.lang]+'</h2>'+(c.d?'':'<button class=sm onclick="hear()">🔊 読み上げ</button> <button class=sm onclick="hear(1)">🐢 ゆっくり</button>');
 app.innerHTML=`<div class=top><button class=sm onclick="quit()">おわる</button><span>${Q.n+1}${Q.total?' / '+Q.total:' 問目'}</span><span>⭕ ${Q.c}</span><button class=sm onclick="optOpen()">⚙</button></div>
 ${S.time?'<div class=bar style="margin-top:10px"><i id=tb></i></div>':''}
 <div class=card id=qc><small>${head} <span class=tag>${c.txt?'入力':'4択'}</span></small>${body}</div>
 ${c.txt?'<input id=ti class=in autocomplete=off autocapitalize=off spellcheck=false placeholder="'+(md=='li'?'聞こえたことばを入力':'こたえを入力')+'" onkeydown="if(event.key==\'Enter\')sub()"><button class=big onclick="sub()">こたえる</button><div id=zc class=zc></div><div id=kbx class=kbd></div><button id=kbt type=button class="sm kt" onclick="kbToggle()"></button>'
 :c.opts.map((o,i)=>`<button class=opt onclick="ans(${i})">${o}</button>`).join('')}<div id=fb></div>`;
 const ti=document.getElementById('ti');if(c.txt)kbMount();if(ti&&md!='li'&&!(S.kb&&c.alang>0))ti.focus();startT();qsave();
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
 Q.n++;save();qsave();fx(ok);
 document.getElementById('qc').classList.add(ok?'okc':'ngc');
 document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=1;if(c.opts[j]==c.ans)b.classList.add('ok');else if(j==i)b.classList.add('ng')});
 const ti=document.getElementById('ti');if(ti){ti.disabled=1;ti.classList.add(ok?'ok':'ng');ti.nextElementSibling.remove();['zc','kbx','kbt'].forEach(i=>{const e=document.getElementById(i);if(e)e.remove()})}
 const last=Q.total&&Q.n>=Q.total;
 document.getElementById('fb').innerHTML=`<div class="card fb"><h2>${ok?'🎉 せいかい！':out?'⏰ 時間切れ！':'💦 おしい！'}</h2>
 <div>${c.mode=='qa'?c.it.a[0]+'<br>'+c.it.a[S.lang]+'<br>答え：'+c.ans:c.it.a[0]+'<br>＝ '+c.it.a[S.lang]} <button class=sm onclick="hear()">👂 発音をきく</button> <button class=sm onclick="hear(1)">🐢 ゆっくり</button></div>
 <button class="big m" onclick="next()">${last?'結果を見る':'つぎへ'}</button>${S.auto?'<small>自動で進みます…</small>':''}</div>`;
 if(S.auto)Q.at=setTimeout(next,ok?1300:2600)}

function quit(){clearTimeout(tm);clearTimeout(Q.at);result(Q.n<=10&&!(Q.total&&Q.n>=Q.total))} // 10問以内でおわると、リタイア称号（1問も解かなくてもOK）
function result(intr){clearTimeout(tm);clearTimeout(Q.at);qclear();
 const p=Q.n?Math.round(Q.c/Q.n*100):0,avg=Q.n?Q.ms/Q.n/1000:0,miss=Q.wrong.some(x=>((D.items[S.lang+x.k]||{}).w||0)>=3),r=intr?awardI(Q.n,p):award(p,avg,miss,(Q.sp||0)>0);
 if(Q.n){D.hist.push({d:new Date().toLocaleDateString('ja-JP'),l:S.lang,n:Q.n,c:Q.c});D.hist=D.hist.slice(-30)}save();
 const seen=[...new Set(Q.wrong.map(x=>x.k))].map(k=>Q.wrong.find(x=>x.k==k));
 const tier=intr&&Q.n<=3?5:tierOf(p,Q.n); // 速攻リタイア（3問以内）は一番暗い曲・エフェクト
 app.innerHTML=`<div class=card id=rcard data-tier=${tier}><div class=chr>${r.ch}</div><small>${intr?'リタイアした あなたの称号は…':'あなたの称号は…'}</small><h2 style="font-size:2rem">${r.t}</h2>${r.isNew?'<span class=tag>🎁 NEW! コレクションに追加</span>':'<small>ゲット済みの称号です</small>'}
 <div style="font-size:1.2rem;margin-top:8px">${!Q.n?'1問も解かずにリタイア':intr?'ここまで '+Q.n+'問 ・ '+Q.c+'問 正解（'+p+'%）':Q.n+'問中 '+Q.c+'問 正解（'+p+'%）'}</div>${intr?'<small>10問以内でおわったので、リタイア称号です</small><br>':''}${Q.n?'<small>平均 '+avg.toFixed(1)+'秒 / 問</small>':''}</div>
 ${seen.length?'<h3>まちがえた問題（多めに出ます）</h3>'+seen.map(x=>`<div class=row><span>${x.a[0]}</span><span>${x.a[S.lang]}</span></div>`).join(''):Q.n?'<h3>ノーミス！すごい🎊</h3>':''}
 <button class=big onclick="start()">もう一回！</button><button class="big alt" onclick="home()">ホームへ</button>`;
 try{sessionStorage.setItem('kp_r',JSON.stringify({html:app.innerHTML,tier}))}catch(e){}
 resultFx(tier)}
function rclear(){try{sessionStorage.removeItem('kp_r')}catch(e){}}
function rrestore(){try{const s=JSON.parse(sessionStorage.getItem('kp_r')||'null');if(!s)return false;app.innerHTML=s.html;resultFx(s.tier);return true}catch(e){return false}}
