# ことばパーティ 反映手順（VS Code + Git + GitHub Pages）

## 1. フォルダ構成（最終形）
```
kotoba-party/                 ← VS Codeで開くフォルダ（= Gitリポジトリ）
├─ index.html
├─ .gitignore
├─ SETUP.md
├─ css/
│   └─ style.css
├─ js/
│   ├─ sound.js     効果音・読み上げ
│   ├─ store.js     保存・ログイン・記録
│   ├─ data.js      データ読み込み
│   ├─ quiz.js      出題・判定・ヒント・称号
│   ├─ config.js    管理者設定（メールアドレス）
│   ├─ ui.js        画面（ホーム・オプション・アカウント・きろく）
│   └─ main.js      起動
├─ data/
│   ├─ words.json  sentences.json  templates.json  extra.json
│   ├─ basics.json  pos.json  synonyms.json  meta.json
└─ tools/
    ├─ check_data.py  coverage.py  count_data.py  build_tatoeba.py
    └─ tatoeba/README.txt
```

## 2. ファイルを入れ替える
1. `kotoba-party.zip` をダウンロードして、**中身をすべて** 自分のリポジトリフォルダに上書きコピーします。
   - zipを展開したときに `index.html` が直下に見える状態で、リポジトリの `index.html` と同じ場所に重ねます。
   - 「同名ファイルを置き換える」を選びます。
2. VS Codeで `kotoba-party` フォルダを開きます（ファイル → フォルダーを開く）。
3. 左の一覧に上の構成どおりのファイルがあることを確認します。

## 3. 動作確認（push前にローカルで）
1. `index.html` を右クリック → 「Open with Live Server」
2. アドレスが `127.0.0.1:5500` で、ホームが表示されればOKです。
3. 確認すること
   - 言語が 英語・スペイン語・イタリア語・中国語・韓国語・タイ語・ベトナム語 の順で並ぶ
   - スタート → 4択・入力・ヒント(💡)・⚙ が動く
   - 中国語/韓国語で「文字・発音」「文字表」が出る
   - 出題に「まちがい復習」が出る（まちがえるまでは0問）
4. うまく表示されないとき: `F12` → 「コンソール」の赤いエラーを控えてください。

## 4. Gitで公開する（VS Codeのターミナル）
ターミナル → 新しいターミナル を開き、順番に実行します。
```
git status
git add .
git commit -m "レベル1-2を100問に拡充 / 7言語対応 / ヒント・復習モード追加"
git push
```
- `git status` に変更ファイルが並べばOKです。
- push後、1〜2分で公開サイトが更新されます。
- 公開URL: `https://tetetessy.github.io/kotoba-party/`
- 表示が古いときは **Ctrl + F5**（スマホはタブを閉じて開き直す）。

## 5. そのほかの操作
- **意見を非公開で受け取る（Googleフォーム・無料・カード不要）**: メールアドレスは公開されません。
  1. Googleフォームで新規フォームを作り、質問を1つ（段落）「ご意見・感想」にします。
  2. 右上︙ →「事前入力したURLを取得」→ 質問に `test` と入力 →「リンクを取得」。
  3. 取得したURL `https://docs.google.com/forms/d/e/【ID】/viewform?usp=pp_url&entry.【数字】=test` から
     `form` = `https://docs.google.com/forms/d/e/【ID】/formResponse` ／ `entry` = `entry.【数字】` を作り、`js/config.js` に入れます。
  4. フォームの「回答」タブ → ︙ →「新しい回答についてのメール通知を受け取る」をオン。
  5. 手順4（git push）で反映。⚙ の一番下に「📨 送信する（非公開）」が出ます。
- **GitHubで意見を受け取る**: リポジトリの Settings → General → Features で Issues にチェックが入っているか確認します。
- **データの書式チェック**（Pythonが入っている場合）
  ```
  python tools/check_data.py
  python tools/coverage.py 1
  python tools/count_data.py
  ```
- **Tatoeba例文を大量に追加**: `tools/tatoeba/README.txt` と `tools/build_tatoeba.py` の説明を参照（任意）。
- **記録について**: 記録・アカウントは、そのブラウザの中だけに保存されます。Live Server(127.0.0.1)と公開URLでは別々です。

## 6. うまくいかないとき
| 症状 | 対処 |
|---|---|
| 「データを読み込めませんでした」 | ダブルクリックで開いていないか確認。Live Serverか公開URLで開く。`data/` が `index.html` と同じ階層か確認 |
| 古い画面のまま | Ctrl + F5 で強制再読み込み |
| `git push` が拒否される | 先に `git pull` を実行してから、もう一度 `git push` |
| `git` が見つからない | Git for Windows をインストールし、VS Codeを再起動 |
