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

const QA=[ // abertura: sempre uma pergunta da EducaTV
  {t:'EducaTV',q:'Qual animal é o mascote da EducaTV Campinas?',o:['Coruja','Gato','Papagaio','Lobo'],a:0},
  {t:'EducaTV',q:'Em qual cidade fica a EducaTV que te trouxe até aqui?',o:['Campinas','Santos','Sorocaba','Jundiaí'],a:0}
];

const QM=[ // meio: 6 sorteadas (conhecidas, tecnologia e pegadinhas)
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

const QZ=[ // final: uma pergunta do BentoTec
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
  window.netReflow&&netReflow();
}
function shuffle(a){a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.random()*(k+1)|0;[a[k],a[j]]=[a[j],a[k]]}return a}
function getBest(){try{return +localStorage.getItem('techrush-best')||0}catch(e){return 0}}
function setBest(v){try{localStorage.setItem('techrush-best',v)}catch(e){}}
function beep(f,d){
  if(!sound)return;
  try{
    const c=beep.c||(beep.c=new(window.AudioContext||window.webkitAudioContext)());
    const o=c.createOscillator(),g=c.createGain();
    o.frequency.value=f;o.type='square';g.gain.value=.05;
    o.connect(g);g.connect(c.destination);
    o.start();o.stop(c.currentTime+d);
  }catch(e){}
}
$('mute').onclick=()=>{sound=!sound;$('mute').textContent=sound?'🔊':'🔇';beep(660,.1)};

let player="",me=null,poll=null,goTimer=null;

function cleanName(){return($("nome").value||"").replace(/\s+/g," ").trim().slice(0,14)}
function nameErr(){
  const n=$("nome");
  n.classList.add("err");n.focus();
  setTimeout(()=>n.classList.remove("err"),600);
}

function start(){
  const nm=cleanName();
  if(!nm){nameErr();return}
  player=nm;
  try{localStorage.setItem("techrush-name",nm)}catch(e){}
  clearInterval(poll);clearInterval(goTimer);
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
  qc.style.animation='none';qc.offsetHeight;qc.style.animation='';
  const idx=q.o.map((_,k)=>k);
  const ord=q.fix?idx:shuffle(idx);
  $('opts').innerHTML='';
  ord.forEach(k=>{
    const b=document.createElement('button');
    b.className='opt';b.textContent=q.o[k];
    b.onclick=e=>answer(k,b,e);
    b.dataset.k=k;
    $('opts').appendChild(b);
  });
  t0=performance.now();
  cancelAnimationFrame(raf);
  tick();
  window.netReflow&&netReflow();
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
    streak++;hits++;bestStreak=Math.max(bestStreak,streak);
    const mult=1+Math.min(streak-1,4)*.25;
    const pts=Math.round((300+700*left/TOTAL)*mult);
    score+=pts;count();
    floater('+'+pts,ev,btn);burst(btn);fire();beep(880,.12);
    $('bubble').textContent=['Boa!','Mandou bem!','Que velocidade!','Imparável!'][Math.min(streak-1,3)];
  }else{
    streak=0;beep(180,.25);
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
  d.className='float';d.textContent=txt;
  d.style.left=(ev&&ev.clientX?ev.clientX-30:r.left+20)+'px';
  d.style.top=(r.top-10)+'px';
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),900);
}

function finish(){
  const title=TIERS.find(t=>score>=t[0])[1];
  const best=Math.max(getBest(),score);
  setBest(best);
  me={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:player,score,hits,total:order.length,combo:bestStreak,title,best};
  saveScore(me);
  try{localStorage.setItem('techrush-pending',JSON.stringify(me))}catch(e){}
  $('gname').textContent=player;
  show('s-go');
  beep(520,.2);fire();
  let n=4;$('gcount').textContent=n;
  clearInterval(goTimer);
  goTimer=setInterval(()=>{n--;$('gcount').textContent=Math.max(n,0);if(n<=0)goYT()},1000);
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
  try{localStorage.removeItem('techrush-pending');localStorage.removeItem('techrush-left')}catch(e){}
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
  fire();
  loadRank();
  clearInterval(poll);
  poll=setInterval(loadRank,3000);
}

async function saveScore(r){
  const row={id:r.id,name:r.name,score:r.score,ts:Date.now()};
  try{await fetch(CFG.RANKING_URL,{method:'POST',body:JSON.stringify(row)})}catch(e){}
}

async function loadRank(){
  try{const res=await fetch(CFG.RANKING_URL);const data=await res.json();if(data.length)data.sort((a,b)=>b.score-a.score)}catch(e){}
} 