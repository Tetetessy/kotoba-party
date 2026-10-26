// 🛠 環境・開発の情報（⚙ → 「🛠 環境・開発の情報」）。今の状態・公開の流れ・よくあるトラブルを、表でさっと確認できる
// 使い方の説明はここにまとめる。コードは出さない。値は config.js の CFG.dev と、この画面を開いたときの状態から作る
const envKV=(k,v)=>`<tr><th>${k}</th><td>${v}</td></tr>`;
function envInfo(){
 const ua=navigator.userAgent||'';
 const br=/Edg\//.test(ua)?'Edge':/OPR\//.test(ua)?'Opera':/Chrome\//.test(ua)?'Chrome':/Firefox\//.test(ua)?'Firefox':/Safari\//.test(ua)?'Safari':'その他';
 const os=/iPhone|iPad|iPod/.test(ua)?'iPhone / iPad':/Android/.test(ua)?'Android':/Windows/.test(ua)?'Windows':/Macintosh/.test(ua)?'Mac':/Linux/.test(ua)?'Linux':'その他';
 const h=location.hostname;
 const place=location.protocol=='file:'?'⚠ ファイルを直接開いています（データが読めないことがあります）':/github\.io$/.test(h)?'公開サイト（GitHub Pages）':(h=='localhost'||h=='127.0.0.1')?'ローカル確認（Live Serverなど）':'その他（'+h+'）';
 let store='使える';try{localStorage.setItem('kp_envtest','1');localStorage.removeItem('kp_envtest')}catch(e){store='⚠ 使えない（記録が残りません）'}
 const cnt=t=>P.filter(x=>x.t==t&&x.a[S.lang]).length;
 const qa=P.filter(x=>x.t=='q'&&x.a[S.lang]).length;
 return {
  lang:(LS[S.lang]||'')+'（'+(F[S.lang]||'')+'）', ver:CFG.ver, place, br, os,
  inapp:(typeof INAPP!='undefined'&&INAPP)?'⚠ はい（音が出ないことがあります）':'いいえ',
  voice:typeof voiceInfo=='function'?voiceInfo():'-', store,
  width:window.innerWidth+' px', words:cnt('w'), sents:cnt('s'), qa, ua:ua.slice(0,120)
 };
}
function envText(){const i=envInfo();return ['ことばパーティ 環境メモ',
 '学ぶ言語: '+i.lang,'アプリの版: '+i.ver,'場所: '+i.place,'ブラウザ: '+i.br+' / '+i.os,'アプリ内ブラウザ: '+i.inapp,
 '読み上げ: '+i.voice,'記録の保存: '+i.store,'画面幅: '+i.width,'収録数（この言語）: 単語 '+i.words+' ・ 文章 '+i.sents+' ・ 質疑応答 '+i.qa,
 '公開先: '+CFG.dev.pages,'リポジトリ: '+CFG.dev.repo+'（'+CFG.dev.branch+'）'].join('\n')}
function envCopy(){const t=envText();
 const done=()=>toast('📋 コピーしました（そのまま貼れます）');
 try{navigator.clipboard.writeText(t).then(done,()=>{prompt('コピーしてください',t)})}catch(e){prompt('コピーしてください',t)}}
function envOpen(){
 const i=envInfo(),d=CFG.dev;
 modal.innerHTML=`<div class=mask><div class=card><h2 style="margin:0">🛠 環境・開発の情報</h2>
 <small>困ったときは、まずここを見てください。</small>
 <h3>📍 今の状態</h3>
 <table class=rn>${envKV('学ぶ言語',i.lang)}${envKV('アプリの版',i.ver)}${envKV('開いている場所',i.place)}${envKV('ブラウザ',i.br+' / '+i.os)}${envKV('アプリ内ブラウザ',i.inapp)}${envKV('読み上げ',i.voice)}${envKV('記録の保存',i.store)}${envKV('画面の幅',i.width)}${envKV('収録数（全レベル）',`単語 ${i.words}・文章 ${i.sents}・質疑応答 ${i.qa}`)}</table>
 <h3>🌐 公開とGitの流れ</h3>
 <table class=rn>${envKV('リポジトリ名',d.repo)}${envKV('公開URL',`<a href="${d.pages}" target=_blank rel=noopener>${d.pages}</a>`)}${envKV('ブランチ',d.branch)}${envKV('編集',d.editor)}${envKV('確認',d.local)}${envKV('公開範囲','URLを知っている人なら開けます（検索結果には出さない設定）。ログイン・パスワードはありません')}${envKV('記録の保存先','この端末・このブラウザだけ（サーバーには送らない）')}${envKV('外部へ送る通信','なし（意見箱のGoogleフォームは、ボタンを押したときだけ開きます）')}${envKV('公開先の種類','HTML・CSS・JavaScript・JSONだけの静的サイト（PHPやデータベースは使わない）')}</table>
 <table class=rn>
 <tr><th>1</th><td>zipを展開して、リポジトリのフォルダに<b>上書き</b>します</td></tr>
 <tr><th>2</th><td>Live Serverで開いて、ホームと問題が出るか確認します</td></tr>
 <tr><th>3</th><td>VS Codeの「ソース管理」で変更を確認し、<b>メッセージを書いてコミット</b>します</td></tr>
 <tr><th>4</th><td><b>送信（プッシュ）</b>すると、1〜2分で公開サイトが更新されます</td></tr>
 <tr><th>5</th><td>表示が古いときは <b>Ctrl + F5</b>（スマホはタブを閉じて開き直す）</td></tr>
 <tr><th>6</th><td>版の印（タグ）は、公開を確認したあとに付けます（任意）</td></tr>
 </table>
 <h3>🧭 困ったときの確認</h3>
 <table class=rn>
 <tr><th>症状</th><td><b>確認・対処</b></td></tr>
 ${envKV('データを読み込めない','ダブルクリックで開いていないか確認。Live Serverか公開URLで開く。dataフォルダが index.html と同じ階層にあるか確認')}
 ${envKV('古い画面のまま','Ctrl + F5 で強制再読み込み。スマホはタブを閉じて開き直す')}
 ${envKV('PHP・サーバーのエラーが出る','このアプリはPHPを使わない静的サイトです。画面の赤いエラーは、F12の「コンソール」で内容を確認')}
 ${envKV('音が出ない','LINEなどのアプリ内ブラウザでは出ないことがあります。SafariかChromeで開く')}
 ${envKV('記録が消えた','記録はこの端末・このブラウザの中だけに保存されます。ブラウザのデータを消すと消えます')}
 ${envKV('git push が拒否される','先に「プル（pull）」をしてから、もう一度プッシュ')}
 ${envKV('git が見つからない','Git for Windows を入れて、VS Codeを開き直す')}
 ${envKV('表示が崩れる','画面幅とブラウザ（Chrome・Safariの最新版）を確認。上の「画面の幅」も一緒に控える')}
 </table>
 <button class="big alt" onclick="envCopy()">📋 この情報をコピー（報告用）</button>
 <button class=big onclick="optShow()">もどる</button></div></div>`}
