app.innerHTML='<h1>🎈 読み込み中…</h1>';
load().then(home).catch(()=>app.innerHTML='<h1>😢</h1><div class=card>データを読み込めませんでした。<br><small>VS Codeの「Live Server」かGitHub Pages経由で開いてください。</small></div>');
document.getElementById('ft').insertAdjacentHTML('afterbegin','ことばパーティ '+CFG.ver+'<br>');
