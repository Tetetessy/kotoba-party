// data/*.json の読み込み
const L=['','English','中文','한국어','Español'],F=['','🇺🇸','🇨🇳','🇰🇷','🇪🇸'],V=['','en-US','zh-CN','ko-KR','es-ES'];
let LV=['すべて'];const P=[];
async function load(){
 const j=f=>fetch('data/'+f).then(r=>{if(!r.ok)throw 0;return r.json()});
 const [w,s,t,m]=await Promise.all(['words','sentences','templates','meta'].map(n=>j(n+'.json')));
 LV=['すべて',...m.levels];
 w.forEach(a=>P.push({k:'w'+a[1],t:'w',l:+a[0],a:a.slice(1)}));
 s.forEach(a=>P.push({k:'s'+a[1],t:'s',l:+a[0],a:a.slice(1)}));
 t.forEach((g,gi)=>g.tpl.forEach((tp,ti)=>g.noun.forEach(n=>P.push({k:'g'+(gi||'')+ti+n[0],t:'s',l:g.level,a:tp.map((x,i)=>x.replace('{}',n[i]))}))));
}
