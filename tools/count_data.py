#!/usr/bin/env python3
"""収録数の確認（目標300問に対する現在数）。使い方: python tools/count_data.py"""
import json,os
D=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'data')
J=lambda f:json.load(open(f'{D}/{f}.json',encoding='utf-8'))
try:tb=J('sentences_tatoeba')
except Exception:tb=[]
w,s,t,m,ex=J('words'),J('sentences'),J('templates'),J('meta')['levels'],J('extra')
gen=sum(len(g['tpl'])*len(g['noun']) for g in t);T=300
cw,cs={},{}
for r in w:cw[int(r[0])]=cw.get(int(r[0]),0)+1
for r in s+tb:cs[int(r[0])]=cs.get(int(r[0]),0)+1
for g in t:cs[g['level']]=cs.get(g['level'],0)+len(g['tpl'])*len(g['noun'])  # テンプレートからの自動生成も文章に数える
print('【レベル別】単語・文章それぞれ目標',T)
for i,n in enumerate(m,1):print(f' {n:<12} 単語 {cw.get(i,0):>4} / {T}（不足 {max(0,T-cw.get(i,0))}）  文章 {cs.get(i,0):>4} / {T}（不足 {max(0,T-cs.get(i,0))}）')
print('【出題別】 単語',len(w),'/ 文章',len(s)+len(tb)+gen,f'（手書き{len(s)}・Tatoeba{len(tb)}・自動生成{gen}）')
tot=len(w)+len(s)+len(tb)+gen
print('【言語別の翻訳数】主要4言語',tot,'/',{k:len(v) for k,v in ex.items()})
