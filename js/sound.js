// 効果音: WebAudioで鳴らすだけ（音声ファイル不要）
const SND={c:null,tone(f,t,d,type='sine'){try{this.c=this.c||new(window.AudioContext||window.webkitAudioContext)();const o=this.c.createOscillator(),g=this.c.createGain(),n=this.c.currentTime+t;
 o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.3*S.vol/10,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(this.c.destination);o.start(n);o.stop(n+d)}catch(e){}},
 ok(){if(S.vol>0){this.tone(660,0,.12);this.tone(880,.1,.2)}},ng(){if(S.vol>0){this.tone(220,0,.18,'square');this.tone(160,.15,.25,'square')}}};
function fx(ok){const e=document.createElement('div');e.className='fxm';e.textContent=ok?'⭕':'❌';document.body.appendChild(e);setTimeout(()=>e.remove(),850);ok?SND.ok():SND.ng()}
function speak(t,l){if(S.vol<=0)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=l||V[S.lang];u.volume=S.vol/10;speechSynthesis.speak(u)}catch(e){}}
