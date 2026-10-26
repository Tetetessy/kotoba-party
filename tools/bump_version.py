#!/usr/bin/env python3
"""アプリのバージョンを上げる（VS Code のターミナルから実行します）

使い方（リポジトリのフォルダで実行）:
  python tools/bump_version.py v1.09 --date 2026-11-01 --item "さがす欄と索引を追加" --item "人物の項目を見直し"
  python tools/bump_version.py v1.09 --big --item "..."    ← 大きな変更のときだけ --big を付ける（起動時に「お知らせ」が出ます）
  python tools/bump_version.py v1.09 --dry-run              ← 書き換えず、結果だけ表示（最初に試すのがおすすめ）

やること:
  1. js/config.js の CFG.ver を新しい版にする
  2. data/releases.json の先頭に、新しい版のお知らせを追加する
  3. 最後に tools/check_data.py を実行して、データに問題がないか確認する

注意:
  - 同じ版がすでに releases.json にある場合は何もしません（二重に追加しないため）。
  - --item は何回でも指定できます。お知らせの本文は、利用者向けの言葉で書いてください。
    「電話番号の確認」など、お知らせに書かない方がよい内容は書かないでください。
  - 書き換え後は、VS Code の「ソース管理」で差分を確認してからコミットしてください。
"""
import argparse, datetime, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, 'js', 'config.js')
RELEASES = os.path.join(ROOT, 'data', 'releases.json')


def main():
    ap = argparse.ArgumentParser(description='アプリのバージョンを上げる')
    ap.add_argument('version', help='新しい版（例: v1.09）')
    ap.add_argument('--date', default=datetime.date.today().isoformat(), help='お知らせの日付（YYYY-MM-DD）。省略時は今日')
    ap.add_argument('--item', action='append', default=[], help='お知らせの1行（何回でも指定可）')
    ap.add_argument('--big', action='store_true', help='大きな変更のとき付ける（起動時のお知らせ表示の対象になる）')
    ap.add_argument('--dry-run', action='store_true', help='書き換えずに結果だけ表示する')
    a = ap.parse_args()

    if not re.fullmatch(r'v\d+\.\d+', a.version):
        sys.exit('版の書式は v1.09 のように「v」＋数字.数字 で指定してください')
    if not a.item:
        sys.exit('--item を1つ以上指定してください（お知らせの内容）')

    # 1. config.js の版番号
    cfg = open(CONFIG, encoding='utf-8').read()
    m = re.search(r"ver:'(v\d+\.\d+)'", cfg)
    if not m:
        sys.exit('js/config.js に ver:\'vX.Y\' が見つかりません')
    old = m.group(1)

    # 2. releases.json の先頭に追加
    data = json.load(open(RELEASES, encoding='utf-8'))
    items = data if isinstance(data, list) else data['releases']
    if any(e.get('v') == a.version for e in items):
        sys.exit(f'{a.version} はお知らせにすでにあります。何もしません')

    entry = {'v': a.version, 'date': a.date, 'big': a.big, 'items': a.item}
    print(f'版: {old} → {a.version}')
    print(f'お知らせ: {json.dumps(entry, ensure_ascii=False)}')

    if a.dry_run:
        print('（dry-run のため、ファイルは書き換えていません）')
        return

    cfg = cfg.replace(f"ver:'{old}'", f"ver:'{a.version}'", 1)
    open(CONFIG, 'w', encoding='utf-8').write(cfg)

    items.insert(0, entry)
    with open(RELEASES, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    # 3. データの点検（tools/check_data.py）
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'check_data.py')])
    print('完了。VS Code の「ソース管理」で差分を確認してください。')


if __name__ == '__main__':
    main()
