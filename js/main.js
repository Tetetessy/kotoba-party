// タイトル画面は「ブラウザ（タブ）を開き直したとき」だけ出す。別アプリに切り替えて戻っただけ・再読み込みのときは、ホームから続ける（sessionStorageは、タブを閉じると消える）
const RUN={get(){try{return sessionStorage.getItem('kp_run')=='1'}catch(e){return false}},set(v){try{v?sessionStorage.setItem('kp_run','1'):sessionStorage.removeItem('kp_run')}catch(e){}}};
function startUp(){if(RUN.get()){if(!qrestore()&&!rrestore())home()}else showTitle()}
function showTitle(){RUN.set(0);qclear();rclear();stopVoice();try{document.getElementById('rfx')&&document.getElementById('rfx').remove()}catch(e){}
 const L=['Hello','¡Hola!','Ciao','你好','안녕','สวัสดี','Xin chào'],C=['#ff6f61','#ffd23f','#2ec4a6','#7c5cff','#ff8fb8','#4aa8ff','#ffa94d'];
 const fx='<div class=tfx>'+[8,24,42,60,76,90].map((x,i)=>'<i class=tb style="left:'+x+'%;animation-delay:'+(i*1.3)+'s;animation-duration:'+(9+i%3*2)+'s;filter:hue-rotate('+i*55+'deg)">🎈</i>').join('')+Array.from({length:14},(_,i)=>'<b class=tc style="left:'+(4+i*7)+'%;background:'+C[i%7]+';animation-delay:'+(i*.45)+'s;animation-duration:'+(5+i%4)+'s"></b>').join('')+'</div>';
 app.innerHTML=fx+'<div class=ttl><div class=tbub>'+L.map((t,i)=>'<span style="background:'+C[i]+';animation-delay:'+(i*.15)+'s,'+(.9+i*.25)+'s">'+t+'</span>').join('')+'</div><div class=tlogo>🎈<h1>ことばパーティ</h1><div class=tsub>7つの言葉で、たのしく学ぼう！</div></div><button class="big tgo">▶ はじめる</button><div class=ttap>画面をタッチしても始まるよ</div></div>';
 const go=()=>{RUN.set(1);home()};
 app.querySelector('.tgo').onclick=e=>{e.stopPropagation();go()};
 app.querySelector('.ttl').onclick=go;
}
app.innerHTML='<h1>🎈 読み込み中…</h1>';
load().then(startUp).catch(()=>app.innerHTML='<h1>😢</h1><div class=card>データを読み込めませんでした。<br><small>VS Codeの「Live Server」かGitHub Pages経由で開いてください。</small></div>');
document.getElementById('ft').insertAdjacentHTML('afterbegin','ことばパーティ '+CFG.ver+'<br>');

// 問題中は「考える時間」の曲、タイトルは弾むタイトル曲、ホーム・きろく・文字表などは明るい曲、結果は正解率で5種類
try{BGM.start()}catch(e){} // 起動時にすぐ再生を試す（ブラウザが止めた場合は、最初のタップで始まる）
setTimeout(()=>{try{if(!BGM.ok()&&!document.querySelector('.ttl'))toast('🎵 画面をタップすると音楽が流れるよ')}catch(e){}},900);
try{new MutationObserver(()=>{const r=document.getElementById('rcard');BGM.mode(document.getElementById('qc')?'quiz':r?'r'+r.dataset.tier:document.querySelector('.ttl')?'title':'menu')}).observe(document.getElementById('app'),{childList:true,subtree:true})}catch(e){}
