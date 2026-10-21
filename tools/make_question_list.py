#!/usr/bin/env python3
"""開発者用「問題一覧」を作る。
  python tools/make_question_list.py
→ admin/問題一覧_開発者用.html ができる（データを埋め込んだ1ファイル。ダブルクリックで開ける）
・admin/ は .gitignore に入っているので、GitHub（公開サイト）には上がらない。自分のパソコンだけで見る。
・データ（data/*.json）を直したら、もう一度このコマンドを実行して作り直す。"""
import json, os, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = lambda n: json.load(open(os.path.join(R, 'data', n), encoding='utf-8')) if os.path.exists(os.path.join(R, 'data', n)) else None
words, sents, tpls, meta, ex = D('words.json'), D('sentences.json'), D('templates.json'), D('meta.json'), D('extra.json') or {}
qa, basics, bw = D('qa.json') or [], D('basics.json') or {}, D('basic_words.json') or []
tb = D('sentences_tatoeba.json') or []
def ext(ja): return [ex.get('it', {}).get(ja, ''), ex.get('th', {}).get(ja, ''), ex.get('vi', {}).get(ja, '')]
def rows(src, arr, off=0):
    out = []
    for i, a in enumerate(arr):
        a = list(a); lv = a[0]; t = a[1:6]
        while len(t) < 5: t.append('')
        out.append({'src': src, 'n': i + 1, 'lv': int(lv), 'a': t + ext(t[0])})
    return out
W = rows('words.json', words)
S = rows('sentences.json', sents) + rows('sentences_tatoeba.json', tb)
n = 0
for gi, g in enumerate(tpls):
    for ti, tp in enumerate(g['tpl']):
        for ni, no in enumerate(g['noun']):
            a = [x.replace('{}', no[i]) for i, x in enumerate(tp)]
            n += 1
            S.append({'src': '自動生成（templates.json 第%d組・文型%d・語%d）' % (gi + 1, ti + 1, ni + 1), 'n': n, 'lv': int(g['level']), 'a': a[:5] + [ext(a[0])[0] or (a[5] if len(a) > 5 else ''), ext(a[0])[1] or (a[6] if len(a) > 6 else ''), ext(a[0])[2] or (a[7] if len(a) > 7 else '')], 'auto': 1})
Q = [{'src': 'qa.json', 'n': i + 1, 'lv': int(r[0]), 'a': r[1:9], 'ok': r[9], 'ng': r[10]} for i, r in enumerate(qa)]
B = [{'src': 'basics.json', 'lang': int(k), 'c': r[0], 'r': r[1], 'g': r[2] if len(r) > 2 else 1} for k, v in basics.items() for r in v]
data = {'levels': (meta or {}).get('levels', []), 'words': W, 'sents': S, 'qa': Q, 'basics': B, 'bw': bw}
tpl = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'question_list_template.html'), encoding='utf-8').read()
import datetime
html = tpl.replace('/*DATA*/null', json.dumps(data, ensure_ascii=False, separators=(',', ':'))).replace('/*BUILT*/', datetime.datetime.now().strftime('%Y-%m-%d %H:%M'))
os.makedirs(os.path.join(R, 'admin'), exist_ok=True)
out = os.path.join(R, 'admin', '問題一覧_開発者用.html')
open(out, 'w', encoding='utf-8').write(html)
print('作成しました:', out, '| 単語', len(W), '文章', len(S), '質疑応答', len(Q), '文字', len(B), '基本単語', sum(len(c['w']) for c in bw))
