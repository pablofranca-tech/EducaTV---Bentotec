const YT_URL='https://www.youtube.com/@educatvcampinas';
const YT_SUB=YT_URL+'?sub_confirmation=1';
const REDES=[
  {n:'Instagram',c:'ig',u:'https://www.instagram.com/educatvcampinas'},
  {n:'YouTube',c:'yt',u:YT_URL}
];

// Ranking ao vivo: cole aqui a URL do Firebase Realtime Database
// (ex.: https://meu-projeto-default-rtdb.firebaseio.com). Vazio = ranking só neste aparelho.
const CFG={RANKING_URL:''};

const TOTAL=12000;

const QA=[
  {t:'EducaTV',q:'Qual animal é o mascote da EducaTV Campinas?',o:['Coruja','Gato','Papagaio','Lobo'],a:0},
  {t:'EducaTV',q:'Em qual cidade fica a EducaTV que te trouxe até aqui?',o:['Campinas','Santos','Sorocaba','Jundiaí'],a:0}
];

const QM=[
  {t:'Programação',q:'Qual linguagem deixa os sites interativos direto no navegador?',o:['Python','JavaScript','SQL','Java'],a:1},
  {t:'Verdadeiro ou falso',q:'Uma inteligência artificial pode criar imagens a partir de um texto.',o:['Verdadeiro','Falso'],a:0,fix:1},
  {t:'Emoji tech',q:'🤖💬 representam qual tecnologia?',o:['Chatbot','Videogame','Planilha','Drone'],a:0},
  {t:'Programação',q:'Qual linguagem é das mais usadas em IA e análise de dados?',o:['HTML','CSS','Python','Photoshop'],a:2},
  {t:'Dia a dia dev',q:'O que é um "bug"?',o:['Um vírus de celular','Um erro no código','Um tipo de cabo','Um app de música'],a:1},
  {t:'Sistemas',q:'Qual destes é um sistema operacional?',o:['Instagram','Excel','Chrome','Android'],a:3},
  {t:'Sigla',q:'O que significa a sigla IA?',o:['Internet Avançada','Interface Automática','Inteligência Artificial','Informação Aplicada'],a:2},
  {t:'Pegadinha',q:'Um celular e uma capinha custam R$ 110 juntos. O celular custa R$ 100 a mais que a capinha. Quanto custa a capinha?',o:['R$ 10','R$ 5','R$ 15','R$ 1'],a:1},
  {t:'Pegadinha',q:'De que cor é a caixa-preta de um avião?',o:['Preta','Laranja','Cinza','Azul'],a:1},
  {t:'Pegadinha',q:'Quantos meses do ano têm 28 dias?',o:['Só fevereiro','Todos os meses','Nenhum','Seis meses'],a:1},
  {t:'Pegadinha tech',q:'A "nuvem" onde guardamos arquivos é feita de quê?',o:['Vapor de água','Servidores em data centers','Satélites','Ondas de wi-fi'],a:1},
  {t:'Segurança',q:'Qual destas senhas é a mais usada no mundo (e a pior)?',o:['123456','Tr0ub4dor&3','j8#Kd!2pQz','qwerty-zx-91'],a:0},
  {t:'Computação',q:'Quantos bits tem um byte?',o:['4','8','16','10'],a:1},
  {t:'YouTube',q:'Qual botão você aperta no YouTube para acompanhar um canal?',o:['Inscrever-se','Curtir','Compartilhar','Salvar'],a:0},
  {t:'Você já usou',q:'O que significa "QR" em QR code?',o:['Quick Response (resposta rápida)','Quadro Redondo','Query Router','Quase Real'],a:0},
  {t:'Redes sociais',q:'🎵📱 lembram qual rede social?',o:['TikTok','LinkedIn','Telegram','Pinterest'],a:0},
  {t:'Games',q:'Qual jogo é feito de blocos, onde dá para construir e minerar?',o:['Minecraft','Fortnite','Among Us','Free Fire'],a:0},
  {t:'Atalho',q:'Qual atalho de teclado serve para copiar?',o:['Ctrl + C','Ctrl + V','Ctrl + Z','Ctrl + X'],a:0}
];

const QZ=[
  {t:'BentoTec 2026',q:'Em quais dias de outubro acontece o BentoTec 2026?',o:['21 e 22','5 e 6','12 e 13','28 e 29'],a:0},
  {t:'BentoTec 2026',q:'A exposição do BentoTec reúne mais de quantos projetos?',o:['10','30','100','1000'],a:2},
  {t:'BentoTec 2026',q:'Qual edição do BentoTec acontece em 2026?',o:['5ª','17ª','10ª','25ª'],a:1},
  {t:'BentoTec 2026',q:'Em qual escola técnica acontece o BentoTec?',o:['ETEC Bento Quirino','ETEC Jundiaí','ETEC Sorocaba','ETEC Santos'],a:0}
];

const pick=a=>a[Math.random()*a.length|0];
const TIERS=[[9000,'Hacker lendário'],[6000,'Dev do futuro'],[3000,'EducaTV - TECH'],[0,'Novato em boot']];
const $=id=>document.getElementById(id);

let order,i,score,shown,streak,bestStreak,hits,t0,raf,locked,sound=false;

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  $(id).classList.add('on');
  window.scrollTo(0,0);
  if(typeof window.netReflow==='function')window.netReflow();
}

function shuffle(a){
  a=a.slice();
  for(let k=a.length-1;k>0;k--){
    const j=Math.random()*(k+1)|0;
    [a[k],a[j]]=[a[j],a[k]];
  }
  return a;
}

function getBest(){try{return +localStorage.getItem('techrush-best')||0}catch(e){return 0}}
function setBest(v){try{localStorage.setItem('techrush-best',v)}catch(e){}}

function beep(f,d){
  if(!sound)return;
  try{
    const c=beep.c||(beep.c=new(window.AudioContext||window.webkitAudioContext)());
    const o=c.createOscillator(),g=c.createGain();
    o.frequency.value=f;
    o.type='square';
    g.gain.value=.05;
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime+d);
  }catch(e){}
}

$('mute').onclick=()=>{
  sound=!sound;
  $('mute').textContent=sound?'🔊':'🔇';
  beep(660,.1);
};

let player="",me=null,poll=null,goTimer=null;

function cleanName(){return($("nome").value||"").replace(/\s+/g," ").trim().slice(0,14)}

function nameErr(){
  const n=$("nome");
  n.classList.add("err");
  n.focus();
  setTimeout(()=>n.classList.remove("err"),600);
}

function start(){
  const nm=cleanName();
  if(!nm){nameErr();return}
  player=nm;
  try{localStorage.setItem("techrush-name",nm)}catch(e){}
  clearInterval(poll);
  clearInterval(goTimer);
  order=[pick(QA)].concat(shuffle(QM).slice(0,6),[pick(QZ)]);
  i=0;score=0;shown=0;streak=0;bestStreak=0;hits=0;
  $('score').textContent=0;
  show('s-game');
  ask();
}

function ask(){
  locked=false;
  const q=order[i];
  $('prog').textContent=(i+1)+'/'+order.length;
  $('tag').textContent=q.t;
  $('qtext').textContent=q.q;
  $('bubble').textContent='';
  const qc=$('qcard');
  qc.style.animation='none';
  qc.offsetHeight;
  qc.style.animation='';
  const idx=q.o.map((_,k)=>k);
  const ord=q.fix?idx:shuffle(idx);
  $('opts').innerHTML='';
  ord.forEach(k=>{
    const b=document.createElement('button');
    b.className='opt';
    b.textContent=q.o[k];
    b.onclick=e=>answer(k,b,e);
    b.dataset.k=k;
    $('opts').appendChild(b);
  });
  t0=performance.now();
  cancelAnimationFrame(raf);
  tick();
  if(typeof window.netReflow==='function')window.netReflow();
}

function tick(){
  const left=Math.max(0,TOTAL-(performance.now()-t0));
  $('fill').style.width=(left/TOTAL*100)+'%';
  $('bar').classList.toggle('low',left<3500);
  if(left<=0){answer(-1);return}
  raf=requestAnimationFrame(tick);
}

function answer(k,btn,ev){
  if(locked)return;
  locked=true;
  cancelAnimationFrame(raf);
  const q=order[i];
  const left=Math.max(0,TOTAL-(performance.now()-t0));
  const ok=k===q.a;
  document.querySelectorAll('.opt').forEach(b=>{
    b.disabled=true;
    const bk=+b.dataset.k;
    if(bk===q.a)b.classList.add('ok');
    else if(bk===k)b.classList.add('bad');
    else b.classList.add('dim');
  });
  if(ok){
    streak++;hits++;
    bestStreak=Math.max(bestStreak,streak);
    const mult=1+Math.min(streak-1,4)*.25;
    const pts=Math.round((300+700*left/TOTAL)*mult);
    score+=pts;
    count();
    floater('+'+pts,ev,btn);
    burst(btn);
    if(typeof window.fire==='function')window.fire();
    beep(880,.12);
    $('bubble').textContent=['Boa!','Mandou bem!','Que velocidade!','Imparável!'][Math.min(streak-1,3)];
  }else{
    streak=0;
    beep(180,.25);
    $('bubble').textContent=k<0?'O tempo acabou!':'Ops, quase!';
  }
  const m=1+Math.min(streak-1,4)*.25;
  $('combo').innerHTML=streak>=2?'<span>🔥 combo x'+m.toFixed(2).replace(/\.?0+$/,'')+'</span>':'';
  setTimeout(()=>{i++;i<order.length?ask():finish()},1400);
}

function count(){
  const from=shown,to=score,s=performance.now();
  (function f(n){
    const p=Math.min(1,(n-s)/500);
    shown=Math.round(from+(to-from)*p);
    $('score').textContent=shown;
    if(p<1)requestAnimationFrame(f);
  })(s);
}

function floater(txt,ev,btn){
  if(!btn)return;
  const r=btn.getBoundingClientRect();
  const d=document.createElement('div');
  d.className='float';
  d.textContent=txt;
  d.style.left=(ev&&ev.clientX?ev.clientX-30:r.left+20)+'px';
  d.style.top=(r.top-10)+'px';
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),900);
}

function finish(){
  const title=TIERS.find(t=>score>=t[0])[1];
  const best=Math.max(getBest(),score);
  setBest(best);
  me={
    id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    name:player,score,hits,total:order.length,
    combo:bestStreak,title,best
  };
  saveScore(me);
  try{localStorage.setItem('techrush-pending',JSON.stringify(me))}catch(e){}
  $('gname').textContent=player;
  show('s-go');
  beep(520,.2);
  if(typeof window.fire==='function')window.fire();
  let n=4;
  $('gcount').textContent=n;
  clearInterval(goTimer);
  goTimer=setInterval(()=>{
    n--;
    $('gcount').textContent=Math.max(n,0);
    if(n<=0)goYT();
  },1000);
}

function goYT(){
  clearInterval(goTimer);
  try{localStorage.setItem('techrush-left','1')}catch(e){}
  location.href=YT_SUB;
}

function checkBack(){
  let p=null,l=null;
  try{p=localStorage.getItem('techrush-pending');l=localStorage.getItem('techrush-left')}catch(e){}
  if(!(p&&l))return;
  try{
    localStorage.removeItem('techrush-pending');
    localStorage.removeItem('techrush-left');
  }catch(e){}
  clearInterval(goTimer);
  try{showResult(JSON.parse(p))}catch(e){}
}

function showResult(r){
  me=r;
  $('rtitle').textContent=r.title;
  $('rname').textContent=r.name;
  $('rscore').textContent=r.score;
  $('rhit').textContent=r.hits+'/'+r.total;
  $('rcombo').textContent=r.combo;
  $('rbest').textContent=r.best;
  $('socs').innerHTML=REDES.map(x=>'<a class="'+x.c+'" href="'+x.u+'" target="_blank" rel="noopener">'+x.n+'</a>').join('');
  $('links').innerHTML=REDES.map(x=>'<div class="lrow"><span>'+x.u.replace('https://','')+'</span><button data-u="'+x.u+'">Copiar link</button></div>').join('');
  show('s-end');
  if(r.score>0)burst($('rscore'),90);
  if(typeof window.fire==='function')window.fire();
  loadRank();
  clearInterval(poll);
  poll=setInterval(loadRank,3000);
}

async function saveScore(r){
  const row={id:r.id,name:r.name,score:r.score,ts:Date.now()};
  if(CFG.RANKING_URL){
    try{
      await fetch(CFG.RANKING_URL+'/ranking.json',{method:'POST',body:JSON.stringify(row)});
      return;
    }catch(e){}
  }
  try{
    const a=JSON.parse(localStorage.getItem('techrush-rank')||'[]');
    a.push(row);
    localStorage.setItem('techrush-rank',JSON.stringify(a.slice(-200)));
  }catch(e){}
}

async function loadRank(){
  let rows=[],live=false;
  if(CFG.RANKING_URL){
    try{
      const j=await(await fetch(CFG.RANKING_URL+'/ranking.json')).json();
      rows=Object.values(j||{});
      live=true;
    }catch(e){}
  }
  if(!live){
    try{rows=JSON.parse(localStorage.getItem('techrush-rank')||'[]')}catch(e){}
  }
  const best={};
  rows.forEach(x=>{
    if(!x||typeof x.score!=='number'||typeof x.name!=='string')return;
    const k=x.name.toLowerCase();
    if(!best[k]||x.score>best[k].score)best[k]=x;
  });
  const top=Object.values(best).sort((a,b)=>b.score-a.score);
  const ol=$('rank');
  ol.textContent='';
  top.slice(0,10).forEach((x,k)=>{
    const li=document.createElement('li'),a=document.createElement('b'),b=document.createElement('span'),c=document.createElement('em');
    a.textContent=['🥇','🥈','🥉'][k]||(k+1);
    b.textContent=x.name.slice(0,14);
    c.textContent=x.score;
    if(me&&x.name.toLowerCase()===me.name.toLowerCase())li.className='me';
    li.append(a,b,c);
    ol.appendChild(li);
  });
  const pos=me?top.findIndex(x=>x.name.toLowerCase()===me.name.toLowerCase())+1:0;
  $('pos').textContent=pos?'Sua posição: '+pos+'º de '+top.length:'';
  $('live').textContent=live?'● ao vivo':'neste aparelho';
  if(typeof window.netReflow==='function')window.netReflow();
}

/* ===== LIGAÇÕES DE EVENTOS ===== */
$('play').onclick=start;
$('again').onclick=start;
$('gbtn').addEventListener('click',()=>{
  clearInterval(goTimer);
  try{localStorage.setItem('techrush-left','1')}catch(e){}
});
$('links').addEventListener('click',async e=>{
  const b=e.target.closest('button');
  if(!b)return;
  const u=b.dataset.u;
  try{await navigator.clipboard.writeText(u)}catch(_){
    const t=document.createElement('textarea');
    t.value=u;
    document.body.appendChild(t);
    t.select();
    try{document.execCommand('copy')}catch(__){}
    t.remove();
  }
  b.textContent='Copiado!';
  setTimeout(()=>{b.textContent='Copiar link'},1600);
});
$('nome').addEventListener('keydown',e=>{if(e.key==='Enter')start()});
try{$('nome').value=localStorage.getItem('techrush-name')||''}catch(e){}

addEventListener('pageshow',checkBack);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkBack()});

const b=getBest();
if(b)$('rec').textContent='Seu recorde: '+b+' pontos';

/* ===== CONFETE (#fx) ===== */
const cv=$('fx'),cx=cv.getContext('2d');
let P=[],run=false;
function size(){cv.width=innerWidth;cv.height=innerHeight}
size();
addEventListener('resize',size);

function burst(el,n){
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  if(!el)return;
  const r=el.getBoundingClientRect();
  const x=r.left+r.width/2,y=r.top+r.height/2;
  const C=['#ffc83d','#e11fd0','#7c3aed','#3b82f6','#22e08a'];
  for(let k=0;k<(n||36);k++){
    const a=Math.random()*Math.PI*2,s=3+Math.random()*7;
    P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-4,w:6+Math.random()*6,c:C[k%5],l:60+Math.random()*30,r:Math.random()*6});
  }
  if(!run){run=true;loop()}
}
function loop(){
  cx.clearRect(0,0,cv.width,cv.height);
  P=P.filter(p=>p.l-->0);
  P.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;
    p.vy+=.35;
    p.vx*=.985;
    p.r+=.2;
    cx.save();
    cx.translate(p.x,p.y);
    cx.rotate(p.r);
    cx.globalAlpha=Math.min(1,p.l/25);
    cx.fillStyle=p.c;
    cx.fillRect(-p.w/2,-p.w/4,p.w,p.w/2);
    cx.restore();
  });
  if(P.length)requestAnimationFrame(loop);else run=false;
}

/* ===== CÉU ESTELAR TECH (#net) ===== */
(function(){
  const c=$('net'),g=c.getContext('2d');
  const L=['EducaTV','Campinas','Educação','Tecnologia','Escolas','Professores','Estudantes','Cultura','Ciência','Inovação','Robótica','Programação','IA','Games','Internet','Redes sociais','Vídeos','Jornalismo','Música','Arte','Esportes','Futuro','Criatividade','Leitura','Matemática','Projetos','Aprender','Compartilhar','Juventude','BentoTec'];
  const SEL='.screen.on h1,.screen.on h2,.screen.on p,.screen.on input,.screen.on button,.screen.on .btn,.screen.on img,.screen.on .chip,.screen.on .qcard,.screen.on .opt,.screen.on .panel,.screen.on .bar,.screen.on .hud,.screen.on .foot,.screen.on .combo span,.screen.on .brand,.mute';
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let W,H,D,S=[],N=[],hubs=[],chain=[],pulses=[],R=[],shoot=null,t0=performance.now(),lastR=0,key='',SEG=.5,CYC=12;
  const cl=(v,a,b)=>Math.min(b,Math.max(a,v));

  function rects(){
    R=[];
    document.querySelectorAll(SEL).forEach(e=>{
      const r=e.getBoundingClientRect();
      if(r.width<2||r.height<2)return;
      R.push([r.left-6,r.top-4,r.width+12,r.height+8]);
    });
  }
  function free(x,y){return!R.some(r=>x+38>r[0]&&x-38<r[0]+r[2]&&y+30>r[1]&&y-8<r[1]+r[3])}
  function anchor(i){const u=i/(L.length-1);return[(.5+.44*Math.sin(u*14+.6))*W,(.04+.92*u)*H]}
  function place(){
    rects();
    const k2=W+'x'+H+R.map(r=>r.map(Math.round)).join('|');
    if(k2===key)return;
    key=k2;
    const taken=[],step=W*H>600000?22:16;
    hubs.forEach((h,k)=>{
      const[ax,ay]=anchor(k);
      let best=null,bd=1e9;
      for(let x=40;x<=W-40;x+=step)for(let y=16;y<H-34;y+=step){
        const d=Math.hypot(x-ax,y-ay);
        if(d>=bd)continue;
        if(!free(x,y)||taken.some(q=>Math.abs(q[0]-x)<88&&Math.abs(q[1]-y)<32))continue;
        bd=d;
        best=[x,y];
      }
      h.vis=!!best;
      if(best){
        h.tx=best[0];h.ty=best[1];
        if(h.x==null){h.x=h.tx;h.y=h.ty}
        taken.push(best);
      }
    });
    chain=hubs.filter(h=>h.vis);
    const m=Math.max(chain.length-1,1);
    SEG=cl(7/m,.18,.9);
    CYC=SEG*m+5;
  }
  window.netReflow=()=>setTimeout(place,90);

  function init(){
    D=Math.min(devicePixelRatio||1,2);
    W=innerWidth;H=innerHeight;
    c.width=W*D;
    c.height=H*D;
    g.setTransform(D,0,0,D,0,0);
    hubs=L.map((l,i)=>({l,x:null,y:null,tx:0,ty:0,ph:i*1.7,vis:false}));
    S=Array.from({length:Math.round(Math.min(160,W*H/5000))},()=>({x:Math.random()*W,y:Math.random()*H,r:.4+Math.random()*1.2,ph:Math.random()*6,sp:.8+Math.random()*2,c:Math.random()<.3?'180,230,255':'255,255,255'}));
    N=Array.from({length:Math.round(Math.min(42,W*H/14000))},()=>({x:Math.random()*W,y:Math.random()*H,vx:still?0:(Math.random()-.5)*.3,vy:still?0:(Math.random()-.5)*.3,r:1.2+Math.random()*1.6}));
    key='';
    place();
  }
  function pulse(a,b,s){pulses.push({a,b,t:0,s:s||.012+Math.random()*.01})}
  window.fire=function(){
    for(let k=0;k<chain.length-1;k++)pulse(chain[k],chain[k+1],.03);
    for(let k=0;k<8&&k<N.length;k++)pulse(N[k],N[(k*5+3)%N.length],.02);
  };

  function frame(now){
    const t=(now-t0)/1000,n=chain.length,tc=still?CYC*.6:t%CYC,fade=tc>CYC-1?CYC-tc:1;
    if(now-lastR>150){rects();lastR=now}
    g.clearRect(0,0,W,H);

    S.forEach(s=>{
      const a=.3+.7*Math.abs(Math.sin(t*s.sp+s.ph));
      g.fillStyle='rgba('+s.c+','+(still?.7:a)+')';
      g.beginPath();g.arc(s.x,s.y,s.r,0,6.3);g.fill();
    });

    N.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;
      if(p.y<0||p.y>H)p.vy*=-1;
    });

    g.lineWidth=1;
    for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){
      const a=N[i],b=N[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<130){
        g.strokeStyle='rgba(150,200,255,'+(.3*(1-d/130))+')';
        g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();
      }
    }
    g.fillStyle='rgba(200,230,255,.9)';
    N.forEach(p=>{
      g.shadowColor='#7fd8ff';g.shadowBlur=8;
      g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.fill();
    });
    g.shadowBlur=0;

    if(!still){
      if(!shoot&&Math.random()<.004)shoot={x:Math.random()*W*.7,y:Math.random()*H*.4,l:0};
      if(shoot){
        shoot.x+=9;shoot.y+=4;shoot.l++;
        const gr=g.createLinearGradient(shoot.x-70,shoot.y-30,shoot.x,shoot.y);
        gr.addColorStop(0,'rgba(143,233,255,0)');
        gr.addColorStop(1,'rgba(220,250,255,.95)');
        g.strokeStyle=gr;
        g.lineWidth=2;
        g.beginPath();g.moveTo(shoot.x-70,shoot.y-30);g.lineTo(shoot.x,shoot.y);g.stroke();
        if(shoot.l>45)shoot=null;
      }
    }

    chain.forEach(h=>{
      if(h.x!=null){
        h.x+=(h.tx+(still?0:Math.sin(t*.7+h.ph)*5)-h.x)*.06;
        h.y+=(h.ty+(still?0:Math.cos(t*.6+h.ph)*5)-h.y)*.06;
      }
    });

    g.globalAlpha=fade;
    for(let k=0;k<n-1;k++){
      const a=chain[k],b=chain[k+1],p=cl((tc-.5-k*SEG)/SEG,0,1);
      if(p<=0)continue;
      const x=a.x+(b.x-a.x)*p,y=a.y+(b.y-a.y)*p;
      g.strokeStyle='rgba(255,214,102,.85)';
      g.lineWidth=2;
      g.shadowColor='#ffc83d';
      g.shadowBlur=10;
      g.beginPath();g.moveTo(a.x,a.y);g.lineTo(x,y);g.stroke();
      if(p<1){
        g.fillStyle='#fff';
        g.shadowColor='#8fe9ff';
        g.shadowBlur=18;
        g.beginPath();g.arc(x,y,4.5,0,6.3);g.fill();
      }
      g.shadowBlur=0;
      g.lineWidth=1;
    }
    chain.forEach((h,k)=>{
      const lit=k?cl((tc-.5-k*SEG)/.35,0,1):cl(tc/.35,0,1);
      g.globalAlpha=fade*(.25+.75*lit);
      const r=3+lit*(k?3.5:6)+Math.sin(t*2+k)*lit*1.1;
      g.shadowColor=k?'#9fc4ff':'#ffc83d';
      g.shadowBlur=8+lit*14;
      g.fillStyle='#fff';
      g.beginPath();g.arc(h.x,h.y,r,0,6.3);g.fill();
      g.shadowBlur=0;
      if(lit>0&&lit<1){
        g.globalAlpha=fade*(1-lit);
        g.strokeStyle='#fff';
        g.beginPath();g.arc(h.x,h.y,r+lit*20,0,6.3);g.stroke();
      }
      if(lit>0){
        g.globalAlpha=fade*lit;
        g.font='700 12px "Chakra Petch","Trebuchet MS",sans-serif';
        g.textAlign='center';
        g.fillStyle='#fff';
        g.shadowColor='rgba(20,5,70,.9)';
        g.shadowBlur=6;
        g.fillText(h.l,cl(h.x,40,W-40),h.y+r+15);
        g.shadowBlur=0;
      }
    });
    g.globalAlpha=1;

    if(!still&&Math.random()<.05){
      const a=N[Math.random()*N.length|0],b=N.find(o=>o!==a&&Math.hypot(a.x-o.x,a.y-o.y)<130);
      if(a&&b)pulse(a,b);
    }

    pulses=pulses.filter(q=>(q.t+=q.s)<1);
    pulses.forEach(q=>{
      const x=q.a.x+(q.b.x-q.a.x)*q.t,y=q.a.y+(q.b.y-q.a.y)*q.t;
      g.shadowColor='#8fe9ff';
      g.shadowBlur=14;
      g.fillStyle='#d8f6ff';
      g.beginPath();g.arc(x,y,2.6,0,6.3);g.fill();
      g.shadowBlur=0;
    });

    g.globalCompositeOperation='destination-out';
    g.fillStyle='#000';
    R.forEach(r=>g.fillRect(r[0],r[1],r[2],r[3]));
    g.globalCompositeOperation='source-over';

    if(!still)requestAnimationFrame(frame);
  }

  setInterval(place,1200);
  init();
  addEventListener('resize',()=>{init();if(still)frame(t0+1)});
  addEventListener('scroll',()=>{lastR=0},{passive:true});
  if(still)frame(t0+1);else requestAnimationFrame(frame);
})();

checkBack();
