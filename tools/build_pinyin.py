#!/usr/bin/env python3
"""中国語の専用キーボード用ピンイン辞書 data/pinyin.json を作る（Linux + ICU が必要。通常は実行不要）。
収録: 問題データに出てくる漢字 + 常用漢字（GB2312 第1水準 3755字）。ü は v で表す。
使い方: python tools/build_pinyin.py"""
import ctypes,json,os,re,collections,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));D=os.path.join(R,'data')
J=lambda f:json.load(open(f'{D}/{f}.json',encoding='utf-8'))
# --- 問題データ中の中国語の漢字と出現数 ---
zh=[r[3] for r in J('words')+J('sentences')]
for g in J('templates'):
    for t in g['tpl']:
        for n in g['noun']:zh.append(t[2].replace('{}',n[2]))
zh+=[c for c,_ in J('basics').get('2',[])]
freq=collections.Counter(c for s in zh for c in s if '一'<=c<='鿿')
# --- 常用漢字 GB2312 第1水準 ---
gb=[]
for hi in range(0xB0,0xD8):
    for lo in range(0xA1,0xFF):
        if hi==0xD7 and lo>0xF9:break
        try:gb.append(bytes([hi,lo]).decode('gb2312'))
        except Exception:pass
allc=list(dict.fromkeys(list(freq)+gb))
# --- ICU Han-Latin ---
V='_74';i18n=ctypes.CDLL('libicui18n.so.74')
rules='Han-Latin; NFD; [[:Nonspacing Mark:]-[\\u0308]] Remove; NFC'
u16=lambda s:(ctypes.c_uint16*(len(s.encode('utf-16-le'))//2)).from_buffer_copy(s.encode('utf-16-le'))
class PE(ctypes.Structure):_fields_=[('line',ctypes.c_int32),('offset',ctypes.c_int32),('pre',ctypes.c_uint16*16),('post',ctypes.c_uint16*16)]
op=getattr(i18n,'utrans_openU'+V);op.restype=ctypes.c_void_p
e0=ctypes.c_int(0);pe=PE();tr=op(u16(rules),len(rules),0,None,0,ctypes.byref(pe),ctypes.byref(e0))
if e0.value>0:sys.exit('ICUを開けません: %d'%e0.value)
tf=getattr(i18n,'utrans_transUChars'+V)
def py(ch):
    b=ch.encode('utf-16-le');n=len(b)//2;cap=n*8+16
    buf=(ctypes.c_uint16*cap).from_buffer_copy(b+b'\0'*(cap*2-len(b)))
    ln=ctypes.c_int32(n);lim=ctypes.c_int32(n);e=ctypes.c_int(0)
    tf(ctypes.c_void_p(tr),buf,ctypes.byref(ln),cap,0,ctypes.byref(lim),ctypes.byref(e))
    return bytes(buf)[:ln.value*2].decode('utf-16-le').replace('ü','v').lower()
# --- 多音字の別の読み（よく使うものだけ手で補う）---
ALT={'的':['di'],'了':['liao'],'行':['hang'],'长':['chang'],'得':['dei'],'地':['de'],'都':['du'],'还':['huan'],'会':['kuai'],'重':['chong'],
 '数':['shuo'],'乐':['yue'],'着':['zhao','zhuo'],'间':['jian'],'没':['mo'],'调':['diao'],'种':['zhong'],'什':['shen'],'么':['me'],'给':['ji'],'便':['pian'],'觉':['jiao'],
 '差':['cha','chai'],'传':['zhuan'],'强':['jiang'],'角':['jue'],'教':['jiao'],'血':['xie'],'朝':['zhao'],'场':['chang'],'背':['bei'],
 '率':['shuai'],'和':['he','hu','huo'],'只':['zhi'],'大':['dai'],'降':['xiang'],'曾':['zeng'],'发':['fa'],'假':['jia'],'干':['gan'],'将':['jiang'],'相':['xiang']}
syl=collections.defaultdict(list)
miss=[]
for c in allc:
    p=py(c)
    if not re.fullmatch(r'[a-zv]+',p):miss.append(c);continue
    for x in dict.fromkeys([p]+ALT.get(c,[])):syl[x].append(c)
out={}
for k in sorted(syl):
    cs=syl[k];order={c:i for i,c in enumerate(allc)}
    out[k]=''.join(sorted(cs,key=lambda c:(-freq.get(c,0),order[c])))  # 問題データに出る字を先頭に
open(f'{D}/pinyin.json','w',encoding='utf-8').write('{\n'+',\n'.join('"%s": "%s"'%(k,v) for k,v in out.items())+'\n}')
print('音節',len(out),'文字',sum(len(v) for v in out.values()),'読めなかった字',''.join(miss) or 'なし','/ データ中の漢字',len(freq))
