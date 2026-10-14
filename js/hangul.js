// ハングル文字表（子音×母音の表・パッチム）。表記は「ローマ字(カタカナ)」。カタカナは日本語に近い音で、ㄱ/ㅋなどの区別はローマ字で見てね
const HG=(()=>{
 const VI={'ㅏ':0,'ㅑ':2,'ㅓ':4,'ㅕ':6,'ㅗ':8,'ㅛ':12,'ㅜ':13,'ㅠ':17,'ㅡ':18,'ㅣ':20};
 const VW=[['ㅏ','a'],['ㅑ','ya'],['ㅓ','eo'],['ㅕ','yeo'],['ㅗ','o'],['ㅛ','yo'],['ㅜ','u'],['ㅠ','yu'],['ㅡ','eu'],['ㅣ','i']];
 // 子音: [文字, 初声番号, ローマ字, カタカナ10個(母音の順)]
 const K1='カ キャ コ キョ コ キョ ク キュ ク キ',T1='タ ティャ ト ティョ ト ティョ トゥ ティュ トゥ ティ',P1='パ ピャ ポ ピョ ポ ピョ プ ピュ プ ピ',C1='チャ チャ チョ チョ チョ チョ チュ チュ チュ チ';
 const CS=[['ㄱ',0,'g',K1],['ㄴ',2,'n','ナ ニャ ノ ニョ ノ ニョ ヌ ニュ ヌ ニ'],['ㄷ',3,'d',T1],['ㄹ',5,'r','ラ リャ ロ リョ ロ リョ ル リュ ル リ'],['ㅁ',6,'m','マ ミャ モ ミョ モ ミョ ム ミュ ム ミ'],['ㅂ',7,'b',P1],['ㅅ',9,'s','サ シャ ソ ショ ソ ショ ス シュ ス シ'],['ㅇ',11,'','ア ヤ オ ヨ オ ヨ ウ ユ ウ イ'],['ㅈ',12,'j',C1],['ㅊ',14,'ch',C1],['ㅋ',15,'k',K1],['ㅌ',16,'t',T1],['ㅍ',17,'p',P1],['ㅎ',18,'h','ハ ヒャ ホ ヒョ ホ ヒョ フ ヒュ フ ヒ']];
 const syl=(l,v,t=0)=>String.fromCharCode(0xAC00+(l*21+v)*28+t);
 const cell=(c,r,k)=>`<td><button class=hc onclick="speak('${c}')" aria-label="${c}"><b>${c}</b><i>${r}</i><em>(${k})</em></button></td>`;
 const grid=(vs)=>`<div class=hgw><table class=hgt><tr><th></th>${vs.map(i=>`<th>${VW[i][0]}<br><small>${VW[i][1]}</small></th>`).join('')}</tr>${CS.map(([ch,l,ro,ks])=>{const k=ks.split(' ');
  return`<tr><th>${ch}<br><small>${ro||'−'}</small></th>${vs.map(i=>{const v=VW[i][0];return cell(syl(l,VI[v]),ro+VW[i][1],k[i])}).join('')}</tr>`}).join('')}</table></div>`;
 const chip=(c,r,k,s)=>`<button class=hc onclick="speak('${s||c}')"><b>${c}</b><i>${r}</i><em>(${k})</em></button>`;
 // パッチム（終声）: 番号→終わりの音
 const TN=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
 const SD={k:['k','ク'],n:['n','ン'],t:['t','ッ'],l:['l','ル'],m:['m','ム'],p:['p','プ'],ng:['ng','ン']};
 const TS=['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];
 const pc=t=>{const s=SD[TS[t]];return `<button class=hc onclick="speak('${syl(11,0,t)}')"><small>${TN[t]}</small><b>${syl(11,0,t)}</b><i>a${s[0]}</i><em>(ア${s[1]})</em></button>`};
 const main7=[1,4,7,8,16,17,21];
 const row=a=>`<div class=hrow>${a}</div>`;
 const html=()=>`<h1><span class=ph>📖 韓国語（한국어）の</span><span class=ph>文字表</span></h1><small><span class=ph>タップすると発音が聞けます。</span><span class=ph>表記は「ローマ字(カタカナ)」です。</span><br><span class=ph>カタカナは日本語に近い音なので、</span><span class=ph>ㅓ/ㅗ・ㅡ/ㅜ・ㄱ/ㅋ などの</span><span class=ph>区別はローマ字で見てね。</span></small>
 <div class="card hg"><h2>① 母音（10個）</h2>${row(VW.map(([v,r],i)=>chip(v,r,['ア','ヤ','オ','ヨ','オ','ヨ','ウ','ユ','ウ','イ'][i],syl(11,VI[v]))).join(''))}
 <h3>合成母音（11個）</h3>${row([['ㅐ','ae','エ',1],['ㅒ','yae','イェ',3],['ㅔ','e','エ',5],['ㅖ','ye','イェ',7],['ㅘ','wa','ワ',9],['ㅙ','wae','ウェ',10],['ㅚ','oe','ウェ',11],['ㅝ','wo','ウォ',14],['ㅞ','we','ウェ',15],['ㅟ','wi','ウィ',16],['ㅢ','ui','ウィ',19]].map(([v,r,k,i])=>chip(v,r,k,syl(11,i))).join(''))}</div>
 <div class="card hg"><h2>② 子音（基本14個）</h2>${row(CS.map(([c,l,r,ks])=>chip(c,r||'−',ks.split(' ')[0],syl(l,0))).join(''))}
 <h3>濃音（5個）</h3>${row([['ㄲ','kk','ッカ',1],['ㄸ','tt','ッタ',4],['ㅃ','pp','ッパ',8],['ㅆ','ss','ッサ',10],['ㅉ','jj','ッチャ',13]].map(([c,r,k,l])=>chip(c,r,k,syl(l,0))).join(''))}
 <small>ㅇ は、文字の最初では音がありません（母音だけ読みます）。</small></div>
 <div class="card hg"><h2>③ 子音 × 母音の表</h2><small>見やすいように、母音で2つの表に分けています</small>${grid([0,1,2,3,4])}<div style="height:10px"></div>${grid([5,6,7,8,9])}</div>
 <div class="card hg"><h2>④ パッチム（終わりの子音）</h2><small>文字の下に付く子音です。音は7種類だけです</small><h3>7つの音（아 に付けた例）</h3>${row(main7.map(pc).join(''))}
 <small>ㅇ の音(ng)は、鼻にかかった「ン」です。ㄴ のパッチムと同じカタカナになるので、ローマ字で区別してね。</small>
 <h3>すべてのパッチム（27個）</h3>${row(TN.map((x,i)=>i?pc(i):'').join(''))}
 <small>二重パッチム（ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ）は、ふつう片方だけ読みます。例外もあります（例：읽고 は ㄺ を l と読む など）。</small></div>
 <button class=big onclick="home()">もどる</button>`;
 return{html}})();
