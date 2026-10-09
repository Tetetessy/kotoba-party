// 画面: ホーム / オプション / アカウント / きろく
const app=document.getElementById('app'),modal=document.getElementById('modal');
const grp=(k,o,f='set')=>`<div class=chips>${o.map(([v,l])=>`<button class="chip ${S[k]===v?'on':''}" onclick="${f}('${k}',${JSON.stringify(v).replace(/"/g,"'")})">${l}</button>`).join('')}</div>`;
const set=(k,v)=>{S[k]=v;save();home()};
const setO=(k,v)=>{S[k]=v;save();optShow();if(k=='vol')SND.ok()};
const KL=()=>[['mix','ミックス'],['w','単語のみ'],['s','文章のみ'],['r','🔁 まちがい復習（'+rev().length+'）'],...(P.some(x=>x.lg==S.lang)?[['b','文字・発音']]:[])],FM=[['mix','ミックス'],['c','4択'],['t','入力']];
const optsHTML=f=>`<h3>⏱ 制限時間</h3>${grp('time',[[0,'なし'],[10,'10秒'],[15,'15秒']],f)}
<h3>➡ 解説のあと</h3>${grp('auto',[[0,'手動（つぎへ）'],[1,'自動で進む']],f)}
<h3>📚 出題</h3>${grp('kind',KL(),f)}
<h3>✍ 形式</h3>${grp('fmt',FM,f)}
<h3>🔥 苦手を多めに出す</h3>${grp('boost',[[1,'ON'],[0,'OFF']],f)}
<h3>🔊 音量（0で効果音オフ）</h3>${grp('vol',[0,1,2,3,4,5,6,7,8,9,10].map(v=>[v,''+v]),f)}`;

function optOpen(){clearTimeout(tm);optShow()}
function optShow(){modal.innerHTML=`<div class=mask><div class=card><h2 style="margin:0">⚙ オプション</h2>${optsHTML('setO')}<h3>💌 意見・感想</h3><button class="big alt" onclick="window.open(CFG.formView,'_blank','noopener')">📨 意見箱を開く</button><small><span class=ph>Googleフォームが開きます。</span><span class=ph>送信先は管理者だけに届きます。</span></small>
 <button class=sm onclick="notes()">📝 リリースノート</button>
 <button class=big onclick="optClose()">とじる</button></div></div>`}
function notes(){modal.innerHTML=`<div class=mask><div class=card><h2 style="margin:0">📝 リリースノート</h2>${RN.map(r=>`<h3>${r.v}（${r.date}）</h3><ul>${r.items.map(i=>`<li>${i}</li>`).join('')}</ul>`).join('')||'まだありません'}<button class=big onclick="optShow()">もどる</button></div></div>`}
function optClose(){modal.innerHTML='';if(document.getElementById('qc')&&!Q.lock)startT()}

function home(){clearTimeout(tm);
 app.innerHTML=`<div class=top><button class=sm onclick="acct()">👤 ${uname()}</button><button class=sm onclick="optOpen()">⚙</button></div>
 <h1><span>🎈</span> ことばパーティ</h1>
 <div class=tip><span class=ph>✨ 右上の⚙で、</span><span class=ph>制限時間・自動で次へ・音量・まちがい復習の設定や、</span><span class=ph>意見の送信もできるよ！</span><span class=ph>のぞいてみてね🎵</span></div>
 <h3>学ぶ言語</h3>${grp('lang',ORD.map(i=>[i,F[i]+' '+L[i]]))}
 <h3>🎯 レベル</h3><select class=sel onchange="set('lvl',+this.value)">${LV.map((l,i)=>`<option value=${i} ${S.lvl==i?'selected':''}>${l}</option>`).join('')}</select>
 <h3>🔢 問題数</h3>${grp('mode',[[0,'♾ ひたすら'],[10,'10問'],[20,'20問'],[30,'30問']])}
 <h3>📚 出題</h3>${grp('kind',KL())}<h3>✍ 形式</h3>${grp('fmt',FM)}
 ${S.lang>4?'<small><span class=ph>※ この言語は</span><span class=ph>レベル①〜③のみ</span><span class=ph>収録済みです。</span><span class=ph>（④以降は順次追加）</span></small>':''}
 ${P.some(x=>x.lg==S.lang)?'<button class="big m" onclick="tbl()">📖 文字表を見る</button>':''}<button class=big onclick="start()">スタート！</button><button class="big alt" onclick="stats()">📊 きろく・称号</button>
 ${TB?'<small>例文の一部: <a href="https://tatoeba.org" target=_blank rel=noopener>Tatoeba</a>（CC BY 2.0 FR）</small>':''}`}

function tbl(){const x=P.filter(p=>p.lg==S.lang);
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

function stats(tab){tab=tab||'rec';
 const tabs=`<div class=tabs><button class="chip ${tab=='rec'?'on':''}" onclick="stats('rec')">📊 きろく</button><button class="chip ${tab=='ttl'?'on':''}" onclick="stats('ttl')">🏅 称号</button></div>`;
 let body;
 if(tab=='rec'){
  const rows=ORD.map(i=>{const t=D.tot[i]||{n:0,c:0},p=t.n?Math.round(t.c/t.n*100):0;
   return`<div class=stat><span class=nm>${F[i]} ${L[i]}</span><div class=meter><i style="width:${p}%"></i></div><span class=vl>${p}%<br><small>(${t.n}問)</small></span></div>`}).join('');
  const weak=P.map(x=>({x,s:(D.items[S.lang+x.k]||{}).s||0})).filter(o=>o.s>0).sort((a,b)=>b.s-a.s).slice(0,8);
  const h=D.hist.slice(-5).reverse().map(h=>`<div class=row><span>${h.d} ${F[h.l]}</span><span>${h.c}/${h.n}</span></div>`).join('');
  body=`<div class=card style="text-align:left"><b>正解率</b>${rows}</div>
  <h3>${F[S.lang]} ${L[S.lang]} の苦手ランキング</h3>${weak.length?weak.map(o=>`<div class=row><span>${o.x.a[0]}</span><span>${o.x.a[S.lang]}</span></div>`).join(''):'<div class=card>まだ苦手はありません！</div>'}
  ${h?'<h3>さいきんの結果</h3>'+h:''}<button class=sm onclick="if(confirm('記録をすべて消しますか？')){resetRec();stats()}">記録をリセット</button>`}
 else{
  const got=Object.keys(D.titles).length,cards=[];
  TT.forEach((r,a)=>r.forEach((ns,s)=>ns.forEach((n,k)=>{const t=EM[a]+n,c=D.titles[t];
   cards.push(c?`<button class=tc onclick="tpop(${a},${s},${k})"><div style="font-size:2.3rem">${CH[a]}</div><b>${t}</b><small>×${c}</small></button>`
   :`<div class="tc lock"><div style="font-size:2rem">❓</div><b>？？？</b><small>${AL[a]}<br>${SL[s]}</small></div>`)})));
  body=`<h3>🏅 称号コレクション ${got} / ${TOTAL}</h3><small>集めた称号をタップすると、もう一度見られます</small><div class=tg style="margin-top:8px">${cards.join('')}</div>`}
 app.innerHTML=`<h1>${tab=='rec'?'📊 きろく':'🏅 称号'}</h1><small>👤 ${uname()}${ACC?'':'（ゲスト：この端末のみ）'}</small>${tabs}${body}<button class=big onclick="home()">もどる</button>`}
const closeM=()=>{modal.innerHTML=''};
function tpop(a,s,k){const n=TT[a][s][k],c=D.titles[EM[a]+n]||0;
 modal.innerHTML=`<div class=mask onclick="closeM()"><div class="card pop" onclick="event.stopPropagation()"><div class=chr>${CH[a]}</div><small>称号</small><h2>${EM[a]}${n}</h2><div>${AL[a]}・${SL[s]}</div><small>獲得 ${c} 回</small><button class=big onclick="closeM()">とじる</button></div></div>`;SND.ok()}
