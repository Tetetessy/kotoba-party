// 画面: ホーム / オプション / アカウント / きろく
const app=document.getElementById('app'),modal=document.getElementById('modal');
const grp=(k,o,f='set',c='chips')=>`<div class=${c}>${o.map(([v,l])=>`<button class="chip ${S[k]===v?'on':''}" onclick="${f}('${k}',${JSON.stringify(v).replace(/"/g,"'")})">${l}</button>`).join('')}</div>`;
const set=(k,v)=>{if(k=='stage'||(k=='ans'&&(v=='qa'||S.ans=='qa')))S.lvl=1;S[k]=v;if(k=='lang')S.grp=0;save();home();if(k=='fmt'&&v!='c')toast('入力のときは、外国語の答えに専用キーボードが出るよ（⌨で端末のキーボードに切り替えもOK）')};
const setO=(k,v)=>{S[k]=v;save();optShow()};
const setVol=(k,v)=>{S[k]=+v;save();if(k=='bgm'||k=='vol')BGM.vol();if(k=='se'||k=='vol')SND.ok();if(k=='voi')speak(SAMPLE[S.lang]||'Hello')};
// KL: 出題の選択肢（文字の読み書きは、対応する言語のときだけ出す）
const KL=()=>[['mix','ミックス'],['w','単語のみ'],['s','文章のみ'],['r','まちがい復習']],FM=[['mix','ミックス'],['c','4択'],['t','入力']],AN=[['tr','翻訳','聞いた言葉を訳そう！'],['li','聞き取り','聞いた言葉をそのまま返そう！'],['qa','質疑応答','質問に対して回答しよう！']];
const optsHTML=f=>`<h3>⏱ 制限時間</h3>${grp('time',[[0,'なし'],[10,'10秒'],[15,'15秒']],f)}
<h3>➡ 解説のあと</h3>${grp('auto',[[0,'手動（つぎへ）'],[1,'自動で進む']],f)}
<h3>🔥 苦手を多めに出す</h3>${grp('boost',[[1,'ON'],[0,'OFF']],f)}
<h3>🔊 全体の音量　<small>（0でミュート）</small></h3><div class=vol><input type=range min=0 max=10 step=1 value=${S.vol} style="--f:${S.vol/10}" aria-label="🔊 全体の音量　<small>（0でミュート）</small>" oninput="this.nextElementSibling.textContent=this.value;this.style.setProperty('--f',this.value/10);BGM.vol&&(S.vol=+this.value,BGM.vol())" onchange="setVol('vol',this.value)"><b>${S.vol}</b></div>
<h3>🎵 BGM</h3><div class=vol><input type=range min=0 max=10 step=1 value=${S.bgm} style="--f:${S.bgm/10}" aria-label="🎵 BGM" oninput="this.nextElementSibling.textContent=this.value;this.style.setProperty('--f',this.value/10);BGM.vol&&(S.bgm=+this.value,BGM.vol())" onchange="setVol('bgm',this.value)"><b>${S.bgm}</b></div>
<h3>🔔 効果音（SE）</h3><div class=vol><input type=range min=0 max=10 step=1 value=${S.se} style="--f:${S.se/10}" aria-label="🔔 効果音（SE）" oninput="this.nextElementSibling.textContent=this.value;this.style.setProperty('--f',this.value/10);BGM.vol&&(S.se=+this.value,BGM.vol())" onchange="setVol('se',this.value)"><b>${S.se}</b></div>
<h3>🗣 読み上げ（Voice）</h3><div class=vol><input type=range min=0 max=10 step=1 value=${S.voi} style="--f:${S.voi/10}" aria-label="🗣 読み上げ（Voice）" oninput="this.nextElementSibling.textContent=this.value;this.style.setProperty('--f',this.value/10);BGM.vol&&(S.voi=+this.value,BGM.vol())" onchange="setVol('voi',this.value)"><b>${S.voi}</b></div>
<div class=vt><button class=sm onclick="voiceTest()">🔈 読み上げテスト</button><small id=vst class=vst>${typeof voiceInfo=='function'?voiceInfo():''}</small></div>`;
const SAMPLE=['','Hello','你好','안녕하세요','Hola','Ciao','สวัสดี','Xin chào'];
function voiceTest(){speak(SAMPLE[S.lang]);const e=document.getElementById('vst');if(e)e.textContent=voiceInfo()}

function optOpen(){if(modal.innerHTML){optClose();return}clearTimeout(tm);optShow()}
function optShow(){modal.innerHTML=`<div class=mask><div class="card optc"><div class=mhead><h2>⚙ オプション</h2><button class="sm xbtn" onclick="optClose()" aria-label="閉じる">× とじる</button></div>${optsHTML('setO')}<div class=audionote><b>🎵 BGMを流していても、問題の音声は聞けます</b><small>（🔊ボタンや読み上げ）。BGMは上の「🎵 BGM」で小さくできます。</small></div><h3>📖 つかいかた</h3><button class="big alt" onclick="tutStart()">📖 チュートリアルを見る</button><h3>🔗 友だちに共有</h3><button class="big alt" onclick="shareApp()">📤 友だちに共有</button><small><span class=ph>LINE・Xなど、好きなアプリで</span><span class=ph>送れます。開かないときは</span><span class=ph>URLをコピーします。</span></small>${document.getElementById('qc')?'':'<h3>🎈 タイトル画面</h3><button class="big alt" onclick="optClose();showTitle()">🎈 タイトル画面にもどる</button>'}<h3>💌 意見・感想</h3><button class="big alt" onclick="window.open(CFG.formView,'_blank','noopener')">📨 意見箱を開く</button><small><span class=ph>Googleフォームが開きます。</span><span class=ph>送信先は管理者だけに届きます。</span></small>
 <h3>📋 アプリの情報</h3><div class=infobtns><button class=sm onclick="notes()">📝 リリースノート</button><button class=sm onclick="envOpen()">🛠 環境・開発の情報</button></div>
 <button class=big onclick="optClose()">とじる</button></div></div>`}
function notes(){modal.innerHTML=`<div class=mask><div class="card optc"><div class=mhead><h2>📝 リリースノート</h2><button class="sm xbtn" onclick="optClose()" aria-label="閉じる">× とじる</button></div>${RN.length?`<table class=rn>${RN.map(r=>`<tr><th><span class=vtag>${r.v}</span><small>${r.date}</small></th><td><ul>${r.items.map(i=>`<li>${i}</li>`).join('')}</ul></td></tr>`).join('')}</table>`:'まだありません'}<button class=big onclick="optShow()">もどる</button></div></div>`}
function optClose(){modal.innerHTML='';if(document.getElementById('qc')&&!Q.lock)startT()}

// ホーム: すべてリスト（プルダウン）式。1つの白いパネルにまとめて、縦幅を詰める
const selH=(id,k,o,num)=>`<span class=sw><select id=${id} onchange="set('${k}',${num?'+this.value':'this.value'})">${o.map(([v,l,off])=>`<option value="${v}"${S[k]==v?' selected':''}${off?' disabled':''}>${l}</option>`).join('')}</select></span>`;
const fld=(id,cap,sel,right='')=>`<div class=fld><div class=fcap><label for=${id}>${cap}</label>${right}</div>${sel}</div>`;
const toast=m=>{const e=document.createElement('div');e.className='toast';e.setAttribute('role','status');e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2400)};
const tbtnOff=()=>toast('文字表は、'+ORD.filter(l=>P.some(x=>x.lg==l)).map(l=>LS[l]).join('・')+'で見られるよ');
function home(){clearTimeout(tm);qclear();rclear();try{document.getElementById('rfx')&&document.getElementById('rfx').remove()}catch(e){}
 const qa=S.ans=='qa',hasB=P.some(x=>x.lg==S.lang),st=stg();
 const CL=st=='b'?BEG.map((g,i)=>[i,g.n]).filter(([i])=>i>0||hasB):NOR.map((n,i)=>[i+1,n]); // 内容の一覧（ビギナーは⓪文字をローマ字以外の言語だけ）
 const cnt=i=>P.filter(x=>inC(x,i,st)&&x.a[S.lang]).length; // この言語の収録数（0なら「準備中」）
 const CLO=CL.map(([i,n])=>[i,n+(cnt(i)?'':'（準備中）'),!cnt(i)]);
 if(!CL.some(([i])=>i==S.lvl&&cnt(i))){S.lvl=(CL.find(([i])=>cnt(i))||CL[0])[0];save()}
 const bk=!qa&&st=='b'&&S.lvl==0; // 文字の読み書きは、内容のあとに「文字の種類」を選ぶ
 if(S.grp>(GR[S.lang]||[]).length){S.grp=0;save()}
 if(st=='b'&&S.kind!='w'){S.kind='w';save()} // ビギナーは単語だけなので、出題は「単語のみ」に固定
 const none=CLO.filter(o=>o[2]).map(o=>o[1].replace('（準備中）','')).join('・');
 const STG=[['b','ビギナー','初めたてはここからがおススメ！'],['n','ノーマル','慣れてきたらここ！']];
 app.innerHTML=`<div class=top><button class=sm onclick="acct()">👤 ${esc(uname())}</button><button class="sm nav" onclick="optOpen()">⚙</button></div>
 <h1 class=hm><span>🎈</span> ことばパーティ</h1>
 <div class=tutwrap><button class="chip on tutbanner" onclick="tutStart()">📖 チュートリアルを見る（使い方）</button></div>
 ${STORE_OK?'':'<div class="tip c warn"><span class=ph>⚠ この端末では記録が残りません</span><span class=ph>ページを閉じると、きろくは消えます</span></div>'} ${INAPP?`<div class="tip c" style="background:#fff3cd"><span class=ph>⚠ このアプリ内では</span><span class=ph>音が出ないことがあるよ</span></div>`:''}<div class="tip c info"><span class=ph>✨ ⚙で</span><span class=ph>時間・音量・</span><span class=ph>意見の送信も</span><span class=ph>できるよ</span></div>
 <div class=panel>
 ${fld('f-lang','🌍 学ぶ言語',selH('f-lang','lang',ORD.map(i=>[i,F[i]+' '+L[i]]),1),`<button class="sm tbtn" onclick="tbl()">🔤 文字表を見る</button>`)}
 <div class=fld><div class=fcap><label id=f-stg>🏅 レベル</label>${qa?'<span class=note>※ 質疑応答は、ノーマルの内容です</span>':''}</div><div class=rg role=radiogroup aria-labelledby=f-stg>${STG.map(([v,n,d])=>`<button type=button role=radio aria-checked=${st==v} class="rb${st==v?' on':''}" ${qa?'disabled ':''}onclick="set('stage','${v}')"><b>${n}</b><small>（${d}）</small></button>`).join('')}</div></div>
 ${fld('f-lvl','📚 内容',selH('f-lvl','lvl',CLO,1),none?`<span class=note>※ ${none}は準備中</span>`:'')}
 ${bk?fld('f-grp','🔤 文字の種類',selH('f-grp','grp',[[0,'すべて'],...(GR[S.lang]||[]).map((n,i)=>[i+1,n])],1)):''}
 ${fld('f-kind','✏ 出題',selH('f-kind','kind',qa?[['mix','質疑応答の問題']]:KL()),!qa&&st=='b'?'<span class=note>※ ビギナーは単語のみです</span>':'')}
 <div class=fld><div class=fcap><label id=f-ans>🎓 形式</label></div><div class=rg role=radiogroup aria-labelledby=f-ans>${AN.map(([v,n,d])=>`<button type=button role=radio aria-checked=${S.ans==v} class="rb${S.ans==v?' on':''}" onclick="set('ans','${v}')"><b>${n}</b><small>（${d}）</small></button>`).join('')}</div></div>
<div class=fld><div class=fcap><label id=f-dir>🔄 翻訳</label>${S.ans!='tr'?'<span class=note>※ 回答が「翻訳」のとき選べます</span>':''}</div><div class="rg r3${S.ans!='tr'?' dis':''}" role=radiogroup aria-labelledby=f-dir>${(bk?[['mix','ミックス','ランダム'],['f2j','文字','⇒ローマ字'],['j2f','ローマ字','⇒文字']]:[['mix','ミックス','ランダム'],['f2j',LS[S.lang],'⇒日本語'],['j2f','日本語','⇒'+LS[S.lang]]]).map(([v,a,b])=>`<button type=button role=radio aria-checked=${S.dir==v} ${S.ans!='tr'?'disabled ':''}class="rb${S.dir==v?' on':''}" onclick="set('dir','${v}')"><b>${a}</b><b>${b}</b></button>`).join('')}</div></div>

 <div class=fgrid>
 ${fld('f-mode','🔢 問題数',selH('f-mode','mode',[[0,'♾ ひたすら'],[10,'10問'],[20,'20問'],[30,'30問']],1))}
 ${fld('f-fmt','✍ 回答',selH('f-fmt','fmt',qa?[['c','4択のみ']]:FM))}
 </div>
 </div>
 <button class="big nav" onclick="start()">スタート！</button><button class="big alt sub nav" onclick="stats()">📊 きろく・称号</button>
 ${TB?'<small>例文の一部: <a href="https://tatoeba.org" target=_blank rel=noopener>Tatoeba</a>（CC BY 2.0 FR）</small>':''}`;
 if(qa)['f-fmt','f-kind'].forEach(i=>{document.getElementById(i).disabled=true});
 if(st=='b'&&!qa)document.getElementById('f-kind').disabled=true; // ビギナーは出題を選べない（単語のみ）
 tutHome(); // チュートリアル: 説明中ならハイライトし直す／初回なら自動で始める（tutorial.js）
}

function tbl(tab){const cf={3:HGT.html,2:CT.zh,6:CT.th,7:CT.vi,1:CT.en,4:CT.es,5:CT.it}[S.lang],hc=!!cf;
 tab=tab=='w'||tab=='g'?tab:(hc?'c':'w'); if(tab=='c'&&!hc)tab='w';
 const b=(k,t)=>`<button class="chip${tab==k?' on':''}" onclick="tbl('${k}')">${t}</button>`;
 const tabs=`<div class=ttabs><button class="sm nav" onclick="optOpen()">⚙</button>${hc?b('c','🔤 文字'):''}${b('w','📝 単語/フレーズ')}${b('g','📘 文法')}</div>`;
 app.innerHTML=tabs+(tab=='c'?cf():tab=='g'?GRHTML():BWHTML());if(tab=='c')kanaChips();window.scrollTo(0,0)}
// 文字表: ローマ字だけの文字に、カタカナ読みを ( ) で添える（韓国語は表に入っているので対象外）
function kanaChips(){const m=CHK[S.lang]||{};document.querySelectorAll('#app .hc').forEach(c=>{if(c.querySelector('em'))return;const k=['b','i','small'].map(s=>{const e=c.querySelector(s);return e&&m[e.textContent.trim()]}).find(Boolean);if(k){const e=document.createElement('em');e.textContent='('+k+')';c.appendChild(e)}})}
function GRHTML(){const l=S.lang,G=GRAM[l]||[];
 return `<h1 class=ctt><span class=ph>📘 ${LS[l]}の</span><span class=ph>文法</span></h1><small><span class=ph>基本の文法を、例文つきで載せています。</span><span class=ph>項目をタップすると開きます。</span></small>`
 +`<div class=bwall><button class=sm onclick="bwAll(true)">すべて開く</button><button class=sm onclick="bwAll(false)">すべて閉じる</button></div>`
 +G.map((s,i)=>`<details class="card hg bwd"><summary class=bwh><span>${'①②③④⑤⑥⑦⑧⑨⑩⑪⑫'[i]||''} ${s.t}</span></summary>${s.note?`<small class=gtn>${nb(s.note)}</small>`:''}${tabsHTML(s.tables||[])}</details>`).join('')
 +'<button class="big nav" onclick="home()">もどる</button>'}
// 基本単語の表示。言語ごとの表（人称代名詞・動詞の変化など）を、data/forms.json から出す。
// replace が true の分類は、表だけで置き換える。false の分類は、表の下に単語のタイルを並べる
const cellH=(c,tb)=>{const o=typeof c=='string'?{t:c}:c,rs=o.rs?` rowspan=${o.rs}`:'',nw=(o.h&&o.t.length<=5&&!/[<>]/.test(o.t))||(!o.h&&!/\s/.test(o.t)&&o.t!='—');
 const cls=[o.h?'lab':'',o.c||'',nw?'nw':''].filter(Boolean).join(' ');
 const txt=o.t+(o.p?`<small>${o.p}</small>`:''),sp=o.s||o.t,can=!o.h&&tb.sp&&o.t!='—'&&(o.s||!/[<>]/.test(o.t));
 return can?`<td${rs} class="${cls} sp" onclick="speak('${sp.replace(/'/g,"\\'")}')">${txt}</td>`:`<td${rs}${cls?` class="${cls}"`:''}>${txt}</td>`};
// 単語の表（ジャンル列あり）: 大項目（g:1）の中に小項目（g:2）を入れる2階層。古い rs 形式の表も読める
function GTG(tb){const bigs=[];let big=null,sub=null;
 const newBig=n=>{big={n,subs:[]};bigs.push(big);sub=null},newSub=n=>{if(!big)newBig('');sub={n,rows:[]};big.subs.push(sub)};
 tb.rows.forEach(r=>{const m=r[0];
  if(r.length==1&&m&&typeof m=='object'&&m.n){if(sub)sub.note=m.t;return}
  if(r.length==1&&m&&typeof m=='object'&&m.g){m.g==1?newBig(m.t):newSub(m.t);return}
  if(m&&typeof m=='object'&&m.rs){newSub(m.t);sub.rows.push(r.slice(1));return}
  if(!sub)newSub('');sub.rows.push(r)});
 const head=`<thead><tr>${tb.head.slice(1).map(h=>`<th>${h}</th>`).join('')}</tr></thead>`;
 const tbl=rows=>`<div class=gtw><table class=gt>${head}<tbody>${rows.map(r=>`<tr>${r.map(c=>cellH(c,tb)).join('')}</tr>`).join('')}</tbody></table></div>`;
 const subH=x=>`<details class="sub"><summary class=subh><span>${x.n||'一覧'}</span><small>${x.rows.length}語</small></summary>${x.note?`<small class=gtn>${x.note}</small>`:''}${tbl(x.rows)}</details>`;
 const body=bigs.map(b=>{if(!b.n)return b.subs.map(subH).join('');const n=b.subs.reduce((a,x)=>a+x.rows.length,0);
  return `<details class="sub bigg"><summary class="subh bigg"><span>${b.n}</span><small>${n}語</small></summary><div class=bigbody>${b.subs.map(subH).join('')}</div></details>`}).join('');
 return `<div class=gtw>${tb.title?`<h3 class=gtt>${tb.title}</h3>`:''}${body}</div>`}

const nb=t=>String(t); // 説明文は強制改行をせず、文字の流れで折り返す（不自然な改行をなくすため）
function GT(tb){if(tb.head&&tb.head[0]=='ジャンル')return GTG(tb);const wide=(tb.head||tb.rows[0]||[]).length>=5;const inner=`${tb.note?`<small class=gtn>${tb.note}</small>`:''}${wide?'<small class=gthint>横にスワイプできます →</small>':''}<table class=gt>${tb.head?`<thead><tr>${tb.head.map(h=>`<th>${h}</th>`).join('')}</tr></thead>`:''}<tbody>${tb.rows.map(r=>`<tr>${r.map(c=>cellH(c,tb)).join('')}</tr>`).join('')}</tbody></table>`;
 // 数字の表（「1〜10」「20〜90」など）は、たたんでおけるようにする（初期状態は閉じている）
 if(/〜/.test(tb.title||''))return `<details class="sub numsec"><summary class=subh><span>${tb.title}</span><small>${tb.rows.length}語</small></summary><div class=gtw>${inner}</div></details>`;
 return `<div class=gtw>${tb.title?`<h3 class=gtt>${tb.title}</h3>`:''}${inner}</div>`}
function bwAll(o){document.querySelectorAll('details.bwd,details.sub').forEach(d=>d.open=o)}
function subAll(b,o){b.closest('details.bwd').querySelectorAll('details.sub').forEach(d=>d.open=o)} // 項目の中のジャンルをまとめて開閉
const tabsHTML=ts=>{const h=ts.map(GT).join('');return h.includes('<details class="sub"')?`<div class=bwall><button class=sm onclick="subAll(this,true)">ジャンルすべて開く</button><button class=sm onclick="subAll(this,false)">ジャンルすべて閉じる</button></div>`+h:h};
// 分類の語数: 表の分類は表の行数、チップの分類は語の数
const bwCount=(c,T)=>T.replace?(T.tables||[]).reduce((a,t)=>a+t.rows.filter(r=>r.length!=1).length,0):c.w.length; // 見出しだけの行（大項目・小項目）は数えない
function BWHTML(){const l=S.lang,rd=({2:8,3:9,6:10})[l],F=FORMS[l]||{};
 const chip=w=>`<button class=hc onclick="speak('${w[l].replace(/'/g,"\\'")}')">${rd?`<small>${w[rd]}</small>`:''}<b${w[l].length>9?' class=lg':''}>${w[l]}</b><i>${w[0]}</i></button>`;
 return `<h1 class=ctt><span class=ph>📝 ${LS[l]}の</span><span class=ph>単語/フレーズ</span></h1><small><span class=ph>項目をタップすると開きます。</span><span class=ph>単語をタップすると発音が聞けます。</span></small><small class=bwnote>※ この単語帳は、よく使う単語の一部だけを載せています。</small>`
 +`<div class=bwsearch><input id=bwq class="in bwq" type=search enterkeyhint=search placeholder="🔍 単語やフレーズをさがす" aria-label="単語やフレーズをさがす" oninput="bwFind(this.value)" onkeydown="if(event.key=='Enter')this.blur()"><small id=bwcnt class=bwcnt></small></div>`
 +`<nav class=bwix aria-label="索引（大項目へ移動）">${BW.map((c,i)=>`<button class="bwx x${i%6}" onclick="bwGo(${i})">${'①②③④⑤⑥⑦⑧⑨⑩⑪⑫'[i]||''} ${c.t}</button>`).join('')}</nav>`
 +`<div class=bwall><button class=sm onclick="bwAll(true)">すべて開く</button><button class=sm onclick="bwAll(false)">すべて閉じる</button></div>`
 +`<div id=bwlist>${BW.map((c,i)=>{const T=F[c.t]||{},tabs=tabsHTML(T.tables||[]);
  return `<details class="card hg bwd"><summary class=bwh><span>${'①②③④⑤⑥⑦⑧⑨⑩⑪⑫'[i]||''} ${c.t}</span><small>${bwCount(c,T)}語</small></summary>${tabs}${T.replace?'':`<div class="hrow g3 bw">${c.w.map(chip).join('')}</div>`}</details>`}).join('')}</div>`
 +`<div id=bwempty class="tip c bwempty" hidden><b>見つかりませんでした</b><small>ほかの言葉（英語・読み仮名など）で、さがしてみてね</small></div>`
 +'<button class="big nav" onclick="home()">もどる</button>'}
// 単語さがし: ひらがな・カタカナ・大文字小文字・スペースの違いを無視して、語・読み・訳をまとめて探す
const nrm=s=>String(s).toLowerCase().replace(/\s+/g,'').replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
function bwFind(q){const n=nrm(q),L=document.getElementById('bwlist');if(!L)return;
 L.querySelectorAll('.hc').forEach(x=>{x.hidden=!!n&&!nrm(x.textContent).includes(n)});
 L.querySelectorAll('tbody tr').forEach(r=>{r.hidden=!!n&&!nrm(r.textContent).includes(n)});
 [...L.querySelectorAll('details.sub')].reverse().forEach(s=>{const vis=[...s.querySelectorAll('tbody tr,.hc')].some(x=>!x.hidden);s.hidden=!!n&&!vis;if(n&&vis)s.open=true});
 L.querySelectorAll('details.bwd').forEach(d=>{const vis=[...d.querySelectorAll('tbody tr,.hc')].some(x=>!x.hidden);d.hidden=!!n&&!vis;if(n&&vis)d.open=true});
 const hit=[...L.querySelectorAll('tbody tr,.hc')].filter(x=>!x.hidden&&!x.closest('[hidden]')).length;
 const c=document.getElementById('bwcnt'),e=document.getElementById('bwempty');
 if(c)c.textContent=n?`${hit}件 見つかりました`:'';
 if(e)e.hidden=!(n&&hit===0)}
function bwGo(i){const q=document.getElementById('bwq');if(q&&q.value){q.value='';bwFind('')}
 const d=document.querySelectorAll('#bwlist details.bwd')[i];if(!d)return;d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'})}
// この端末の記録（アカウント登録はなし。名前はこの端末のブラウザに保存）
function acct(){
 app.innerHTML=`<button class="sm nav" onclick="optOpen()">⚙</button><h1>👤 この端末の記録</h1>
 <div class=card><small>アカウント登録はありません。記録は、このブラウザ（この端末）だけに残ります。</small>
 <h3>なまえ（12文字まで）</h3>
 <input id=nm class=in maxlength=12 value="${esc(uname()=='ゲスト'?'':uname())}" placeholder="ゲスト"><button class="big m" onclick="rename(nm.value);acct()">なまえを変更</button></div>
 ${STORE_OK?'':'<div class="tip c warn"><span class=ph>⚠ この端末・ブラウザでは記録が残りません</span><span class=ph>ページを閉じると、きろくは消えます</span></div>'}
 <button class=sm onclick="if(confirm('この端末の記録をすべて消します。よろしいですか？')){resetRec();acct()}">記録をリセット</button>
 <button class="big nav" onclick="home()">もどる</button>`}
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
  const pad=n=>'<i class=tpad></i>'.repeat((3-n%3)%3); // 3列で、最後の行がそろうように空き枠を足す
  body=`${topH}<h3>🏅 称号コレクション ${got} / ${TOTAL}</h3><small>集めた称号をタップすると、もう一度見られます</small><div class=tg style="margin-top:8px">${cards.join('')}${pad(cards.length)}</div>
  <h3>🏳️ リタイア称号　<small>（10問以内でおわると、もらえるよ）</small></h3><div class=tg>${cardsI.join('')}${pad(cardsI.length)}</div>`}
 app.innerHTML=`<button class="sm nav" onclick="optOpen()">⚙</button><h1>${tab=='rec'?'📊 きろく':'🏅 称号'}</h1><small>👤 ${esc(uname())}（この端末のみ）</small>${tabs}${body}<button class="big nav" onclick="home()">もどる</button>`}
const closeM=()=>{modal.innerHTML=''};
function tpop(i){const o=TL[i],c=D.titles[o.n]||0;
 modal.innerHTML=`<div class=mask onclick="closeM()"><div class="card pop" onclick="event.stopPropagation()"><div class=chr>${o.e}</div><small>称号</small><h2>${o.n}</h2><div>${tCond(o)}</div><small>獲得 ${c} 回</small><button class=big onclick="closeM()">とじる</button></div></div>`;SND.ok()}
