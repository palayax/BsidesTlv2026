/* =========================================================================
   Building blocks used by slide definitions. Everything returns HTML strings.
   Reveal attributes (handled by engine):
     in:  element appears at step >= n
     on:  element highlighted at step n ("3", "3-5", "2,4")
     out: element removed at step >= n
     dim: element dimmed at step >= n
   ========================================================================= */
(function(){
const BRAND_COLORS={anthropic:'#d97757',claude:'#d97757',openai:'#ffffff',github:'#ffffff',githubactions:'#2088ff',npm:'#cb3837',nx:'#ffffff',
  googlegemini:'#8e75b2',replit:'#f26207',nodedotjs:'#5fa04e',cursor:'#ffffff',linux:'#fcc624',apple:'#ffffff',gitlab:'#fc6d26',modelcontextprotocol:'#ffffff',
  splunk:'#65a637',datadog:'#a66ee8',opentelemetry:'#f5a800',okta:'#ffffff',postgresql:'#4169e1',git:'#f05032',ubuntu:'#e95420',docker:'#2496ed',
  bitcoin:'#f7931a',ethereum:'#a7b4ff',gmail:'#ea4335',jira:'#0052cc',cline:'#ffffff',githubcopilot:'#ffffff',google:'#4285f4',macos:'#ffffff',neon:'#00e599',
  supabase:'#3fcf8e',elastic:'#00bfb3',paloaltonetworks:'#fa582d',cloudflare:'#f38020',discord:'#5865f2',python:'#3776ab',javascript:'#f7df1e',typescript:'#3178c6',
  telegram:'#26a5e4',vscodium:'#2f80ed',kalilinux:'#557c94',zapier:'#ff4f00',vercel:'#ffffff',visualstudiocode:'#3ca2f2',amazonaws:'#ff9900',amazon:'#ff9900',
  slack:'#e01e5a',microsoft:'#ffffff',salesforce:'#00a1e0',windows:'#0078d6',amazons3:'#569a31'};

// Generic glyphs (stroke icons, 24x24)
const G={
  file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  term:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3M15 8l2 2"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="7" r="3"/><path d="M17 13c3 0 5 2.2 5 5"/>',
  hacker:'<path d="M12 2c-4 0-7 3-7 7v3l-2 3h4l1 6h8l1-6h4l-2-3V9c0-4-3-7-7-7z"/><path d="M9 11h.01M15 11h.01" stroke-width="3"/>',
  server:'<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01" stroke-width="3"/>',
  cloud:'<path d="M7 18a5 5 0 0 1-.5-9.97A6 6 0 0 1 18 8a4.5 4.5 0 0 1 0 9z"/>',
  db:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  shieldx:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.5-.5 4.9-1.3M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  brain:'<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 4 3V3zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-4 3V3z"/>',
  bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01" /><circle cx="12" cy="3" r="1"/><path d="M9 17h6"/>',
  pkg:'<path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
  branch:'<circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 7.5v9M18 10.5c0 4-6 3-11.5 6.5"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  q:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
  check:'<path d="m5 12 5 5L20 7"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  net:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  log:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h.01"/><path d="M6 6V4h11v2"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  ticket:'<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/>',
  issue:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  pr:'<circle cx="6" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M6 7.5v9M18 16.5V9a3 3 0 0 0-3-3h-4M13 3l-2 3 2 3"/>',
  cache:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M3 15h18"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  laptop:'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  download:'<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
  plug:'<path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
  fingerprint:'<path d="M12 11v3a8 8 0 0 1-1 4M8 11a4 4 0 0 1 8 0v1M5 9a7 7 0 0 1 14 0v3M16 15a12 12 0 0 1-.6 4M8.5 16a6 6 0 0 1-.5-3"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  dollar:'<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  ban:'<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  link:'<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  spark:'<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/>',
  filter:'<path d="M3 4h18l-7 9v6l-4 2v-8z"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  scale:'<path d="M12 3v18M5 21h14M6 7h12M3 14l3-7 3 7a3 3 0 0 1-6 0zM15 14l3-7 3 7a3 3 0 0 1-6 0z"/>'
};

const A=(o)=>{ // reveal attribute string
  if(!o) return '';
  let s='';
  if(o.in!=null) s+=` data-in="${o.in}"`;
  if(o.on!=null) s+=` data-on="${o.on}"`;
  if(o.out!=null) s+=` data-out="${o.out}"`;
  if(o.dim!=null) s+=` data-dim="${o.dim}"`;
  return s;
};

function icon(name,size=28,color){
  if(window.ICONS && ICONS[name]){
    const c=color||BRAND_COLORS[name]||'#fff';
    return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${c}"><path d="${ICONS[name]}"/></svg>`;
  }
  if(name==='postmark') return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="5" fill="#ffde00"/><path d="M7 18V6h5.2a3.8 3.8 0 0 1 0 7.6H10V18z" fill="#000"/></svg>`;
  const LT={drift:['D','#2563eb'],salesloft:['S','#0f766e'],copilot:['C','#6d28d9']};
  if(LT[name]) return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="6" fill="${LT[name][1]}"/><text x="12" y="17" font-family="Inter,Segoe UI,sans-serif" font-weight="800" font-size="14" text-anchor="middle" fill="#fff">${LT[name][0]}</text></svg>`;
  if(name==='bsides') return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="5" fill="#ff4d5e"/><text x="12" y="17" font-family="Inter" font-weight="800" font-size="13" text-anchor="middle" fill="#fff">B</text></svg>`;
  if(name==='crowdstrike'||name==='edr') return glyph('shield',size,color||'#ff4d5e');
  const g=G[name]||G.q;
  return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color||'currentColor'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${g}</svg>`;
}
function glyph(name,size,color){return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color||'currentColor'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${G[name]||G.q}</svg>`}
function tile(name,size=56,color){return `<span class="logo-tile" style="width:${size}px;height:${size}px">${icon(name,Math.round(size*.58),color)}</span>`}
function icons(list,size){return list.map(n=>icon(n,size)).join(' ')}

/* ---------- diagram ---------- */
// opts: {x,y,w,h, zones:[{x,y,w,h,label,kind,icon}], nodes:[{id,x,y,w,h,icon,title,sub,kind,in,on,...}], edges:[{from,to,kind,label,in,on,fs,ts,bend,lx,ly,dash}], pins:[{x,y,n,in,blind}], steps:[{x,y,n,in}]}
function diagram(o){
  const W=o.w, H=o.h, N={};
  (o.nodes||[]).forEach(n=>{n.w=n.w||250;n.h=n.h||86;N[n.id]=n;});
  const side=(n,s)=>{const cx=n.x+n.w/2, cy=n.y+n.h/2;
    return s==='l'?[n.x,cy,-1,0]:s==='r'?[n.x+n.w,cy,1,0]:s==='t'?[cx,n.y,0,-1]:[cx,n.y+n.h,0,1];};
  const auto=(a,b)=>{const dx=(b.x+b.w/2)-(a.x+a.w/2), dy=(b.y+b.h/2)-(a.y+a.h/2);
    if(Math.abs(dx)*0.6>Math.abs(dy)) return dx>0?['r','l']:['l','r']; return dy>0?['b','t']:['t','b'];};
  let svg=`<svg class="edges" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>`;
  for(const [k,c] of Object.entries({flow:'#3d6390',attack:'#ff4d5e',exfil:'#ffb020',ai:'#c4a1ff',ok:'#34d399',plain:'#26405f'}))
    svg+=`<marker id="ar-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="${c}"/></marker>`;
  svg+='</defs>';
  let labels='';
  (o.edges||[]).forEach(e=>{
    const a=N[e.from], b=N[e.to]; if(!a||!b) return;
    const [sa,sb]=auto(a,b); const p=side(a,e.fs||sa), q=side(b,e.ts||sb);
    const k=e.kind||'flow'; const d=Math.max(60,Math.hypot(q[0]-p[0],q[1]-p[1])*.4)*(e.bend||1);
    const path=e.straight?`M${p[0]},${p[1]} L${q[0]},${q[1]}`:`M${p[0]},${p[1]} C${p[0]+p[2]*d},${p[1]+p[3]*d} ${q[0]+q[2]*d},${q[1]+q[3]*d} ${q[0]},${q[1]}`;
    svg+=`<g${A(e)}><path class="edge ${k} ${e.dash?'dash':''}" d="${path}" marker-end="url(#ar-${k})"/>${e.static?'':`<path class="edge-anim ${k}" d="${path}"/>`}</g>`;
    if(e.label){const lx=e.lx!=null?e.lx:(p[0]+q[0])/2, ly=e.ly!=null?e.ly:(p[1]+q[1])/2;
      labels+=`<div class="elabel ${k}" style="left:${lx}px;top:${ly}px"${A(e)}>${e.label}</div>`;}
  });
  svg+='</svg>';
  let html=`<div class="dg" style="left:${o.x||0}px;top:${o.y||0}px;width:${W}px;height:${H}px">`;
  (o.zones||[]).forEach(z=>{html+=`<div class="zone ${z.kind||''}" style="left:${z.x}px;top:${z.y}px;width:${z.w}px;height:${z.h}px"${A(z)}><div class="zl">${z.icon?icon(z.icon,18):''}${z.label||''}</div></div>`;});
  html+=svg;
  (o.nodes||[]).forEach(n=>{
    html+=`<div class="node ${n.kind||''} ${n.compact?'compact':''}" style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px"${A(n)}>
      ${n.icon?tile(n.icon,n.iconSize||52,n.iconColor):''}<div style="min-width:0"><div class="nt">${n.title||''}</div>${n.sub?`<div class="ns">${n.sub}</div>`:''}</div>${n.badge?`<span class="badge">${n.badge}</span>`:''}</div>`;
  });
  html+=labels;
  (o.steps||[]).forEach(s=>{html+=`<div class="stepno" style="left:${s.x}px;top:${s.y}px"${A(s)}>${s.n}</div>`;});
  (o.pins||[]).forEach(p=>{html+=`<div class="pin ${p.blind?'blind':''}" style="left:${p.x}px;top:${p.y}px"${A(p)}>${p.n}</div>`;});
  html+='</div>';
  return html;
}

/* ---------- evidence ---------- */
function evidence(list,o={}){
  return `<div class="locker" style="${o.style||''}"><div class="lh">${icon('search',20,'#ffb020')} ${o.title||'Evidence locker'}</div>`+
   list.map(e=>`<div class="ev ${e.status||''}"${A(e)}><div class="en">${e.n}</div><div style="min-width:0"><div class="et">${e.title}</div>${e.value?`<div class="evv">${e.value}</div>`:''}${e.source?`<div class="es">${e.source}</div>`:''}</div></div>`).join('')+'</div>';
}

/* ---------- terminal ---------- */
function terminal(o){
  return `<div class="term" style="${o.style||''}"><div class="tb"><i></i><i></i><i></i><span>${o.title||'bash'}</span></div><div class="tc">`+
   o.lines.map(l=>{const t=typeof l==='string'?{t:l}:l; return `<div class="l ${t.c||''} ${t.type?'type':''}"${A(t)}>${t.t}</div>`;}).join('')+`</div></div>`;
}

/* ---------- questions ---------- */
const VERD={yes:'ANSWERED',partial:'PARTIAL',no:'UNKNOWN'};
function questions(list){
  return `<div class="qs">`+list.map(q=>`<div class="q"${A(q)}><div class="v ${q.v}">${q.label||VERD[q.v]}</div><div><div class="qq">${q.q}</div>${q.a?`<div class="qa">${q.a}</div>`:''}</div></div>`).join('')+`</div>`;
}

/* ---------- kill chain ---------- */
function chain(list){
  return `<div class="chain">`+list.map((l,i)=>`<div class="lk"${A(l)}><div class="ln">${String(i+1).padStart(2,'0')} · ${l.phase||''}</div><div class="lt">${l.t}</div><div class="ld">${l.d||''}</div><div class="ltags">${(l.tags||[]).map(t=>`<span class="chip ${/^AML/.test(t)?'ai':/^LLM/.test(t)?'amber':'red'}">${t}</span>`).join('')}</div></div>`).join('')+`</div>`;
}

/* ---------- stats ---------- */
function stats(list){return `<div class="stats">`+list.map(s=>`<div class="stat"${A(s)}><div class="sv ${s.c||''}">${s.v}</div><div class="sl">${s.l}</div></div>`).join('')+`</div>`;}

function chip(t,c){return `<span class="chip ${c||''}">${t}</span>`}
function stamp(t,c){return `<span class="stamp ${c||'red'}">${t}</span>`}
function src(list){return `<div class="src">${list.map(s=>`<div>↗ <b>${s[0]}</b> — ${s[1]}</div>`).join('')}</div>`}

/* ---------- case cover ---------- */
// c: case meta; o: {summary, stats:[], meta:[[k,v]], sources:[[name,desc]]}
function cover(c,o){
  return `<div class="ticket">
    <div style="display:flex;flex-direction:column">
      <div class="kicker">${icon('ticket',22,'#22d3ee')} Case file · ${c.date} <span class="tag">${c.code}</span></div>
      <div class="row" style="align-items:center;gap:18px;margin:6px 0 10px">${c.logos.map(l=>tile(l,70)).join('')}</div>
      <h1 class="t" style="font-size:64px">${o.title||c.title}</h1>
      <div class="sub" style="font-size:27px">${o.summary}</div>
      <div style="margin-top:auto">${stats(o.stats.map((s,i)=>Object.assign({in:1},s)))}</div>
    </div>
    <div class="panel" style="display:flex;flex-direction:column;gap:18px">
      <h3>Incident ticket</h3>
      <dl class="meta">${o.meta.map(m=>`<dt>${m[0]}</dt><dd>${m[1]}</dd>`).join('')}</dl>
      <div class="hr"></div>
      <h3 style="margin:0">Public sources</h3>
      ${src(o.sources)}
    </div></div>`;
}

/* ---------- mitigation board ---------- */
// cols: [{t, ic, cls, items:[str|{t,in}] , in}]
function mitig(cols,o={}){
  return `<div style="display:grid;grid-template-columns:repeat(${cols.length},1fr);gap:20px;${o.style||''}">`+
   cols.map((c,ci)=>`<div class="panel ${c.cls||''}" data-in="${c.in!=null?c.in:ci+1}" style="padding:20px 22px">
     <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">${c.ic?tile(c.ic,48):''}<div style="font-size:23px;font-weight:800;color:#fff;line-height:1.15">${c.t}${c.st?`<div class="mono muted" style="font-size:14px;font-weight:400;margin-top:3px">${c.st}</div>`:''}</div></div>
     <ul class="list" style="font-size:19px;gap:11px">${c.items.map(it=>{const t=typeof it==='string'?{t:it}:it;return `<li${A(t)}><span>${t.t}</span></li>`}).join('')}</ul></div>`).join('')+`</div>`;
}

/* ---------- visibility matrix ---------- */
// rows:[{q, cells:['y'|'p'|'n'|'na', ...], notes?}], cols:[label]
function matrix(cols,rows,o={}){
  const L={y:'✔ YES',p:'◐ PARTIAL',n:'✖ NO',na:'—'};
  return `<table class="mx" style="${o.style||''}"><tr><th></th>${cols.map(c=>`<th>${c}</th>`).join('')}</tr>`+
   rows.map(r=>`<tr${A(r)}><td class="rh">${r.q}</td>${r.cells.map((c,i)=>{const [v,txt]=Array.isArray(c)?c:[c,null];return `<td class="c ${v}">${txt||L[v]}</td>`}).join('')}</tr>`).join('')+`</table>`;
}

/* ---------- swimlane (evidence by location over time) ---------- */
// lanes:[{label,ic,color}], cols:[{t, cells:[str|null], in}]
function swim(lanes,cols,o={}){
  const cw=o.colW||'1fr';
  let h=`<div style="display:grid;grid-template-columns:230px repeat(${cols.length},${cw});gap:8px;${o.style||''}">`;
  h+=`<div></div>`+cols.map((c,i)=>`<div data-in="${c.in!=null?c.in:i+1}"${c.on?` data-on="${c.on}"`:''} class="swh" style="font-size:17px;font-weight:700;color:#fff;padding:8px 10px;border-radius:8px;background:#13223a;border:1px solid var(--line2);line-height:1.2"><span class="mono" style="color:var(--red);font-size:14px">${String(i+1).padStart(2,'0')}</span><br>${c.t}</div>`).join('');
  lanes.forEach((l,li)=>{
    h+=`<div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;background:#0b1523;border:1px solid var(--line);border-left:4px solid ${l.color||'var(--cyan)'};font-weight:700;color:#fff;font-size:19px;line-height:1.15">${icon(l.ic,30,l.color)}<span>${l.label}${l.sub?`<div class="mono muted" style="font-size:13px;font-weight:400">${l.sub}</div>`:''}</span></div>`;
    cols.forEach((c,i)=>{const v=c.cells[li]; const stin=c.in!=null?c.in:i+1;
      h+=`<div data-in="${stin}" style="border-radius:10px;padding:8px 10px;font-size:15px;line-height:1.3;${v?`background:${l.bg||'#0e1a2c'};border:1px solid ${l.color||'var(--line2)'};color:var(--text)`:'border:1px dashed var(--line);color:var(--faint);display:flex;align-items:center;justify-content:center'}">${v||'—'}</div>`;});
  });
  return h+'</div>';
}

window.UI={icon,glyph,tile,icons,diagram,evidence,terminal,questions,chain,stats,chip,stamp,src,A,cover,mitig,matrix,swim};
})();
