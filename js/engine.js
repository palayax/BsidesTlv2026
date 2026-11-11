/* =========================================================================
   Presentation engine - clicker-first.
   Next : PageDown, ArrowRight, ArrowDown, Space, Enter, N, mouse click
   Prev : PageUp, ArrowLeft, ArrowUp, Backspace, P
   B / . / W : blackout      F5 / Esc / F : toggle fullscreen (clicker "start" button)
   Home/End : first/last     S : setup (choose cases)     V : open presenter view
   ========================================================================= */
(function(){
// rail pills: [label, phase, fromStep, toStep, attackStyle]
const PILLS=[['Normal workflow','scenario',0,0],['Attack','scenario',1,1,1],['Before / after','scenario',2,99,1],['Forensic gaps','readiness',0,99]];
const PHORDER=['scenario','readiness'];
const LS_KEY='bsides26-cases';
const isPresenter=new URLSearchParams(location.search).has('presenter');
let deck=[], idx=0, step=0, maxStep=0;
const chan=('BroadcastChannel' in window)?new BroadcastChannel('bsides26-deck'):null;

function caseOrder(){
  const all=Object.keys(DECK.cases);
  const q=new URLSearchParams(location.search).get('cases');
  if(q) return q.split(',').filter(c=>all.includes(c));
  try{const s=JSON.parse(localStorage.getItem(LS_KEY)||'null'); if(Array.isArray(s)) return s.filter(c=>all.includes(c));}catch(e){}
  return DECK.defaultOrder.filter(c=>all.includes(c));
}
function build(){
  const order=caseOrder();
  deck=[];
  const add=(s,ctx)=>deck.push(Object.assign({},s,ctx||{}));
  DECK.intro.forEach(s=>add(s));
  if(DECK.agenda) add(DECK.agenda(order));
  order.forEach((id,i)=>{const c=DECK.cases[id]; c.slides.forEach(s=>add(s,{caseId:id,caseNo:i+1,caseMeta:c}));});
  DECK.outro.forEach(s=>add(s));
}

/* ---------- rendering ---------- */
function chromeHTML(s,i){
  const c=s.caseMeta;
  const caseTxt=c?`CASE ${String(s.caseNo).padStart(2,'0')} // ${c.code} // ${c.title}`:(s.section||'BSides TLV 2026 · AI Village');
  const sev=c?`<span class="sev ${c.sev||'crit'}">${(c.sevLabel||c.sev||'crit').toUpperCase()}</span>`:'';
  return `<div class="chrome"><div class="brand"><img src="assets/img/palaya-mark.png" alt="" style="height:30px;vertical-align:middle;margin-right:10px">PALAYA</div><div class="case">${caseTxt}</div><div class="sp"></div>${sev}<span class="tlp">TLP:CLEAR</span><span class="clock" data-clock></span><span class="scr">SCREEN ${String(i+1).padStart(2,'0')}<b data-scrstep></b></span><span class="ctr">/ ${deck.length}</span></div>`;
}
function railHTML(s){
  let left='';
  if(s.caseMeta){
    left=PILLS.map((p,k)=>`<span class="ph" data-pill="${k}"><i></i>${p[0]}</span>`).join('<span class="arrow">›</span>');
  } else left=`<span class="ph cur"><i></i>${s.section||'The Forensic Gaps in Agentic AI'}</span>`;
  return `<div class="rail">${left}<div class="sp"></div><div class="steps" data-steps></div></div>`;
}
function renderInto(root,i,st,withChrome=true){
  const s=deck[i]; if(!s) {root.innerHTML='';return 0;}
  const body=typeof s.html==='function'?s.html(s):s.html;
  root.innerHTML=(withChrome?chromeHTML(s,i):'')+`<div class="slide ${s.cls||''}">${body}</div>`+(withChrome?railHTML(s):'');
  root._slide=s;
  const m=computeMax(root);
  applyStep(root,st,m);
  if(s.onRender) s.onRender(root);
  return m;
}
function computeMax(root){
  let m=0;
  root.querySelectorAll('[data-in],[data-on],[data-out],[data-dim]').forEach(e=>{
    for(const k of ['in','out','dim','on']){const v=e.dataset[k]; if(v==null) continue;
      v.split(/[,\-]/).forEach(x=>{const n=parseInt(x,10); if(!isNaN(n)) m=Math.max(m,n);});}
  });
  return m;
}
function inSpec(spec,st){
  return spec.split(',').some(part=>{const [a,b]=part.split('-').map(Number); return isNaN(b)?st===a:(st>=a&&st<=b);});
}
function applyStep(root,st,m){
  root.querySelectorAll('[data-in]').forEach(e=>e.classList.toggle('shown',st>=+e.dataset.in));
  root.querySelectorAll('[data-on]').forEach(e=>{const on=inSpec(e.dataset.on,st); e.classList.toggle('on',on); e.classList.toggle('act',on);});
  root.querySelectorAll('[data-out]').forEach(e=>e.classList.toggle('gone',st>=+e.dataset.out));
  root.querySelectorAll('[data-dim]').forEach(e=>e.classList.toggle('dimmed',st>=+e.dataset.dim));
  const bar=root.querySelector('[data-steps]');
  if(bar){bar.innerHTML=m?Array.from({length:m+1},(_,k)=>`<b class="${k<=st?'on':''}"></b>`).join(''):'';}
  const ss=root.querySelector('[data-scrstep]'); if(ss) ss.textContent=m?`· CLICK ${st+1}/${m+1}`:'';
  const cs=root._slide;
  if(cs&&cs.caseMeta){ const pi=PHORDER.indexOf(cs.phase);
    root.querySelectorAll('[data-pill]').forEach(e=>{const p=PILLS[+e.dataset.pill], ppi=PHORDER.indexOf(p[1]);
      const cur=ppi===pi&&st>=p[2]&&st<=p[3]; const done=ppi<pi||(ppi===pi&&st>p[3]);
      e.className='ph'+(cur?' cur':'')+(cur&&p[4]?' x':'')+(done?' done':'');});
  }
  const s=deck[idx]; if(s&&s.onStep&&root.id==='stage') s.onStep(root,st);
}

/* ---------- main stage ---------- */
const stage=()=>document.getElementById('stage');
function show(i,st,broadcast=true){
  i=Math.max(0,Math.min(deck.length-1,i));
  const changed=i!==idx||!stage().firstChild;
  idx=i;
  if(changed){ maxStep=renderInto(stage(),idx,0); }
  step=st==='end'?maxStep:Math.max(0,Math.min(maxStep,st));
  applyStep(stage(),step,maxStep);
  tick();
  history.replaceState(null,'',`#${deck[idx].id||idx}/${step}`+'');
  if(broadcast&&chan) chan.postMessage({t:'nav',idx,step});
  if(isPresenter) renderPresenter();
}
function next(){ if(step<maxStep) show(idx,step+1); else if(idx<deck.length-1) show(idx+1,0); }
function prev(){ if(step>0) show(idx,step-1); else if(idx>0) show(idx-1,'end'); }

function fit(){
  const vw=innerWidth, vh=innerHeight, sc=Math.min(vw/1920,vh/1080);
  const el=stage(); el.style.transform=`scale(${sc})`;
  el.style.left=((vw-1920*sc)/2)+'px'; el.style.top=((vh-1080*sc)/2)+'px';
}
function tick(){
  const d=new Date(); const t=d.toISOString().slice(11,19)+'Z';
  document.querySelectorAll('[data-clock]').forEach(e=>e.textContent=t);
}

/* ---------- presenter ---------- */
let t0=null;
function renderPresenter(){
  const P=document.getElementById('presenter');
  if(!P.dataset.ready){
    P.innerHTML=`<div class="pbar"><span class="timer" id="ptimer">00:00</span><button id="pstart">start/reset timer</button><span id="ppos"></span><span style="flex:1"></span><span id="pclock"></span></div>
      <div class="cur" id="pcur"><span class="lbl">NOW</span><div class="mini" id="pcurmini"></div></div>
      <div class="side"><div class="nxt" id="pnxt"><span class="lbl">NEXT</span><div class="mini" id="pnxtmini"></div></div><div class="notes" id="pnotes"></div><div class="sl" id="plist"></div></div>`;
    P.dataset.ready=1;
    document.getElementById('pstart').onclick=()=>{t0=Date.now();};
    setInterval(()=>{const e=document.getElementById('ptimer'); if(t0){const s=Math.floor((Date.now()-t0)/1000); e.textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
      document.getElementById('pclock').textContent=new Date().toLocaleTimeString();},500);
    new ResizeObserver(scaleMinis).observe(P);
  }
  const cur=document.getElementById('pcurmini'), nx=document.getElementById('pnxtmini');
  const m=renderInto(cur,idx,step);
  if(step<m) renderInto(nx,idx,step+1); else renderInto(nx,idx+1,0);
  const s=deck[idx]; let notes=s.notes||'';
  if(Array.isArray(notes)) notes=notes.map((n,k)=>`<div style="opacity:${k===step?1:.4};margin-bottom:12px"><div class="stepnote">click ${k}</div>${n}</div>`).join('');
  document.getElementById('pnotes').innerHTML=`<div class="stepnote">${s.title||s.id} - step ${step}/${m}</div>`+notes;
  document.getElementById('ppos').textContent=`slide ${idx+1}/${deck.length}`;
  const L=document.getElementById('plist');
  L.innerHTML=deck.map((d,k)=>`<div data-k="${k}" class="${k===idx?'cur':''}">${String(k+1).padStart(2,'0')} ${d.caseMeta?'['+d.caseMeta.code+'] ':''}${d.title||d.id}</div>`).join('');
  L.querySelectorAll('div').forEach(d=>d.onclick=()=>show(+d.dataset.k,0));
  const c=L.querySelector('.cur'); if(c) c.scrollIntoView({block:'nearest'});
  scaleMinis();
}
function scaleMinis(){
  document.querySelectorAll('#presenter .mini').forEach(m=>{const p=m.parentElement; const sc=Math.min(p.clientWidth/1920,p.clientHeight/1080); m.style.transform=`scale(${sc})`;});
}

/* ---------- setup overlay ---------- */
function openSetup(){
  const S=document.getElementById('setup'); let order=caseOrder(); const all=Object.keys(DECK.cases);
  const rest=all.filter(c=>!order.includes(c));
  let items=[...order.map(c=>({id:c,on:true})),...rest.map(c=>({id:c,on:false}))];
  const draw=()=>{
    S.innerHTML=`<div class="box"><h2>Deck setup</h2><p>Pick which incident cases to present and their order. Saved in this browser. Press <kbd>S</kbd> again or click Apply.</p>
    ${items.map((it,k)=>{const c=DECK.cases[it.id];return `<div class="it"><input type="checkbox" data-k="${k}" ${it.on?'checked':''}><span class="nm"><b>${c.code}</b> - ${c.title} <span class="mins">· ${c.date}${c.backup?" · backup":""}</span></span><span class="mins">~${c.mins} min</span><button data-up="${k}">▲</button><button data-dn="${k}">▼</button></div>`}).join('')}
    <div style="display:flex;gap:10px;margin-top:14px"><button class="pri" id="sapply">Apply</button><button id="sall">All</button><button id="sreset">Reset</button><span style="flex:1"></span><button id="spres">Open presenter view</button></div>
    <div class="keys">Clicker / keys: <kbd>PgDn</kbd> <kbd>→</kbd> <kbd>Space</kbd> next · <kbd>PgUp</kbd> <kbd>←</kbd> back · <kbd>B</kbd>/<kbd>.</kbd> black screen · <kbd>F5</kbd>/<kbd>Esc</kbd>/<kbd>F</kbd> fullscreen · <kbd>Home</kbd>/<kbd>End</kbd> · <kbd>V</kbd> presenter view (notes + timer, synced) · <kbd>S</kbd> this panel</div></div>`;
    S.querySelectorAll('input').forEach(i=>i.onchange=()=>{items[+i.dataset.k].on=i.checked;});
    S.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const k=+b.dataset.up; if(k>0){[items[k-1],items[k]]=[items[k],items[k-1]];draw();}});
    S.querySelectorAll('[data-dn]').forEach(b=>b.onclick=()=>{const k=+b.dataset.dn; if(k<items.length-1){[items[k+1],items[k]]=[items[k],items[k+1]];draw();}});
    S.querySelector('#sapply').onclick=apply;
    S.querySelector('#sall').onclick=()=>{items.forEach(i=>i.on=true);draw();};
    S.querySelector('#sreset').onclick=()=>{localStorage.removeItem(LS_KEY);items=DECK.defaultOrder.map(c=>({id:c,on:true}));draw();};
    S.querySelector('#spres').onclick=openPresenter;
  };
  const apply=()=>{localStorage.setItem(LS_KEY,JSON.stringify(items.filter(i=>i.on).map(i=>i.id))); S.classList.remove('open'); build(); idx=-1; show(0,0); if(chan) chan.postMessage({t:'rebuild'});};
  draw(); S.classList.add('open');
}
function openPresenter(){ window.open(location.pathname+'?presenter=1'+location.hash,'bsides-presenter','width=1500,height=900'); }

/* ---------- input ---------- */
function onKey(e){
  if(document.getElementById('setup').classList.contains('open')){ if(e.key==='s'||e.key==='S') document.getElementById('setup').classList.remove('open'); return; }
  const k=e.key;
  if(['PageDown','ArrowRight','ArrowDown',' ','Enter','n','N'].includes(k)){e.preventDefault();next();}
  else if(['PageUp','ArrowLeft','ArrowUp','Backspace','p','P'].includes(k)){e.preventDefault();prev();}
  else if(['b','B','.','w','W'].includes(k)){document.body.classList.toggle('black'); if(chan) chan.postMessage({t:'black',v:document.body.classList.contains('black')});}
  else if(k==='F5'||k==='Escape'||k==='f'||k==='F'){ if(isPresenter) return; e.preventDefault(); if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}); else if(k!=='Escape') document.exitFullscreen(); }
  else if(k==='Home') show(0,0);
  else if(k==='End') show(deck.length-1,0);
  else if(k==='s'||k==='S') openSetup();
  else if(k==='v'||k==='V') openPresenter();
}

function init(){
  if(isPresenter) document.body.classList.add('presenter');
  build();
  const h=location.hash.slice(1).split('/'); let i=0, st=0;
  if(h[0]){const f=deck.findIndex(d=>d.id===h[0]); if(f>=0){i=f; st=+h[1]||0;}}
  idx=-1; fit(); show(i,st,false);
  addEventListener('resize',fit);
  addEventListener('keydown',onKey);
  document.getElementById('viewport').addEventListener('click',e=>{ if(e.button===0) next(); });
  document.getElementById('viewport').addEventListener('contextmenu',e=>{e.preventDefault();prev();});
  setInterval(tick,1000);
  let mt; addEventListener('mousemove',()=>{document.body.classList.remove('hide-cursor');clearTimeout(mt);mt=setTimeout(()=>document.body.classList.add('hide-cursor'),2000);});
  if(chan) chan.onmessage=(m)=>{const d=m.data;
    if(d.t==='nav'){ if(d.idx!==idx){idx=-1;} show(d.idx,d.step,false); }
    else if(d.t==='black') document.body.classList.toggle('black',d.v);
    else if(d.t==='rebuild'){ build(); idx=-1; show(0,0,false); }
    else if(d.t==='hello'&&!isPresenter) chan.postMessage({t:'nav',idx,step});
  };
  if(isPresenter&&chan) chan.postMessage({t:'hello'});
}
window.ENGINE={init,show,next,prev};
document.addEventListener('DOMContentLoaded',init);
})();
