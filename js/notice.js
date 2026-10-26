// お知らせ（ソシャゲのように、大きな変更のときだけ1回出す）。
// data/releases.json の項目のうち big:true の、いちばん新しいものが対象。見たものは ls の noticeSeen に記録する。
// 大きな変更がない版では、お知らせは出さない。
const noticeTarget=()=>{const r=(RN||[]).find(x=>x.big);return r&&lsGet('noticeSeen','')!=r.v?r:null};
const noticePending=()=>!!noticeTarget();
function noticeShow(){
 const r=noticeTarget();if(!r)return false;
 modal.innerHTML=`<div class=mask><div class="card notice" role=dialog aria-labelledby=nt-t>
  <div class=notice-head><span class=notice-tag>🎉 おしらせ</span><small>${r.date||''}</small></div>
  <h2 id=nt-t>大きなアップデート！<br><span class=vtag>${r.v}</span></h2>
  <ul class=notice-list>${r.items.slice(0,3).map(i=>`<li>${i}</li>`).join('')}</ul>
  ${r.items.length>3?`<small>ほかの変更は「📝 リリースノート」で見られます</small>`:''}
  <button class="big" onclick="noticeClose(1)">いいね！はじめる</button>
  <button class="big alt" onclick="noticeClose(0);notes()">📝 くわしく見る</button>
 </div></div>`;
 return true;
}
function noticeClose(then){ // then=1 のとき、ホームの続き（つかいかたの質問など）へ進む
 const r=noticeTarget();
 if(r)lsSet('noticeSeen',r.v);
 modal.innerHTML='';
 if(then&&document.getElementById('f-lang'))tutHome();
}
