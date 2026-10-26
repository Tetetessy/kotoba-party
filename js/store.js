// 保存（この端末・このブラウザの localStorage だけ。サーバーなし、アカウント登録なし）
// 保存できない環境（プライベートブラウズの一部・記録の拒否設定など）では、STORE_OK が false になり、画面で警告する
const STORE_OK=(()=>{try{const k='kp.test';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch(e){return false}})();
const ls={get(k,d){try{return JSON.parse(localStorage.getItem('kp.'+k))||d}catch(e){return d}},set(k,v){try{localStorage.setItem('kp.'+k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem('kp.'+k)}catch(e){}}};
// 文字を画面に出すときの安全な変換（HTMLとして解釈させない）
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const blank=()=>({items:{},tot:{},hist:[],titles:{}});
let S={lang:1,lvl:1,stage:'b',grp:0,kind:'mix',fmt:'mix',ans:'tr',dir:'mix',kb:1,mode:0,time:0,auto:0,snd:1,vol:10,se:10,bgm:5,voi:10,boost:1,...ls.get('set',{})};
if(ls.get('set',{}).vol===undefined&&S.snd===0)S.vol=0;
// 以前の版の保存値を移行: レベルは「ノーマル」の内容に入れ、旧「すべて」(0)は⑦総復習にする。出題は新しい4種類だけ残す
if(ls.get('set',{}).stage===undefined&&ls.get('set',{}).lvl!==undefined){S.stage='n';if(!S.lvl)S.lvl=7}
if(!['mix','w','s','r'].includes(S.kind))S.kind='mix';
if(!ls.get('vol2',0)){ls.set('vol2',1);if(S.vol>0)S.vol=10} // 音量を引き上げた版: 初回だけ最大に（⚙でいつでも下げられる）
// 旧版のアカウント（メールアドレス＋パスワード）は廃止。残っている記録は「この端末の記録」に1回だけ引き継ぎ、
// メールアドレスとパスワードの情報は端末から消す（何度実行しても同じ結果になる）
(()=>{try{const acc=ls.get('acc',null),cur=ls.get('cur',null);
 if(acc&&typeof acc=='object'){
  if(cur&&acc[cur]){if(!ls.get('d.guest',null))ls.set('d.guest',ls.get('d.'+cur,{}));if(!ls.get('name',null))ls.set('name',acc[cur].name||'')}
  Object.keys(acc).forEach(e=>ls.del('d.'+e));ls.del('acc')}
 ls.del('cur')}catch(e){}})();
let D;
const loadD=()=>{D={...blank(),...ls.get('d.guest',{})}};loadD();
const save=()=>{ls.set('set',S);ls.set('d.guest',D)};
const uname=()=>String(ls.get('name','')||'ゲスト');
const rename=n=>{n=String(n).trim().slice(0,12);ls.set('name',n)};
const resetRec=()=>{D=blank();save()};
