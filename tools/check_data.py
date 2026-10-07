#!/usr/bin/env python3
"""手で追加した words.json / sentences.json の書式チェック。使い方: python tools/check_data.py"""
import json,os,sys
D=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'data')
lv=len(json.load(open(D+'/meta.json',encoding='utf-8'))['levels']);bad=0
for f in('words','sentences'):
    seen=set()
    for i,r in enumerate(json.load(open(f'{D}/{f}.json',encoding='utf-8')),2):
        e=[]
        if len(r)!=6:e.append('項目数が6ではない')
        elif not r[0].isdigit() or not 1<=int(r[0])<=lv:e.append('レベル番号が不正')
        elif not all(x.strip() for x in r):e.append('空の項目')
        elif r[1] in seen:e.append('日本語が重複')
        if e:bad+=1;print(f'{f}.json {i}行目:',e[0],r[:2])
        seen.add(r[1] if len(r)>1 else '')
print('問題なし ✅' if not bad else f'{bad}件の指摘')
