// 結果画面のエフェクト（5種類）。正解率しだいで切りかわる。canvasに描き、結果画面を出ている間だけ動く
// 1=花火（全問正解）／2=紙ふぶき（7〜8割）／3=きらきら（半分くらい）／4=小雨のくもり空（正解率が悪い）／5=どんより雨とかみなり（全問不正解・速攻リタイア）
const TIERS=['','全問正解','よくできました','まずまず','もう少し','ざんねん'];
function tierOf(p,n){return !n||p<=0?5:p>=100?1:p>=70?2:p>=40?3:p>=1?4:5}
function resultFx(tier){
 let cv=document.getElementById('rfx');if(cv)cv.remove();
 if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 cv=document.createElement('canvas');cv.id='rfx';cv.className='rfx t'+tier;document.body.appendChild(cv);
 const g=cv.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1);let W=0,H=0;
 const fit=()=>{W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0)};fit();addEventListener('resize',fit);
 const R=(a,b)=>a+Math.random()*(b-a),COL=['#ff6f61','#ffd23f','#2ec4a6','#7c5cff','#ff8fb8','#4aa8ff','#ffa94d'],pick=a=>a[Math.random()*a.length|0];
 let ps=[],t0=performance.now(),last=t0,fl=0,nextB=0,flash=0,nextL=R(2500,5000);
 const burst=()=>{const x=R(W*.15,W*.85),y=R(H*.12,H*.5),c=pick(COL),n=46;for(let i=0;i<n;i++){const a=i/n*Math.PI*2,v=R(1.2,3.6);ps.push({k:'f',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c,r:R(1.5,2.6)})}};
 const init=()=>{ps=[];
  if(tier==2)for(let i=0;i<90;i++)ps.push({k:'c',x:R(0,W),y:R(-H,0),vy:R(.8,2),w:R(0,6),ws:R(.02,.07),a:R(0,6),as:R(.04,.14),c:pick(COL),s:R(6,11)});
  if(tier==3)for(let i=0;i<34;i++)ps.push({k:'s',x:R(0,W),y:R(0,H),vy:-R(.15,.5),p:R(0,6),ps:R(.02,.05),s:R(5,12),c:pick(['#ffd23f','#fff3b0','#ffffff','#ffb3c7'])});
  if(tier>=4){const n=tier==4?60:130;for(let i=0;i<n;i++)ps.push({k:'r',x:R(-40,W),y:R(-H,H),vy:tier==4?R(5,8):R(9,14),len:tier==4?R(8,14):R(14,24),a:tier==4?.35:.5})}};
 init();
 const star=(x,y,s,al,c)=>{g.save();g.globalAlpha=al;g.fillStyle=c;g.translate(x,y);g.beginPath();for(let i=0;i<8;i++){const r=i%2?s*.28:s,a=i*Math.PI/4;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.restore()};
 const loop=now=>{if(!cv.isConnected||!document.getElementById('rcard')){cv.remove();removeEventListener('resize',fit);return}
  const dt=Math.min(40,now-last)/16.7;last=now;g.clearRect(0,0,W,H);
  if(tier==1){if(now>=nextB){burst();nextB=now+R(550,1000)}
   ps=ps.filter(p=>p.l>0);ps.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.05*dt;p.vx*=.985;p.l-=.011*dt;g.globalAlpha=Math.max(0,p.l);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()});g.globalAlpha=1}
  else if(tier==2){ps.forEach(p=>{p.y+=p.vy*dt;p.w+=p.ws*dt;p.a+=p.as*dt;p.x+=Math.sin(p.w)*.8*dt;if(p.y>H+12){p.y=-12;p.x=R(0,W)}g.save();g.translate(p.x,p.y);g.rotate(p.a);g.scale(1,Math.cos(p.a*1.3));g.fillStyle=p.c;g.globalAlpha=.9;g.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);g.restore()})}
  else if(tier==3){ps.forEach(p=>{p.y+=p.vy*dt;p.p+=p.ps*dt;if(p.y<-12){p.y=H+12;p.x=R(0,W)}star(p.x,p.y,p.s,.25+.75*Math.abs(Math.sin(p.p)),p.c)})}
  else{g.strokeStyle=tier==4?'#7f93ad':'#9fb0c7';g.lineWidth=tier==4?1:1.4;const sl=tier==4?.18:.32;
   ps.forEach(p=>{p.y+=p.vy*dt;p.x-=p.vy*sl*dt;if(p.y>H){p.y=-30;p.x=R(0,W+60)}g.globalAlpha=p.a;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+p.len*sl,p.y-p.len);g.stroke()});g.globalAlpha=1;
   if(tier==5){if(now-t0>nextL){flash=1;nextL=now-t0+R(4500,8000)}if(flash>0){g.fillStyle='rgba(255,255,255,'+flash*.28+')';g.fillRect(0,0,W,H);flash-=.045*dt}}}
  requestAnimationFrame(loop)};
 requestAnimationFrame(loop)}
