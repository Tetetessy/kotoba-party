// data/*.json の読み込み
const L=['','英語（English）','中国語（中文）','韓国語（한국어）','スペイン語（Español）','イタリア語（Italiano）','タイ語（ภาษาไทย）','ベトナム語（Tiếng Việt）'],F=['','🇺🇸','🇨🇳','🇰🇷','🇪🇸','🇮🇹','🇹🇭','🇻🇳'],V=['','en-US','zh-CN','ko-KR','es-ES','it-IT','th-TH','vi-VN'],ORD=[1,4,5,2,3,6,7]; // 表示順: 英・西・伊・中・韓・タイ
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
 // イタリア語(5)・タイ語(6): data/extra.json {"it":{日本語:訳},"th":{...}} を日本語キーで結合（訳がある問題だけ出題）
 const ex=await j('extra.json').catch(()=>({}));P.forEach(x=>{if(ex.it&&ex.it[x.a[0]])x.a[5]=ex.it[x.a[0]];if(ex.th&&ex.th[x.a[0]])x.a[6]=ex.th[x.a[0]];if(ex.vi&&ex.vi[x.a[0]])x.a[7]=ex.vi[x.a[0]]});
 // 文字・発音の基礎: data/basics.json {"3":[[ハングル,読み]],"2":[[漢字,ピンイン]]}
 RN=await j('releases.json').catch(()=>[]);
 const ps=await j('pos.json').catch(()=>({}));Object.entries(ps).forEach(([k,v])=>v.forEach(w=>POS[w]=k)); // ヒント用の品詞
 const bs=await j('basics.json').catch(()=>({}));Object.entries(bs).forEach(([g,r])=>r.forEach(([c,rd])=>{const a=[rd];a[g]=c;P.push({k:'b'+g+c,t:'b',l:0,lg:+g,a})}));
}
