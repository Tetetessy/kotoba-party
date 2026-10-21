// ハングル文字表（子音×母音の表・パッチム）。表記は「ローマ字(カタカナ)」。カタカナは日本語に近い音で、ㄱ/ㅋなどの区別はローマ字で見てね
const HGT=(()=>{
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
 const html=()=>`<h1 class=ctt><span class=ph>📖 韓国語（한국어）の</span><span class=ph>文字表</span></h1><small><span class=ph>タップすると発音が聞けます。</span><span class=ph>表記は「ローマ字(カタカナ)」です。</span><br><span class=ph>カタカナは日本語に近い音なので、</span><span class=ph>ㅓ/ㅗ・ㅡ/ㅜ・ㄱ/ㅋ などの</span><span class=ph>区別はローマ字で見てね。</span></small>
 <div class="card hg"><h2>① 母音（10個）</h2>${row([0,2,4,6,8,1,3,5,7,9].map(i=>{const [v,r]=VW[i];return chip(v,r,['ア','ヤ','オ','ヨ','オ','ヨ','ウ','ユ','ウ','イ'][i],syl(11,VI[v]))}).join(''))}
 <h3>合成母音（11個）</h3>${row([['ㅐ','ae','エ',1],['ㅒ','yae','イェ',3],['ㅔ','e','エ',5],['ㅖ','ye','イェ',7],['ㅢ','ui','ウィ',19],['ㅘ','wa','ワ',9],['ㅙ','wae','ウェ',10],['ㅚ','oe','ウェ',11],['ㅝ','wo','ウォ',14],['ㅞ','we','ウェ',15],['ㅟ','wi','ウィ',16]].map(([v,r,k,i])=>chip(v,r,k,syl(11,i))).join(''))}</div>
 <div class="card hg"><h2>② 子音（基本14個）</h2>${row(CS.map(([c,l,r,ks])=>chip(c,r||'−',ks.split(' ')[0],syl(l,0))).join(''))}
 <h3>濃音（5個）</h3>${row([['ㄲ','kk','ッカ',1],['ㄸ','tt','ッタ',4],['ㅃ','pp','ッパ',8],['ㅆ','ss','ッサ',10],['ㅉ','jj','ッチャ',13]].map(([c,r,k,l])=>chip(c,r,k,syl(l,0))).join(''))}
 <small>ㅇ は、文字の最初では音がありません（母音だけ読みます）。</small></div>
 <div class="card hg"><h2>③ 子音 × 母音の表</h2><small>見やすいように、2つの表に分けています（ㅜ と ㅠ など、ペアの母音は同じ列です）</small>${grid([0,2,4,6,8])}<div style="height:10px"></div>${grid([1,3,5,7,9])}</div>
 <div class="card hg"><h2>④ パッチム（終わりの子音）</h2><small>文字の下に付く子音です。音は7種類だけです</small><h3>7つの音（아 に付けた例）</h3>${row(main7.map(pc).join(''))}
 <small>ㅇ の音(ng)は、鼻にかかった「ン」です。ㄴ のパッチムと同じカタカナになるので、ローマ字で区別してね。</small>
 <h3>すべてのパッチム（27個）</h3>${row(TN.map((x,i)=>i?pc(i):'').join(''))}
 <small>二重パッチム（ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ）は、ふつう片方だけ読みます。例外もあります（例：읽고 は ㄺ を l と読む など）。</small></div>
 <button class=big onclick="home()">もどる</button>`;
 return{html}})();


// ===== 中国語・タイ語・ベトナム語の文字表（韓国語と同じく、表にまとめる）=====
const CT=(()=>{
 const chip=(big,sm,top,say)=>`<button class=hc onclick="speak('${say||big}')">${top?`<small>${top}</small>`:''}<b>${big}</b><i>${sm}</i></button>`;
 const row=(a,c)=>`<div class="hrow${c?' '+c:''}">${a.join('')}</div>`;
 const bk=l=>P.filter(p=>p.lg==l);
 const find=(l,ch)=>{const x=bk(l).find(p=>p.a[l]==ch);return x?x.a[0]:''};
 const head=(l,flag)=>`<h1 class=ctt><span class=ph>📖 ${LS[l]}の</span><span class=ph>文字表</span></h1>`;
 const tail='<button class=big onclick="home()">もどる</button>';
 // ---- 中国語 ----
 const zh=()=>{const tone=[['ā','第1声','高く平ら'],['á','第2声','上がる'],['ǎ','第3声','低く下がって上がる'],['à','第4声','一気に下がる'],['a','軽声','軽く短く']];
  const ma=['mā','má','mǎ','mà','ma'];
  const ini=[['b','八','bā'],['p','怕','pà'],['m','妈','mā'],['f','发','fā'],['d','大','dà'],['t','他','tā'],['n','你','nǐ'],['l','来','lái'],['g','个','gè'],['k','看','kàn'],['h','好','hǎo'],['j','家','jiā'],['q','去','qù'],['x','学','xué'],['zh','这','zhè'],['ch','吃','chī'],['sh','是','shì'],['r','人','rén'],['z','在','zài'],['c','才','cái'],['s','三','sān']];
  const fin=[['a','啊','ā'],['o','哦','ō'],['e','鹅','é'],['i','衣','yī'],['u','乌','wū'],['ü','鱼','yú'],['ai','爱','ài'],['ei','没','méi'],['ao','好','hǎo'],['ou','后','hòu'],['an','山','shān'],['en','们','men'],['ang','上','shàng'],['eng','风','fēng'],['ong','中','zhōng'],['ia','家','jiā'],['ie','也','yě'],['iao','小','xiǎo'],['iu','就','jiù'],['ian','天','tiān'],['in','心','xīn'],['iang','想','xiǎng'],['ing','星','xīng'],['iong','穷','qióng'],['ua','花','huā'],['uo','多','duō'],['uai','快','kuài'],['ui','对','duì'],['uan','关','guān'],['un','春','chūn'],['uang','光','guāng'],['üe','月','yuè'],['üan','远','yuǎn'],['ün','云','yún'],['er','而','ér']];
  const used=new Set([...ini,...fin].map(x=>x[1]));
  const rest=bk(2).filter(p=>!used.has(p.a[2]));
  return head(2)+`<small><span class=ph>タップすると発音が聞けます。</span><span class=ph>表記はピンイン（ローマ字）です。</span></small>
  <div class="card hg"><h2>① 声調（4つ＋軽声）</h2>${row(tone.map((t,i)=>chip(ma[i],t[1],'',['妈','麻','马','骂','吗'][i])),'g5')}<small>同じ ma でも、声調で意味が変わります（妈・麻・马・骂・吗）。声調は ā á ǎ à の記号で表します。</small></div>
  <div class="card hg"><h2>② 子音（声母 21個）</h2><small>文字の頭の子音です。例の漢字と読みをのせています</small>${row(ini.map(([c,h,r])=>chip(h,r,c)),'g5')}</div>
  <div class="card hg"><h2>③ 母音（韻母 35個）</h2><small>文字の後ろの部分です。i・u・ü で始まる音は、単独では yi・wu・yu と書きます</small>${row(fin.map(([c,h,r])=>chip(h,r,c)),'g5')}</div>
  <div class="card hg"><h2>④ よく使う漢字</h2>${row(rest.map(p=>chip(p.a[2],p.a[0])),'g5')}</div>`+tail};
 // ---- タイ語 ----
 const th=()=>{const cls={mid:'ก จ ฎ ฏ ด ต บ ป อ',hi:'ข ฉ ฐ ถ ผ ฝ ศ ษ ส ห',lo:'ค ฆ ง ช ซ ฌ ญ ฑ ฒ ณ ท ธ น พ ฟ ภ ม ย ร ล ว ฬ ฮ'};
  const cc=s=>s.split(' ').map(c=>chip(c,find(6,c)));
  const vv=[['ะ','a','า','aa'],['ิ','i','ี','ii'],['ึ','ue','ื','uue'],['ุ','u','ู','uu']];
  const dsp=c=>/[ัิ-ฺ็-๎ะาำ]/.test(c)?'◌'+c:c+'◌';
  const vs=c=>'เโไแ'.includes(c[0])?c.replace(/^([เโไแ])/,'$1ก'):'ก'+c;
  const other=['เ','โ','ไ','ำ','เา'];
  const tones=bk(6).filter(p=>/่|้|๊|๋/.test(p.a[6]));
  const more=['แ','เะ','โะ','เอ','ฤ','เีย','เือ','ัว'],syl=bk(6).filter(p=>p.g==5);
  const nums=bk(6).filter(p=>/[๐-๙]/.test(p.a[6]));
  return head(6)+`<small><span class=ph>タップすると発音が聞けます。</span><span class=ph>表記はローマ字です。</span></small>
  <div class="card hg"><h2>① 子音（42文字）</h2><small>タイ語の子音は、音の高さで3グループ（中・高・低）に分かれます</small>
  <h3>中子音（9）</h3>${row(cc(cls.mid),'g4')}<h3>高子音（10）</h3>${row(cc(cls.hi),'g4')}<h3>低子音（23）</h3>${row(cc(cls.lo),'g4')}</div>
  <div class="card hg"><h2>② 母音</h2><small>◌ は子音の位置です。短い音と長い音のペアです</small>
  <table class=hgt style="table-layout:auto"><tr><th>短い音</th><th>長い音</th></tr>${vv.map(v=>`<tr><td>${chip(dsp(v[0]),v[1],'',vs(v[0]))}</td><td>${chip(dsp(v[2]),v[3],'',vs(v[2]))}</td></tr>`).join('')}</table>
  <h3>そのほかの母音</h3>${row(other.map(c=>chip(dsp(c),find(6,c),'',vs(c))),'g4')}
  <h3>形が変わる母音・複合母音</h3>${row(more.map(c=>chip(/ฤ/.test(c)?c:vs(c),find(6,c),'',/ฤ/.test(c)?c:vs(c))),'g4')}</div>
  <div class="card hg"><h2>③ 声調記号（4つ）</h2>${row(tones.map(p=>chip(p.a[6],p.a[0])),'g4')}</div>
  <div class="card hg"><h2>④ 数字（0〜9）</h2>${row(nums.map((p,i)=>chip(p.a[6],p.a[0],i)),'g5')}</div>
  <div class="card hg"><h2>⑤ 音節（子音＋母音）</h2><small>子音と母音を組み合わせた読みの練習です</small>${row(syl.map(p=>chip(p.a[6],p.a[0])),'g5')}</div>`+tail};
 // ---- ベトナム語 ----
 const vi=()=>{const tn=[['ma','ngang','平らな音（記号なし）'],['mà','huyền','低く下がる（`）'],['má','sắc','高く上がる（´）'],['mả','hỏi','下がって上がる（˒）'],['mã','ngã','途中で切れて上がる（~）'],['mạ','nặng','低く重い（.）']];
  const tl=bk(7).filter(p=>p.g==1),al=bk(7).filter(p=>(p.g==2||p.g==3)&&p.a[7].length==1),dg=bk(7).filter(p=>p.g==3&&p.a[7].length==2),tv=bk(7).filter(p=>p.g==4);
  const vw=[...new Set(tv.map(p=>p.a[7].normalize('NFD').replace(/[\u0300\u0301\u0303\u0309\u0323]/g,'').normalize('NFC')))];
  return head(7)+`<small><span class=ph>タップすると発音が聞けます。</span><span class=ph>下の小さな文字は、文字の名前です。</span></small>
  <div class="card hg"><h2>① 声調（6つ）</h2><small>ma に記号を付けると、音の高さと意味が変わります</small>${row(tl.map((p,i)=>chip(p.a[7],p.a[0],'',p.a[7])),'g3')}
  <table class=hgt style="table-layout:auto;margin-top:6px">${tn.map(t=>`<tr><th style="text-align:left">${t[0]}</th><td style="padding:2px 6px">${t[1]}：${t[2]}</td></tr>`).join('')}</table></div>
  <div class="card hg"><h2>② アルファベット（29文字）</h2>${row(al.map(p=>chip(p.a[7],p.a[0])),'g4')}
  <small>ベトナム語のアルファベットは、f・j・w・z を使いません。ă â ê ô ơ ư đ は、ベトナム語の特別な文字です。</small>
  <h3>二文字でひとつの子音（5つ）</h3>${row(dg.map(p=>chip(p.a[7],p.a[0])),'g5')}</div>
  <div class="card hg"><h2>③ 声調つき母音（12×5）</h2><small>母音に声調記号を付けた形です（左から sắc・huyền・hỏi・ngã・nặng）</small>${vw.map(v=>row(tv.filter(p=>p.a[7].normalize('NFD').replace(/[\u0300\u0301\u0303\u0309\u0323]/g,'').normalize('NFC')==v).map(p=>chip(p.a[7],p.a[0])),'g5 vt')).join('')}</div>`+tail};

 // ---- 英語・スペイン語・イタリア語（アルファベット表）----
 const alpha=(l,rows,note,title)=>()=>head(l)+`<small><span class=ph>タップすると発音が聞けます。</span><span class=ph>上は文字の名前、下は例のことばです。</span></small>
  <div class="card hg"><h2>① ${title}</h2>${note}${row(rows.map(([c,n,w])=>chip(c+' '+c.toLowerCase(),w,n,c)),'g4')}</div>`+tail;
 const en=alpha(1,[['A','ei','apple'],['B','bee','banana'],['C','cee','cat'],['D','dee','dog'],['E','ee','egg'],['F','eff','fish'],['G','gee','girl'],['H','aitch','hat'],['I','eye','ice'],['J','jay','juice'],['K','kay','key'],['L','ell','lemon'],['M','em','milk'],['N','en','nose'],['O','oh','orange'],['P','pee','pen'],['Q','cue','queen'],['R','ar','rain'],['S','ess','sun'],['T','tee','tea'],['U','you','umbrella'],['V','vee','violin'],['W','double-u','water'],['X','ex','box'],['Y','why','yellow'],['Z','zee','zoo']],'<small>英語のアルファベットは26文字です。大文字と小文字があります。</small>','アルファベット（26文字）');
 const es=alpha(4,[['A','a','agua'],['B','be','barco'],['C','ce','casa'],['D','de','dedo'],['E','e','escuela'],['F','efe','fruta'],['G','ge','gato'],['H','hache','hotel'],['I','i','isla'],['J','jota','jugo'],['K','ka','kilo'],['L','ele','luna'],['M','eme','mesa'],['N','ene','nube'],['Ñ','eñe','año'],['O','o','ojo'],['P','pe','pan'],['Q','cu','queso'],['R','erre','rojo'],['S','ese','sol'],['T','te','taza'],['U','u','uva'],['V','uve','vaso'],['W','uve doble','wifi'],['X','equis','xilófono'],['Y','ye','yate'],['Z','zeta','zapato']],'<small>スペイン語のアルファベットは27文字です（Ñ があります）。h は発音しません。</small>','アルファベット（27文字）');
 const it=alpha(5,[['A','a','albero'],['B','bi','bambino'],['C','ci','casa'],['D','di','dado'],['E','e','estate'],['F','effe','fiore'],['G','gi','gatto'],['H','acca','hotel'],['I','i','isola'],['L','elle','luna'],['M','emme','mela'],['N','enne','naso'],['O','o','occhio'],['P','pi','pane'],['Q','cu','quadro'],['R','erre','rosa'],['S','esse','sole'],['T','ti','tavolo'],['U','u','uva'],['V','vu','vino'],['Z','zeta','zaino'],['J','i lunga','jeans'],['K','cappa','kiwi'],['W','doppia vu','weekend'],['X','ics','xilofono'],['Y','ipsilon','yogurt']],'<small>イタリア語のアルファベットは21文字です。最後の J・K・W・X・Y は、外来語に使います。h は発音しません。</small>','アルファベット（21+5文字）');
 return{zh,th,vi,en,es,it}})();
