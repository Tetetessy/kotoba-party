// 画面: ホーム / オプション / アカウント / きろく
const app=document.getElementById('app'),modal=document.getElementById('modal');
const grp=(k,o,f='set')=>`<div class=chips>${o.map(([v,l])=>`<button class="chip ${S[k]===v?'on':''}" onclick="${f}('${k}',${JSON.stringify(v).replace(/"/g,"'")})">${l}</button>`).join('')}</div>`;
const set=(k,v)=>{S[k]=v;save();home()};
const setO=(k,v)=>{S[k]=v;save();optShow()};
const optsHTML=f=>`<h3>⏱ 制限時間</h3>${grp('time',[[0,'なし'],[10,'10秒'],[15,'15秒']],f)}
<h3>➡ 解説のあと</h3>${grp('auto',[[0,'手動（つぎへ）'],[1,'自動で進む']],f)}
<h3>📚 出題</h3>${grp('kind',[['mix','ミックス'],['w','単語のみ'],['s','文章のみ']],f)}
<h3>✍ 形式</h3>${grp('fmt',[['mix','ミックス'],['c','4択'],['t','入力']],f)}
<h3>🔊 効果音</h3>${grp('snd',[[1,'ON'],[0,'OFF']],f)}`;

function optOpen(){clearTimeout(tm);optShow()}
function optShow(){modal.innerHTML=`<div class=mask><div class=card><h2 style="margin:0">⚙ オプション</h2>${optsHTML('setO')}<button class=big onclick="optClose()">とじる</button></div></div>`}
function optClose(){modal.innerHTML='';if(document.getElementById('qc')&&!Q.lock)startT()}

function home(){clearTimeout(tm);
 app.innerHTML=`<div class=top><button class=sm onclick="acct()">👤 ${uname()}</button><button class=sm onclick="optOpen()">⚙</button></div>
 <h1><span>🎈</span> ことばパーティ</h1>
 <h3>学ぶ言語</h3>${grp('lang',[1,2,3,4].map(i=>[i,F[i]+' '+L[i]]))}
 <h3>🎯 レベル</h3><select class=sel onchange="set('lvl',+this.value)">${LV.map((l,i)=>`<option value=${i} ${S.lvl==i?'selected':''}>${l}</option>`).join('')}</select>
 <h3>🔢 問題数</h3>${grp('mode',[[0,'♾ ひたすら'],[10,'10問'],[20,'20問'],[30,'30問']])}
 ${optsHTML('set')}
 <button class=big onclick="start()">スタート！</button><button class="big alt" onclick="stats()">📊 きろく・称号</button>`}

function acct(){const e=m=>`<div class=err id=er>${m||''}</div>`;
 app.innerHTML=ACC?`<h1>👤 アカウント</h1><div class=card><small>${ACC}</small><h3>なまえ（12文字まで）</h3>
 <input id=nm class=in value="${AC[ACC].name}"><button class="big m" onclick="rename(nm.value);acct()">なまえを変更</button></div>
 <button class="big alt" onclick="setAcc(null);acct()">ログアウト</button>
 <button class=sm onclick="if(confirm('このアカウントの記録をすべて消します。よろしいですか？')){resetRec();acct()}">記録をリセット</button>
 <button class=big onclick="home()">もどる</button>`
 :`<h1>👤 ログイン</h1><div class=card style="text-align:left"><small>ログインしなくても遊べます。ログインすると記録がアカウントごとに残ります。</small>
 <h3>メールアドレス</h3><input id=em class=in type=email autocomplete=username><h3>パスワード（半角英数字6文字以上）</h3><input id=pw class=in type=password autocomplete=current-password>${e()}
 <button class="big m" onclick="auth(login)">ログイン</button><button class="big alt" onclick="auth(reg)">新規登録</button></div><button class=big onclick="home()">もどる</button>`}
async function auth(f){const m=await f(em.value,pw.value);m?er.textContent=m:acct()}

function stats(){
 const rows=[1,2,3,4].map(i=>{const t=D.tot[i]||{n:0,c:0},p=t.n?Math.round(t.c/t.n*100):0;
  return`<div class=row><span>${F[i]} ${L[i]}</span><div class=meter><i style="width:${p}%"></i></div><span>${p}% <small>(${t.n}問)</small></span></div>`}).join('');
 const weak=P.map(x=>({x,s:(D.items[S.lang+x.k]||{}).s||0})).filter(o=>o.s>0).sort((a,b)=>b.s-a.s).slice(0,8);
 const got=Object.keys(D.titles),h=D.hist.slice(-5).reverse().map(h=>`<div class=row><span>${h.d} ${F[h.l]}</span><span>${h.c}/${h.n}</span></div>`).join('');
 app.innerHTML=`<h1>📊 きろく</h1><small>👤 ${uname()}${ACC?'':'（ゲスト：この端末のみ）'}</small>
 <div class=card style="text-align:left"><b>正解率</b>${rows}</div>
 <h3>🏅 称号コレクション ${got.length} / ${TOTAL}</h3><div class=chips>${got.map(t=>`<span class=chip>${t} ×${D.titles[t]}</span>`).join('')||'まだありません'}</div>
 <h3>${F[S.lang]} ${L[S.lang]} の苦手ランキング</h3>${weak.length?weak.map(o=>`<div class=row><span>${o.x.a[0]}</span><span>${o.x.a[S.lang]}</span></div>`).join(''):'<div class=card>まだ苦手はありません！</div>'}
 ${h?'<h3>さいきんの結果</h3>'+h:''}<button class=big onclick="home()">もどる</button>
 <button class=sm onclick="if(confirm('記録をすべて消しますか？')){resetRec();stats()}">記録をリセット</button>`}
