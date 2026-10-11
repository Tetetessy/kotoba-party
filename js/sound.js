// 効果音: WebAudioで鳴らすだけ（音声ファイル不要）
const SND={c:null,tone(f,t,d,type='sine'){try{this.c=this.c||new(window.AudioContext||window.webkitAudioContext)();const o=this.c.createOscillator(),g=this.c.createGain(),n=this.c.currentTime+t;
 this.c.state=='suspended'&&this.c.resume();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.3*S.vol/10,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(this.c.destination);o.start(n);o.stop(n+d)}catch(e){}},
 ok(){if(S.vol>0){this.tone(660,0,.12);this.tone(880,.1,.2)}},ng(){if(S.vol>0){this.tone(220,0,.18,'square');this.tone(160,.15,.25,'square')}}};
function fx(ok){const e=document.createElement('div');e.className='fxm';e.textContent=ok?'⭕':'❌';document.body.appendChild(e);setTimeout(()=>e.remove(),850);ok?SND.ok():SND.ng()}
// 読み上げ: 声(voice)を言語で明示的に選び、cancel直後のspeak取りこぼしを避ける。音量は⚙の設定(0〜10)をそのまま反映
try{navigator.audioSession&&(navigator.audioSession.type='ambient')}catch(e){} // 対応端末では、再生中の音楽と同時に鳴らす
let VS=[];const loadV=()=>{try{VS=speechSynthesis.getVoices()||[]}catch(e){}};
try{loadV();speechSynthesis.addEventListener('voiceschanged',loadV)}catch(e){}
const pickV=l=>{const k=l.toLowerCase().replace('_','-'),p=k.slice(0,2),f=v=>v.lang.toLowerCase().replace('_','-');return VS.find(v=>f(v)==k)||VS.find(v=>f(v).slice(0,2)==p)};
function speak(t,l){if(S.vol<=0)return;try{const ss=speechSynthesis,lg=l||V[S.lang];loadV();ss.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=lg;const v=pickV(lg);if(v)u.voice=v;u.volume=Math.min(1,S.vol/10);u.rate=.9;window._u=u;clearTimeout(speak.t);speak.t=setTimeout(()=>{try{ss.resume();ss.speak(u)}catch(e){}},80)}catch(e){}}
