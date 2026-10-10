// data/*.json の読み込み
// 言語番号: 1英 2中 3韓 4西 5伊 6タイ 7ベトナム（問題データの配列の添字と同じ。0は日本語）
const LS=['','英語','中国語','韓国語','スペイン語','イタリア語','タイ語','ベトナム語'],NT=['','English','中文','한국어','Español','Italiano','ภาษาไทย','Tiếng Việt'];
const L=LS.map((x,i)=>i?x+'（'+NT[i]+'）':''),F=['','🇺🇸','🇨🇳','🇰🇷','🇪🇸','🇮🇹','🇹🇭','🇻🇳'],V=['','en-US','zh-CN','ko-KR','es-ES','it-IT','th-TH','vi-VN'],ORD=[1,4,5,2,3,6,7]; // 表示順: 英・西・伊・中・韓・タイ・ベトナム
let LV=['すべて'],TB=0,GID={},POS={},RN=[];const P=[];
async function load(){
 const j=f=>fetch('data/'+f).then(r=>{if(!r.ok)throw 0;return r.json()});
 const [w,s,t,m]=await Promise.all(['words','sentences','templates','meta'].map(n=>j(n+'.json')));
 LV=['すべて',...m.levels];
 const tb=await j('sentences_tatoeba.json').catch(()=>[]);TB=tb.length>0; // 任意: Tatoeba由来の例文
 (await j('synonyms.json').catch(()=>[])).forEach((g,i)=>g.forEach(x=>GID[norm(x)]=i)); // 同義語グループ
 tb.forEach(a=>P.push({k:'s'+a[1],t:'s',l:+a[0],a:a.slice(1)}));
 w.forEach(a=>P.push({k:'w'+a[1],t:'w',l:+a[0],a:a.slice(1)}));
 s.forEach(a=>P.push({k:'s'+a[1],t:'s',l:+a[0],a:a.slice(1)}));
 t.forEach((g,gi)=>g.tpl.forEach((tp,ti)=>g.noun.forEach(n=>P.push({k:'g'+(gi||'')+ti+n[0],t:'s',l:g.level,a:tp.map((x,i)=>x.replace('{}',n[i]))}))));
 // イタリア語(5)・タイ語(6)・ベトナム語(7): data/extra.json {"it":{日本語:訳},"th":{...},"vi":{...}} を日本語キーで結合（訳がある問題だけ出題）
 const ex=await j('extra.json').catch(()=>({}));P.forEach(x=>{if(ex.it&&ex.it[x.a[0]])x.a[5]=ex.it[x.a[0]];if(ex.th&&ex.th[x.a[0]])x.a[6]=ex.th[x.a[0]];if(ex.vi&&ex.vi[x.a[0]])x.a[7]=ex.vi[x.a[0]]});
 // 質疑応答: data/qa.json  [レベル, 日本語の質問, en, zh, ko, es, it, th, vi, [正解(日本語)…], [まちがい選択肢…]]
 (await j('qa.json').catch(()=>[])).forEach(r=>P.push({k:'q'+r[1],t:'q',l:+r[0],a:r.slice(1,9),ok:r[9],x:r[10]}));
 RN=await j('releases.json').catch(()=>[]);
 const ps=await j('pos.json').catch(()=>({}));Object.entries(ps).forEach(([k,v])=>v.forEach(w=>POS[w]=k)); // ヒント用の品詞
 // 文字・発音の基礎: data/basics.json {"3":[[ハングル,読み]],"2":[[漢字,ピンイン]]}
 const bs=await j('basics.json').catch(()=>({}));Object.entries(bs).forEach(([g,r])=>r.forEach(([c,rd])=>{const a=[rd];a[g]=c;P.push({k:'b'+g+c,t:'b',l:0,lg:+g,a})}));
}
