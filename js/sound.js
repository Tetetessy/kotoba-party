// 効果音: WebAudioで鳴らすだけ（音声ファイル不要）
const SND={c:null,tone(f,t,d,type='sine'){try{this.c=this.c||new(window.AudioContext||window.webkitAudioContext)();const o=this.c.createOscillator(),g=this.c.createGain(),n=this.c.currentTime+t;
 audioMode();this.c.state=='suspended'&&this.c.resume();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(Math.min(.9,.15+S.vol*.07),n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(this.c.destination);o.start(n);o.stop(n+d)}catch(e){}},
 ok(){if(S.vol>0){this.tone(660,0,.12);this.tone(880,.1,.2)}},ng(){if(S.vol>0){this.tone(220,0,.18,'square');this.tone(160,.15,.25,'square')}}};
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
 if(S.vol<=0){note('音量が0（ミュート）だよ。⚙で上げてね');return}
 if(!SS){note('この端末・ブラウザは、読み上げに対応していないみたい');return}
 try{
  audioMode();loadV();
  const lg=l||V[S.lang],name=lg==V[S.lang]?LS[S.lang]:lg,u=new SpeechSynthesisUtterance(t);
  u.lang=lg;const v=pickV(lg);if(v)u.voice=v;
  else if(VS.length)note(name+'の音声が、この端末に入っていないかも。端末の「読み上げ（音声）」設定で追加してね');
  u.volume=Math.min(1,.5+S.vol*.05);u.rate=slow?.55:.9;window._u=u;
  let started=0;u.onstart=()=>{started=1};
  u.onerror=e=>{const r=e&&e.error;if(r=='canceled'||r=='interrupted')return;
   note(r=='not-allowed'?'ブラウザに音声をブロックされたよ。もう一度タップしてみてね':r=='language-unavailable'||r=='voice-unavailable'?name+'の音声が、この端末にないみたい':'読み上げに失敗したよ（端末の音声設定を確認してね）')};
  const go=()=>{try{SS.resume();SS.speak(u)}catch(e){}};
  if(SS.speaking||SS.pending){SS.cancel();APPLE?go():setTimeout(go,60)}else go();
  setTimeout(()=>{if(!started&&!SS.speaking)note(INAPP?'LINEなどのアプリ内ブラウザでは音が出ないよ。右上のメニューから「ブラウザで開く」(SafariやChrome)を選んでね':'音が始まらなかったよ。マナーモードやメディア音量、端末の読み上げ設定を確認してね')},3500);
 }catch(e){}}
// 端末で使える音声の一覧（⚙の「読み上げテスト」で表示）
function voiceInfo(){if(INAPP)return '⚠ アプリ内ブラウザです。音を出すにはSafari/Chromeで開いてね';if(!SS)return '読み上げに非対応のブラウザです';loadV();
 if(!VS.length)return '音声の一覧を取得できませんでした（読み上げは試せます）';
 return '使える音声: '+ORD.map(l=>LS[l]+(VS.some(v=>vl(v).slice(0,2)==V[l].slice(0,2).toLowerCase())?'○':'×')).join('　')}
