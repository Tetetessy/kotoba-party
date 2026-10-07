#!/usr/bin/env python3
"""レベル別・言語別の収録数と、答えの重複チェック。使い方: python tools/coverage.py [レベル番号=1]"""
import json,os,sys,collections
D=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'data')
J=lambda f:json.load(open(f'{D}/{f}.json',encoding='utf-8'))
lv=int(sys.argv[1]) if len(sys.argv)>1 else 1
N=['ja','en','zh','ko','es','it','th','vi'];ex=J('extra')
try:tb=J('sentences_tatoeba')
except Exception:tb=[]
def full(r):
    return [r[1:6]+[ex[k].get(r[1]) for k in('it','th','vi')]]
items={'単語':[],'文章':[]}
for r in J('words'):items['単語']+=full(r)+[]if False else []
rows={'単語':[(int(r[0]),r[1:6]+[ex[k].get(r[1]) for k in('it','th','vi')]) for r in J('words')],
      '文章':[(int(r[0]),r[1:6]+[ex[k].get(r[1]) for k in('it','th','vi')]) for r in J('sentences')+tb]}
for gi,g in enumerate(J('templates')):
    for t in g['tpl']:
        for n in g['noun']:
            row=[x.replace('{}',n[i]) for i,x in enumerate(t)];row+=[None]*(8-len(row))
            rows['文章'].append((g['level'],row))
for kind,lst in rows.items():
    cur=[r for l,r in lst if l==lv]
    print(f'【レベル{lv} {kind}】{len(cur)}問 / 言語別の翻訳数:',{N[i]:sum(1 for r in cur if r[i]) for i in range(1,8)})
    for i in range(1,8):  # 全レベル通しで、同じ言語の同じ答えが複数の問題にあると逆向き出題で紛らわしい
        c=collections.defaultdict(list)
        for l,r in lst:
            if r[i]:c[r[i].strip().lower()].append(r[0])
        for k,v in c.items():
            if len(v)>1:print('  重複',N[i],repr(k),v)
