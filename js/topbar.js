// 上に固定する操作ボタン（class="nav" の付いたボタン）を #navbar に移す。画面が変わるたびに付け替える
// ⚙（オプション）は、いつも右端に置く（左右どちらの手でも押しやすい、いつもの位置）
(()=>{const app=document.getElementById('app'),nb=document.getElementById('navbar');
 if(!app||!nb)return;
 const opt={childList:true,subtree:true};
 const obs=new MutationObserver(pin);
 function pin(){obs.disconnect();
  const btns=[...app.querySelectorAll('.nav')];
  const gear=btns.find(b=>/optOpen\(\)/.test(b.getAttribute('onclick')||''));
  nb.replaceChildren(...btns.filter(b=>b!==gear),...(gear?[gear]:[]));
  obs.observe(app,opt)}
 obs.observe(app,opt);
 pin();
})();
