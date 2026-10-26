// チュートリアル: ホーム画面の設定を、順にハイライトしながら説明する。
// ・初回だけ「見ますか？」と聞く（ls の tutAsked で記録。以降は聞かない）
// ・見るのは「📖 つかいかた」（ホーム上部）と ⚙ →「チュートリアルを見る」からいつでも
// ・右上の「自動 ON/OFF」で、一定時間ごとに次の説明へ自動で進む（既定は OFF）
// ・画面の操作はそのまま使える（説明カードは下に出るだけ）
const TUT_STEPS=[
 {t:'ようこそ！',x:'ことばパーティは、7つの言葉をクイズで楽しく学ぶアプリです。ホーム画面の設定を、順に説明するね。'},
 {sel:'#f-lang',t:'🌍 学ぶ言語',x:'学びたい言語を選ぶよ。「文字表を見る」ボタンを押すと、文字の読み方や基本の単語が見られるよ。'},
 {sel:'.rg[aria-labelledby=f-stg]',t:'🏅 レベル',x:'ビギナーは初めての人向けの内容。慣れたらノーマルで、本格的な内容に進もう。'},
 {sel:'#f-lvl',t:'📚 内容',x:'①自己紹介から⑦総復習まで、学ぶ場面を選ぶよ。「準備中」の内容は、まだ問題がないよ。'},
 {sel:'#f-kind',t:'✏ 出題',x:'単語のみ、文章のみ、まちがい復習、ミックスから選べるよ。'},
 {sel:'.rg[aria-labelledby=f-ans]',t:'🎓 形式',x:'翻訳（聞いた言葉を訳す）、聞き取り（聞いた言葉をそのまま返す）、質疑応答（質問に答える）から選ぶよ。'},
 {sel:'#f-fmt',t:'✍ 回答',x:'4択か入力かを選ぶよ。入力のときは、外国語の専用キーボードが出るよ。'},
 {sel:'#f-mode',t:'🔢 問題数',x:'「ひたすら」か、10・20・30問から選べるよ。'},
 {sel:'[onclick="start()"]',t:'🎈 スタート！',x:'準備ができたら、ここを押そう。正解すると🎉、まちがえた問題は、あとで多めに出るよ。'},
 {sel:'[onclick="optOpen()"]',t:'⚙ オプション',x:'制限時間・音量・BGM・読み上げは、⚙で変えられるよ。BGMを流していても、問題の音声（🔊・読み上げ）は聞けるよ。'}
];
const TUT_AUTO_MS=6000;
let tutList=[],tutI=0,tutNoAuto=false,tutMode='',tutTimer=null;
const lsGet=(k,d)=>{try{return ls.get(k,d)}catch(e){return d}};
const lsSet=(k,v)=>{try{ls.set(k,v)}catch(e){}};
const tutAutoOn=()=>lsGet('tutAuto',0)==1;
const tutBox=()=>{let b=document.getElementById('tut');if(!b){b=document.createElement('div');b.id='tut';b.className='tut';b.hidden=true;document.body.appendChild(b)}return b};
const tutActive=()=>{const b=document.getElementById('tut');return!!b&&!b.hidden};
function tutHL(){document.querySelectorAll('.tut-hl').forEach(e=>e.classList.remove('tut-hl'))}
// 暗い幕（強調していない所をグレーアウト）。クリックは通す（幕の下の操作もそのまま使える）
function tutDim(on){let d=document.getElementById('tutdim');if(!on){if(d)d.remove();return}if(!d){d=document.createElement('div');d.id='tutdim';d.className='tutdim';document.body.appendChild(d)}}
function tutStopTimer(){clearTimeout(tutTimer);tutTimer=null}
function tutSchedule(){tutStopTimer();if(tutMode=='steps'&&tutAutoOn()&&tutI<tutList.length-1)tutTimer=setTimeout(tutNext,TUT_AUTO_MS)}

// 初回だけの質問（はい＝見る／いいえ＝見ない。どちらでも二度と聞かない）
function tutAsk(){
 if(lsGet('tutAsked',0)==1||tutActive())return false;
 tutMode='ask';const box=tutBox();box.hidden=false;
 box.innerHTML=`<div class="tut-card tut-ask" role=dialog aria-labelledby=tut-q><div class=tut-head><span class=tut-tag>📖 はじめまして</span></div><h2 id=tut-q>チュートリアルを見ますか？</h2><p>ホームの設定を、順に説明するよ。あとから「📖 つかいかた」でいつでも見られるよ。</p><div class=tut-b><button class=sm onclick="tutAnswer(0)">あとで</button><button class="sm tut-next" onclick="tutAnswer(1)">はい、見る</button></div></div>`;
 return true;
}
function tutAnswer(yes){lsSet('tutAsked',1);tutMode='';tutEnd(false);if(yes)tutStart()}

function tutRender(){
 const s=tutList[tutI];if(!s)return tutEnd();
 tutMode='steps';tutHL();
 const el=s.sel&&document.querySelector(s.sel);
 tutDim(!!el);
 if(el){el.classList.add('tut-hl');try{el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}
 const box=tutBox(),last=tutI==tutList.length-1,auto=tutAutoOn();
 box.hidden=false;
 box.innerHTML=`<div class=tut-card role=dialog aria-labelledby=tut-t><div class=tut-head><small class=tut-n>${tutI+1} / ${tutList.length}</small><button class="tut-auto${auto?' on':''}" onclick="tutToggleAuto()" aria-pressed=${auto}>自動 ${auto?'ON':'OFF'}</button></div><h2 id=tut-t>${s.t}</h2><p>${s.x}</p><div class=tut-b><button class=sm onclick="tutPrev()" ${tutI==0?'disabled':''}>◀ 戻る</button><button class=sm onclick="tutEnd()">とじる</button><button class="sm tut-next" onclick="${last?'tutEnd()':'tutNext()'}">${last?'できた！':'次へ ▶'}</button></div></div>`;
 tutSchedule();
}
function tutToggleAuto(){lsSet('tutAuto',tutAutoOn()?0:1);tutRender()}
function tutStart(){
 tutNoAuto=true;
 if(!document.getElementById('f-lang')){modal.innerHTML='';home()}
 modal.innerHTML='';
 tutList=TUT_STEPS.filter(s=>!s.sel||document.querySelector(s.sel));
 tutI=0;tutNoAuto=false;
 tutRender();
}
function tutNext(){tutI++;tutRender()}
function tutPrev(){if(tutI>0){tutI--;tutRender()}}
function tutEnd(markSeen=true){
 tutStopTimer();tutHL();tutDim(false);tutMode='';
 const b=document.getElementById('tut');if(b){b.hidden=true;b.innerHTML=''}
 if(markSeen)lsSet('tutAsked',1);
}
// ホームを描き直したあとに呼ぶ：説明中ならハイライトし直す／初回なら質問を出す（お知らせが先）
function tutHome(){
 if(noticePending()){if(!modal.innerHTML)noticeShow();return}
 if(tutMode=='steps'&&tutActive()){tutRender();return}
 if(tutMode=='ask'&&tutActive())return;
 if(!tutNoAuto&&document.getElementById('f-lang'))tutAsk();
}
// ホーム以外の画面（問題・きろく・文字表など）に移ったら、説明は閉じる（質問は次回のホームで再表示しない）
try{new MutationObserver(()=>{if(tutActive()&&!document.getElementById('f-lang'))tutEnd()}).observe(document.getElementById('app'),{childList:true,subtree:true})}catch(e){}
