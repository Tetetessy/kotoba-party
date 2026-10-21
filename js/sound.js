// 効果音: WebAudioで鳴らすだけ（音声ファイル不要）
let DK=1,UID=0; // DK: 読み上げ中の音量の倍率（BGMとSEを一時的に下げる）。UID: 最後に読み上げた番号
const SND={c:null,tone(f,t,d,type='sine'){try{this.c=this.c||new(window.AudioContext||window.webkitAudioContext)();const o=this.c.createOscillator(),g=this.c.createGain(),n=this.c.currentTime+t;
 audioMode();this.c.state=='suspended'&&this.c.resume();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(Math.min(.9,.15+S.vol*.07)*(S.se/10)*DK,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(this.c.destination);o.start(n);o.stop(n+d)}catch(e){}},
 ok(){if(S.vol>0&&S.se>0){this.tone(660,0,.12);this.tone(880,.1,.2)}},ng(){if(S.vol>0&&S.se>0){this.tone(220,0,.18,'square');this.tone(160,.15,.25,'square')}}};
function fx(ok){const e=document.createElement('div');e.className='fxm';e.textContent=ok?'⭕':'❌';document.body.appendChild(e);setTimeout(()=>e.remove(),850);ok?SND.ok():SND.ng()}
// ---- 読み上げ（🔊）----
// ・押した瞬間に同じ処理の中で speak する（iPhoneは、タップ直後でないと音声が出ないため）
// ・初回タップで、無音の読み上げを1回だけ流して「音声のロック」を外す
// ・音声（voice）は、その言語のものを端末内蔵から優先して選ぶ
// ・出なかったときは、理由を画面に出す（音声データなし／ミュート など）
const SS=(()=>{try{return window.speechSynthesis||null}catch(e){return null}})();
const UA=navigator.userAgent||'',IOS=/iPhone|iPad|iPod/.test(UA)||(/Macintosh/.test(UA)&&navigator.maxTouchPoints>1),APPLE=IOS||/^((?!chrome|android).)*safari/i.test(UA);
// 音楽や動画を流したままでも聞こえるよう、「短い音」として鳴らす（対応している端末のみ。マナーモードの影響も受けにくい）
const INAPP=/Line\/|FBAN|FBAV|FB_IAB|Instagram|MicroMessenger|Twitter|KAKAOTALK|; wv\)/i.test(UA);
function extURL(){try{return location.origin+location.pathname+'?openExternalBrowser=1'}catch(e){return ''}}
function copyExt(){const u=extURL(),ok=()=>note('URLをコピーしたよ！LINEなどに貼って送ってね');try{navigator.clipboard.writeText(u).then(ok,()=>prompt('このURLをコピーしてね',u))}catch(e){prompt('このURLをコピーしてね',u)}}
function shareApp(){const d={title:'ことばパーティ',text:'無料の外国語学習アプリ「ことばパーティ」で遊ぼう🎈',url:extURL()}; // 端末の共有メニュー（LINE・X・Instagramなど）を開く。非対応ならURLをコピー
 try{if(navigator.share){navigator.share(d).catch(e=>{if(!e||e.name!='AbortError')copyExt()});return}}catch(e){}
 copyExt()}
function audioMode(){try{if(navigator.audioSession&&navigator.audioSession.type!=='transient')navigator.audioSession.type='transient'}catch(e){}}
let VS=[];const loadV=()=>{try{VS=(SS&&SS.getVoices())||[]}catch(e){}};
const vl=v=>(v.lang||'').toLowerCase().replace('_','-');
try{loadV();SS&&SS.addEventListener&&SS.addEventListener('voiceschanged',loadV)}catch(e){}
const pickV=l=>{const k=l.toLowerCase().replace('_','-'),p=k.slice(0,2),c=VS.filter(v=>vl(v).slice(0,2)==p);return c.find(v=>vl(v)==k&&v.localService)||c.find(v=>vl(v)==k)||c.find(v=>v.localService)||c[0]};
(function(){const ev=['pointerdown','touchend','click','keydown'];
 const un=()=>{ev.forEach(e=>document.removeEventListener(e,un,true));try{if(!SS)return;audioMode();const u=new SpeechSynthesisUtterance(' ');u.volume=0;SS.speak(u)}catch(e){}};
 ev.forEach(e=>document.addEventListener(e,un,true))})();
const note=m=>{try{typeof toast=='function'&&toast(m)}catch(e){}};
function speak(t,l,slow){
 if(S.vol<=0||S.voi<=0){note('音量が0（ミュート）だよ。⚙で上げてね');return}
 if(!SS){note('この端末・ブラウザは、読み上げに対応していないみたい');return}
 try{
  audioMode();loadV();
  const lg=l||V[S.lang],name=lg==V[S.lang]?LS[S.lang]:lg,u=new SpeechSynthesisUtterance(t);
  u.lang=lg;const v=pickV(lg);if(v)u.voice=v;
  else if(VS.length)note(name+'の音声が、この端末に入っていないかも。端末の「読み上げ（音声）」設定で追加してね');
  u.volume=Math.min(1,(.5+S.vol*.05)*(S.voi/10));u.rate=slow?.55:.9;window._u=u;
  const id=++UID,rest=()=>{if(id==UID){DK=1;try{BGM.vol()}catch(e){}}};DK=.25;try{BGM.vol()}catch(e){} // 読み上げ中は、BGMとSEを下げる
  u.onend=rest;
  let started=0;u.onstart=()=>{started=1};
  u.onerror=e=>{rest();const r=e&&e.error;if(r=='canceled'||r=='interrupted')return;
   note(r=='not-allowed'?'ブラウザに音声をブロックされたよ。もう一度タップしてみてね':r=='language-unavailable'||r=='voice-unavailable'?name+'の音声が、この端末にないみたい':'読み上げに失敗したよ（端末の音声設定を確認してね）')};
  const go=()=>{try{SS.resume();SS.speak(u)}catch(e){}};
  if(SS.speaking||SS.pending){SS.cancel();APPLE?go():setTimeout(go,60)}else go();
  setTimeout(()=>{if(!started&&!SS.speaking){rest();note(INAPP?'LINEなどのアプリ内ブラウザでは音が出ないよ。右上のメニューから「ブラウザで開く」(SafariやChrome)を選んでね':'音が始まらなかったよ。マナーモードやメディア音量、端末の読み上げ設定を確認してね')}},3500);
 }catch(e){}}
function stopVoice(){try{SS&&SS.cancel();DK=1;BGM.vol()}catch(e){}} // 読み上げを止めて、音量を元に戻す（タイトルに戻るとき）
// 端末で使える音声の一覧（⚙の「読み上げテスト」で表示）
function voiceInfo(){if(INAPP)return '⚠ アプリ内ブラウザです。音を出すにはSafari/Chromeで開いてね';if(!SS)return '読み上げに非対応のブラウザです';loadV();
 if(!VS.length)return '音声の一覧を取得できませんでした（読み上げは試せます）';
 return '使える音声: '+ORD.map(l=>LS[l]+(VS.some(v=>vl(v).slice(0,2)==V[l].slice(0,2).toLowerCase())?'○':'×')).join('　')}

// ---- BGM: WebAudioで作ったループ曲（音声ファイルなし。どちらもカジュアルポップ）----
// menu: タイトル・ホーム・きろく・文字表など。明るくはずむ8小節（C→G→Am→F→C→G→F→G）
// quiz: 問題・解答中。時計の「チク・タク」と、くり返しのアルペジオだけの、少し考える時間をにおわせる単調な4小節（Am→F→C→G）
// 最初のタッチで始まり、画面が問題中かどうかで曲が切りかわる。音量は ⚙ の「BGM」と「全体の音量」で決まる
const BGM=(()=>{
 const mt=m=>440*Math.pow(2,(m-69)/12);
 const CH=[[48,[60,64,67]],[43,[59,62,67]],[45,[57,60,64]],[41,[57,60,65]],[48,[60,64,67]],[43,[59,62,67]],[41,[57,60,65]],[43,[59,62,67]]];
 const ML=[[76,0,79,76,0,74,72,0],[74,0,79,74,0,71,74,0],[76,0,81,76,0,72,76,0],[72,0,77,72,69,0,72,0],[79,0,76,79,0,81,79,0],[79,0,74,79,0,83,79,0],[81,0,77,81,0,84,81,0],[79,0,74,0,71,0,74,79]];
 const QC=[[45,[57,60,64]],[41,[57,60,65]],[48,[60,64,67]],[43,[59,62,67]]],AR=[0,1,2,1,0,1,2,1];
 // 結果画面の曲（正解率しだいで5種類）: r1=全問正解（晴れやか）〜r5=正解率が低い（暗い）
 const T3=(a,b,d)=>[a,b,d],CM=[48,[60,64,67]],GM=[43,[59,62,67]],AM=[45,[57,60,64]],FM=[41,[57,60,65]];
 const R={
  r1:{bpm:132,ch:[CM,GM,AM,FM,CM,GM,FM,CM],mel:[[72,76,79,84,79,76,79,84],[71,74,79,83,79,74,79,83],[69,72,76,81,76,72,76,81],[69,72,77,81,77,72,77,81],[72,76,79,84,79,76,79,84],[71,74,79,83,79,74,79,83],[69,72,77,81,77,72,77,81],[72,76,79,84,0,84,0,0]],kick:[0,3,4],clap:[2,6],hat:[0,1,2,3,4,5,6,7],bass:[0,2,4,6],stab:[1,3,5,7],lv:.3},
  r2:{bpm:120,ch:[CM,GM,AM,FM],mel:[[76,0,79,76,81,0,79,0],[74,0,79,83,0,79,74,0],[76,0,81,76,0,84,81,0],[77,0,81,77,72,0,77,0]],kick:[0,4],clap:[2,6],hat:[1,3,5,7],bass:[0,3,4,6],stab:[1,3,5,7]},
  r3:{bpm:100,ch:[FM,CM,GM,AM],mel:[[0,0,81,0,0,79,77,0],[0,0,79,0,0,76,72,0],[0,0,74,0,0,79,83,0],[0,0,81,0,0,76,72,0]],kick:[0],hat:[4],bass:[0,4],pad:.05,lv:.24},
  r4:{bpm:84,ch:[AM,[38,[57,62,65]],FM,[40,[56,59,64]]],mel:[[0,0,0,0,76,0,0,72],[0,0,0,0,74,0,0,69],[0,0,0,0,72,0,0,77],[0,0,0,0,71,0,0,68]],bass:[0],pad:.06,lv:.2,md:3},
  r5:{bpm:60,ch:[[45,[57,60,64]],[41,[53,57,60]],[38,[50,54,57]],[40,[52,56,59]]],mel:[[69,0,67,0,65,0,64,0],[65,0,64,0,62,0,60,0],[62,0,60,0,59,0,57,0],[64,0,62,0,59,0,56,0]],tom:[0,4],bass:[0,4],bd:3.5,pad:.08,po:-12,lv:.26,md:3.2,gd:1},
  // タイトル画面の曲: 弾むようなカジュアルポップ（ホーム・問題とは別の曲）
  title:{bpm:124,ch:[[48,[60,64,67]],[41,[57,60,65]],[43,[59,62,67]],[48,[60,64,67]]],mel:[[76,0,79,81,0,79,76,0],[77,0,81,84,0,81,77,0],[79,0,83,81,0,79,74,0],[76,0,79,0,84,0,79,0]],kick:[0,4],clap:[2,6],hat:[1,3,5,7],bass:[0,3,4,6],stab:[1,5],lv:.3,md:1.1}};
 const M={menu:{bpm:108,n:64},quiz:{bpm:92,n:32}};Object.keys(R).forEach(k=>M[k]={bpm:R[k].bpm,n:R[k].ch.length*8});

 let c=null,mg=null,nz=null,on=0,tm=null,nx=0,st=0,md='menu';
 const step=()=>60/M[md].bpm/2;
 const ctx=()=>{c=c||SND.c||new(window.AudioContext||window.webkitAudioContext)();SND.c=c;return c};
 const level=()=>Math.pow(S.vol/10,.8)*Math.pow(S.bgm/10,.8)*.6*DK;
 const setLv=()=>{if(mg&&c)try{mg.gain.setTargetAtTime(level(),c.currentTime,.05)}catch(e){}};
 const env=(f,t,d,type,v,dest)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g).connect(dest);o.start(t);o.stop(t+d+.02)};
 const noise=(t,d,type,fq,v)=>{const s=c.createBufferSource();s.buffer=nz;const f=c.createBiquadFilter(),g=c.createGain();f.type=type;f.frequency.value=fq;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(f).connect(g).connect(mg);s.start(t,Math.random()*.5);s.stop(t+d+.02)};
 const kick=(t,v=.9,f0=150)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g).connect(mg);o.start(t);o.stop(t+.2)};
 const playMenu=(i,t)=>{const S8=step(),bar=i>>3,b=i&7,[root,tri]=CH[bar];
  if(b==0||b==4)kick(t);
  if(b==2||b==6)noise(t,.09,'bandpass',1800,.5);
  noise(t,.03,'highpass',7000,b&1?.12:.2);
  if(b==0)env(mt(root),t,S8*2.6,'triangle',.55,mg);
  if(b==3)env(mt(root),t,S8*1.4,'triangle',.45,mg);
  if(b==4)env(mt(root+7),t,S8*1.6,'triangle',.4,mg);
  if(b==6)env(mt(root),t,S8*1.4,'triangle',.4,mg);
  if(b&1)tri.forEach(m=>env(mt(m),t,S8*.8,'square',.06,mg));
  const m=ML[bar][b];if(m){env(mt(m),t,S8*1.7,'triangle',.28,mg);env(mt(m+12),t,S8*.9,'sine',.07,mg)}};
 const playQuiz=(i,t)=>{const S8=step(),bar=i>>3,b=i&7,[root,tri]=QC[bar];
  if(b%2==0){env(b%4?1250:1650,t,.045,'sine',.32,mg);noise(t,.02,'bandpass',3500,.18)} // チク・タク
  if(b==0)env(mt(root),t,S8*3.6,'sine',.5,mg);
  if(b==4)env(mt(root+7),t,S8*3.2,'sine',.38,mg);
  env(mt(tri[AR[b]]),t,S8*1.2,'triangle',.2,mg);env(mt(tri[AR[b]]+12),t,S8*.7,'sine',.05,mg);
  if(b&1)noise(t,.03,'highpass',8000,.07)};
 const playR=(g,i,t)=>{const S8=60/g.bpm/2,bar=i>>3,b=i&7,[root,tri]=g.ch[bar],h=a=>a&&a.includes(b);
  if(h(g.kick))kick(t,.8);if(h(g.tom))kick(t,.55,90);if(h(g.clap))noise(t,.09,'bandpass',1800,.5);if(h(g.hat))noise(t,.03,'highpass',7000,.14);
  if(h(g.bass))env(mt(root),t,S8*(g.bd||1.5),'triangle',.5,mg);
  if(h(g.stab))tri.forEach(m=>env(mt(m),t,S8*.8,'square',.05,mg));
  if(b==0&&g.pad)tri.forEach(m=>env(mt(m+(g.po||0)),t,S8*8,'sine',g.pad,mg));
  const m=g.mel[bar][b];if(m&&g.gd){gl(m+(g.mo||0),t,S8*(g.md||1.7),g.lv||.28)}else if(m){env(mt(m+(g.mo||0)),t,S8*(g.md||1.7),g.lw||'triangle',g.lv||.28,mg);env(mt(m+(g.mo||0)+12),t,S8*.9,'sine',.06,mg)}};
 // がっかりした溜め息のような、音が下がっていく音（結果画面の一番暗い曲用）
 const gl=(m,t,d,v)=>{const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(mt(m+4),t);o.frequency.exponentialRampToValueAtTime(mt(m-1),t+d*.7);f.type='lowpass';f.frequency.value=1100;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(f).connect(g).connect(mg);o.start(t);o.stop(t+d+.02)};
 const tick=()=>{if(!on||!c)return;while(nx<c.currentTime+.25){(md=='quiz'?playQuiz:md=='menu'?playMenu:(a,b)=>playR(R[md],a,b))(st,nx);nx+=step();st=(st+1)%M[md].n}};
 const mode=m=>{if(m==md||!M[m])return;md=m;st=0;if(!on)return;try{mg.gain.cancelScheduledValues(c.currentTime);mg.gain.setTargetAtTime(0,c.currentTime,.03);nx=c.currentTime+.25;setTimeout(setLv,220)}catch(e){}};
 const start=()=>{try{ctx();audioMode();if(c.state=='suspended')c.resume(); // 自動再生が止められていても、タップされたら再開する
   if(on)return;
   if(!mg){mg=c.createGain();mg.gain.value=0;mg.connect(c.destination);const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;nz=b}
   on=1;nx=c.currentTime+.1;st=0;setLv();tm=setInterval(tick,50)}catch(e){on=0}};
 const hide=()=>{try{if(!c)return;if(document.hidden){c.suspend&&c.suspend()}else if(on){c.resume&&c.resume()}}catch(e){}};
 document.addEventListener('visibilitychange',hide);
 (function(){const ev=['pointerdown','touchend','click','keydown'];const un=()=>{start();if(c&&c.state=='running')ev.forEach(e=>document.removeEventListener(e,un,true))};ev.forEach(e=>document.addEventListener(e,un,true))})();
 return{start,vol:setLv,mode,ok:()=>!!(c&&c.state=='running')}})();
