#!/usr/bin/env python3
"""Tatoeba の対訳ファイルから data/sentences_tatoeba.json を作る。
使い方: python tools/build_tatoeba.py [レベルごとの最大件数(既定500)]
事前準備: https://tatoeba.org/ja/downloads の「言語Aの文と言語Bの翻訳」で
  日本語→英語/中国語(官話)/韓国語/スペイン語 の4ファイルを tools/tatoeba/ に
  jpn-eng.tsv jpn-cmn.tsv jpn-kor.tsv jpn-spa.tsv の名前で置く(.bz2のままでも可)。
列は「文ID, 日本語, 翻訳ID, 翻訳文」のタブ区切りを想定。"""
import sys,os,json,bz2,random
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=os.path.join(R,'tools','tatoeba');D=os.path.join(R,'data')
LANGS=['eng','cmn','kor','spa'];CAP=int(sys.argv[1]) if len(sys.argv)>1 else 500
LEVELS=['⑦ 短い例文','⑧ ふつうの例文','⑨ 長めの例文']
def opn(l):
    b=os.path.join(SRC,'jpn-'+l)
    for q in(b+'.tsv',b+'.tsv.bz2',b+'.bz2'):
        if os.path.exists(q):return bz2.open(q,'rt',encoding='utf-8') if q.endswith('bz2') else open(q,encoding='utf-8')
    sys.exit('見つかりません: tools/tatoeba/jpn-%s.tsv'%l)
def pair(l):
    d={}
    with opn(l) as f:
        for ln in f:
            c=ln.rstrip('\n').split('\t')
            if len(c)>=4 and 0<len(c[3])<=150:d.setdefault(c[1].strip(),c[3].strip())
    return d
P=[pair(l) for l in LANGS]
old={r[1] for r in json.load(open(os.path.join(D,'sentences.json'),encoding='utf-8'))}
ok=[j for j in P[0] if all(j in p for p in P) and 3<=len(j)<=45 and j not in old]
by={7:[],8:[],9:[]}
for j in ok:by[7 if len(j)<=10 else 8 if len(j)<=18 else 9].append([str(7 if len(j)<=10 else 8 if len(j)<=18 else 9),j]+[p[j] for p in P])
random.seed(1);out=[]
for k in by:random.shuffle(by[k]);out+=by[k][:CAP]
open(os.path.join(D,'sentences_tatoeba.json'),'w',encoding='utf-8').write('[\n'+',\n'.join(json.dumps(r,ensure_ascii=False) for r in out)+'\n]')
mp=os.path.join(D,'meta.json');m=json.load(open(mp,encoding='utf-8'))
for x in LEVELS:
    if x not in m['levels']:m['levels'].append(x)
json.dump(m,open(mp,'w',encoding='utf-8'),ensure_ascii=False)
print('4言語そろった文:',len(ok),'→ 採用',len(out),{k:min(len(v),CAP) for k,v in by.items()})
