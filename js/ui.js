// 画面: ホーム / オプション / アカウント / きろく
const app=document.getElementById('app'),modal=document.getElementById('modal');
const grp=(k,o,f='set',c='chips')=>`<div class=${c}>${o.map(([v,l])=>`<button class="chip ${S[k]===v?'on':''}" onclick="${f}('${k}',${JSON.stringify(v).replace(/"/g,"'")})">${l}</button>`).join('')}</div>`;
const set=(k,v)=>{S[k]=v;if(k=='lang')S.grp=0;save();home();if(k=='fmt'&&v!='c')toast('入力のときは、外国語の答えに専用キーボードが出るよ（⌨で端末のキーボードに切り替えもOK）')};
const setO=(k,v)=>{S[k]=v;save();optShow()};
const setVol=v=>{S.vol=+v;save();SND.ok()};
// KL: 出題の選択肢（文字の読み書きは、対応する言語のときだけ出す）
const KL=()=>[['mix','ミックス'],...(P.some(x=>x.lg==S.lang)?[['b','文字の読み書き']]:[]),['w','単語のみ'],['s','文章のみ'],['r','まちがい復習（'+rev().length+'）']],FM=[['mix','ミックス'],['c','4択'],['t','入力']],AN=[['tr','翻訳','聞いた言葉を訳そう！'],['li','聞き取り','聞いた言葉をそのまま返そう！'],['qa','質疑応答','質問に対して回答しよう！']];
const optsHTML=f=>`<h3>⏱ 制限時間</h3>${grp('time',[[0,'なし'],[10,'10秒'],[15,'15秒']],f)}
<h3>➡ 解説のあと</h3>${grp('auto',[[0,'手動（つぎへ）'],[1,'自動で進む']],f)}
<h3>🔥 苦手を多めに出す</h3>${grp('boost',[[1,'ON'],[0,'OFF']],f)}
<h3>🔊 音量　<small>（0でミュート）</small></h3><div class=vol><input type=range min=0 max=10 step=1 value=${S.vol} style="--f:${S.vol/10}" aria-label=音量 oninput="this.nextElementSibling.textContent=this.value;this.style.setProperty('--f',this.value/10)" onchange="setVol(this.value)"><b>${S.vol}</b></div>
<div class=vt><button class=sm onclick="voiceTest()">🔈 読み上げテスト</button><small id=vst class=vst>${typeof voiceInfo=='function'?voiceInfo():''}</small></div>`;
const SAMPLE=['','Hello','你好','안녕하세요','Hola','Ciao','สวัสดี','Xin chào'];
function voiceTest(){speak(SAMPLE[S.lang]);const e=document.getElementById('vst');if(e)e.textContent=voiceInfo()}

function optOpen(){clearTimeout(tm);optShow()}
function optShow(){modal.innerHTML=`<div class=mask><div class=card><h2 style="margin:0">⚙ オプション</h2>${optsHTML('setO')}<h3>🔗 友だちに共有</h3><button class="big alt" onclick="shareApp()">📤 友だちに共有</button><small><span class=ph>LINE・Xなど、好きなアプリで</span><span class=ph>送れます。開かないときは</span><span class=ph>URLをコピーします。</span></small><h3>💌 意見・感想</h3><button class="big alt" onclick="window.open(CFG.formView,'_blank','noopener')">📨 意見箱を開く</button><small><span class=ph>Googleフォームが開きます。</span><span class=ph>送信先は管理者だけに届きます。</span></small>
 <button class=sm onclick="notes()">📝 リリースノート</button>
 <button class=big onclick="optClose()">とじる</button></div></div>`}
function notes(){modal.innerHTML=`<div class=mask><div class=card><h2 style="margin:0">📝 リリースノート</h2>${RN.length?`<table class=rn>${RN.map(r=>`<tr><th><span class=vtag>${r.v}</span><small>${r.date}</small></th><td><ul>${r.items.map(i=>`<li>${i}</li>`).join('')}</ul></td></tr>`).join('')}</table>`:'まだありません'}<button class=big onclick="optShow()">もどる</button></div></div>`}
function optClose(){modal.innerHTML='';if(document.getElementById('qc')&&!Q.lock)startT()}

// ホーム: すべてリスト（プルダウン）式。1つの白いパネルにまとめて、縦幅を詰める
const selH=(id,k,o,num)=>`<span class=sw><select id=${id} onchange="set('${k}',${num?'+this.value':'this.value'})">${o.map(([v,l,off])=>`<option value="${v}"${S[k]==v?' selected':''}${off?' disabled':''}>${l}</option>`).join('')}</select></span>`;
const fld=(id,cap,sel,right='')=>`<div class=fld><div class=fcap><label for=${id}>${cap}</label>${right}</div>${sel}</div>`;
const toast=m=>{const e=document.createElement('div');e.className='toast';e.setAttribute('role','status');e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2400)};
const tbtnOff=()=>toast('文字表は、'+ORD.filter(l=>P.some(x=>x.lg==l)).map(l=>LS[l]).join('・')+'で見られるよ');
function home(){clearTimeout(tm);
 const qa=S.ans=='qa',bk=!qa&&S.kind=='b'&&P.some(x=>x.lg==S.lang); // 文字の読み書きは、レベルの代わりに「文字の種類」を選ぶ
 const hasB=P.some(x=>x.lg==S.lang);
 const lvN=LV.map((l,i)=>i?P.filter(x=>(S.ans=='qa'?x.t=='q':x.t!='b'&&x.t!='q')&&x.l==i&&x.a[S.lang]).length:1); // この言語の、レベルごとの収録数（0なら「準備中」）
 if(S.lvl&&!lvN[S.lvl]){S.lvl=0;save()}
 if(S.grp>(GR[S.lang]||[]).length){S.grp=0;save()}
 if(S.kind=='b'&&!hasB){S.kind='mix';save()}
 const none=lvN.map((n,i)=>i&&!n?LV[i][0]:'').join('');
 app.innerHTML=`<div class=top><button class=sm onclick="acct()">👤 ${uname()}</button><button class=sm onclick="optOpen()">⚙</button></div>
 <h1 class=hm><span>🎈</span> ことばパーティ</h1>
 ${INAPP?`<div class="tip c" style="background:#fff3cd"><span class=ph>⚠ このアプリ内では</span><span class=ph>音が出ないよ。</span><span class=ph>右上メニューから</span><span class=ph>「ブラウザで開く」を選んでね</span></div>`:''}<div class="tip c"><span class=ph>✨ ⚙で</span><span class=ph>時間・音量・</span><span class=ph>意見の送信も</span><span class=ph>できるよ🎵</span></div>
 <div class=panel>
 ${fld('f-lang','🌍 学ぶ言語',selH('f-lang','lang',ORD.map(i=>[i,F[i]+' '+L[i]]),1),`<button class="sm tbtn${hasB?'':' off'}"${hasB?'':' aria-disabled=true'} onclick="${hasB?'tbl()':'tbtnOff()'}">📖 文字表</button>`)}
 ${fld('f-kind','📚 出題',selH('f-kind','kind',qa?[['mix','質疑応答の問題']]:KL()))}
 ${bk?fld('f-lvl','🔤 文字の種類',selH('f-lvl','grp',[[0,'すべて'],...(GR[S.lang]||[]).map((n,i)=>[i+1,n])],1)):fld('f-lvl','🎯 レベル',selH('f-lvl','lvl',LV.map((l,i)=>[i,l+(i&&!lvN[i]?'（準備中）':''),i&&!lvN[i]]),1),none?`<span class=note>※ ${none}は準備中</span>`:'')}
 <div class=fld><div class=fcap><label id=f-ans>🎓 回答</label></div><div class=rg role=radiogroup aria-labelledby=f-ans>${AN.map(([v,n,d])=>`<button type=button role=radio aria-checked=${S.ans==v} class="rb${S.ans==v?' on':''}" onclick="set('ans','${v}')"><b>${n}</b><small>（${d}）</small></button>`).join('')}</div></div>
<div class=fld><div class=fcap><label id=f-dir>🔄 翻訳</label>${S.ans!='tr'?'<span class=note>※ 回答が「翻訳」のとき選べます</span>':''}</div><div class="rg r3${S.ans!='tr'?' dis':''}" role=radiogroup aria-labelledby=f-dir>${(bk?[['mix','ミックス','ランダム'],['f2j','文字','⇒ローマ字'],['j2f','ローマ字','⇒文字']]:[['mix','ミックス','ランダム'],['f2j',LS[S.lang],'⇒日本語'],['j2f','日本語','⇒'+LS[S.lang]]]).map(([v,a,b])=>`<button type=button role=radio aria-checked=${S.dir==v} ${S.ans!='tr'?'disabled ':''}class="rb${S.dir==v?' on':''}" onclick="set('dir','${v}')"><b>${a}</b><b>${b}</b></button>`).join('')}</div></div>

 <div class=fgrid>
 ${fld('f-mode','🔢 問題数',selH('f-mode','mode',[[0,'♾ ひたすら'],[10,'10問'],[20,'20問'],[30,'30問']],1))}
 ${fld('f-fmt','✍ 形式',selH('f-fmt','fmt',qa?[['c','4択のみ']]:FM))}
 </div>
 </div>
 <button class=big onclick="start()">スタート！</button><button class="big alt sub" onclick="stats()">📊 きろく・称号</button>
 ${TB?'<small>例文の一部: <a href="https://tatoeba.org" target=_blank rel=noopener>Tatoeba</a>（CC BY 2.0 FR）</small>':''}`;
 if(qa)['f-fmt','f-kind'].forEach(i=>{document.getElementById(i).disabled=true});}

function tbl(){const x=P.filter(p=>p.lg==S.lang);
 const cf={3:HGT.html,2:CT.zh,6:CT.th,7:CT.vi}[S.lang];if(cf){app.innerHTML=cf();window.scrollTo(0,0);return}
 app.innerHTML=`<h1>📖 ${L[S.lang]}の文字表</h1><small>タップすると発音が聞けます</small><div style="text-align:center">${x.map(p=>`<button class=card style="display:inline-block;margin:5px;padding:8px 14px;font:inherit;color:inherit;cursor:pointer" onclick="speak('${p.a[S.lang]}')"><b style="font-size:1.7rem">${p.a[S.lang]}</b><br><small>${p.a[0]}</small></button>`).join('')}</div><button class=big onclick="home()">もどる</button>`}
function acct(){const e=m=>`<div class=err id=er>${m||''}</div>`;
 app.innerHTML=ACC?`<h1>👤 アカウント</h1><div class=card><small>${ACC}</small><h3>なまえ（12文字まで）</h3>
 <input id=nm class=in value="${AC[ACC].name}"><button class="big m" onclick="rename(nm.value);acct()">なまえを変更</button></div>
 <button class="big alt" onclick="setAcc(null);acct()">ログアウト</button>
 <button class=sm onclick="if(confirm('このアカウントの記録をすべて消します。よろしいですか？')){resetRec();acct()}">記録をリセット</button>
 <button class=big onclick="home()">もどる</button>`
 :`<h1>👤 ログイン</h1><div class=card style="text-align:left"><small><span class=ph>ログインしなくても遊べます。</span><span class=ph>ログインすると記録がアカウントごとに残ります。</span></small>
 <h3>メールアドレス</h3><input id=em class=in type=email autocomplete=username><h3>パスワード（半角英数字6文字以上）</h3><input id=pw class=in type=password autocomplete=current-password>${e()}
 <button class="big m" onclick="auth(login)">ログイン</button><button class="big alt" onclick="auth(reg)">新規登録</button></div><button class=big onclick="home()">もどる</button>`}
async function auth(f){const m=await f(em.value,pw.value);m?er.textContent=m:acct()}

const weakOf=l=>P.filter(x=>x.a[l]&&(!x.lg||x.lg==l)).map(x=>({x,s:(D.items[l+x.k]||{}).s||0})).filter(o=>o.s>0).sort((a,b)=>b.s-a.s);
function stats(tab){tab=tab||'rec';
 const tabs=`<div class=tabs><button class="chip ${tab=='rec'?'on':''}" onclick="stats('rec')">📊 きろく</button><button class="chip ${tab=='ttl'?'on':''}" onclick="stats('ttl')">🏅 称号</button></div>`;
 let body;
 if(tab=='rec'){
  const rows=ORD.map(i=>{const t=D.tot[i]||{n:0,c:0},p=t.n?Math.round(t.c/t.n*100):0;
   return`<div class=stat><span class=nm>${F[i]} ${LS[i]}<small>(${NT[i]})</small></span><div class=meter><i style="width:${p}%"></i></div><span class=vl>${p}%<br><small>(${t.n}問)</small></span></div>`}).join('');
  const wk=ORD.map(l=>{const w=weakOf(l);return`<details class=wk><summary><span class=wn>${F[l]} ${LS[l]} <small>(${NT[l]})</small></span><span class=wc>${w.length}件</span></summary>${w.length?w.slice(0,10).map(o=>`<div class=row><span>${o.x.a[0]}</span><span>${o.x.a[l]}</span></div>`).join('')+(w.length>10?`<small>ほか ${w.length-10}件</small>`:''):'<small>まだ苦手はありません！</small>'}</details>`}).join('');
  const h=D.hist.slice(-5).reverse().map(h=>`<div class=row><span>${h.d} ${F[h.l]}</span><span>${h.c}/${h.n}</span></div>`).join('');
  body=`<div class=card style="text-align:left"><b>正解率</b>${rows}</div>
  <h3>😵 苦手ランキング　<small>（言語名をタップで開閉）</small></h3>${wk}
  ${h?'<h3>さいきんの結果</h3>'+h:''}<button class=sm onclick="if(confirm('記録をすべて消しますか？')){resetRec();stats()}">記録をリセット</button>`}
 else{
  const all=TL.map((o,i)=>({i,o,t:o.n,c:D.titles[o.n]||0})),cards=[],cardsI=[];
  const own=all.filter(x=>x.c>0),top=own.slice().sort((p,q)=>q.c-p.c)[0],tie=top?own.filter(o=>o.c==top.c).length-1:0,got=own.length;
  const topH=top?`<button class="card topt" onclick="tpop(${top.i})"><small>👑 いちばん多い称号（あなたの傾向）</small><div style="font-size:3rem;line-height:1.3">${top.o.e}</div><b>${top.t}</b><div><small>×${top.c}回</small></div><small>${tCond(top.o)}</small>${tie?`<br><small>同じ回数の称号が、ほか${tie}個あります</small>`:''}</button>`:'<div class=card><small>まだ称号がありません。問題を最後まで解くと、ここに集まります。</small></div>';
  all.forEach(({i,o,t,c})=>{
   (o.q?cardsI:cards).push(c?`<button class=tc onclick="tpop(${i})"><div style="font-size:2.3rem">${o.e}</div><b>${t}</b><small>×${c}</small></button>`
   :`<div class="tc lock"><div style="font-size:2rem">❓</div><b>？？？</b><small>${tCond(o).replace(/・/g,'<br>')}</small></div>`)});
  body=`${topH}<h3>🏅 称号コレクション ${got} / ${TOTAL}</h3><small>集めた称号をタップすると、もう一度見られます</small><div class=tg style="margin-top:8px">${cards.join('')}</div>
  <h3>🏳️ リタイア称号　<small>（10問以内でおわると、もらえるよ）</small></h3><div class=tg>${cardsI.join('')}</div>`}
 app.innerHTML=`<h1>${tab=='rec'?'📊 きろく':'🏅 称号'}</h1><small>👤 ${uname()}${ACC?'':'（この端末のみ）'}</small>${tabs}${body}<button class=big onclick="home()">もどる</button>`}
const closeM=()=>{modal.innerHTML=''};
function tpop(i){const o=TL[i],c=D.titles[o.n]||0;
 modal.innerHTML=`<div class=mask onclick="closeM()"><div class="card pop" onclick="event.stopPropagation()"><div class=chr>${o.e}</div><small>称号</small><h2>${o.n}</h2><div>${tCond(o)}</div><small>獲得 ${c} 回</small><button class=big onclick="closeM()">とじる</button></div></div>`;SND.ok()}
