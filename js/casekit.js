/* =========================================================================
   CASE KIT v4 - every incident is 2 screens:
     SCREEN A  scenario  : click 1 = normal business workflow (with a realistic example)
                           click 2 = attacker plants / failure starts
                           click 3 = compromise: BEFORE vs AFTER side by side, off-path elements dimmed
     SCREEN B  readiness : click 1 = what generic forensics answers today (best practice assumed)
                           click 2 = readiness: (a) on the incident's own platform or a 3rd-party control,
                                     (b) the equivalent on Claude Enterprise / ChatGPT Enterprise
   Each case also carries:
     gap   : the forensic gap it proves (agenda card, both screens)
     score : verdicts for the scorecard screen, {who,act,effect,input,why}: [today, ready] with y|p|n|na
   ========================================================================= */
(function(){
const {icon,tile,diagram,chip}=UI;

/* build a crossfade stack from per-step contents: [s0,s1,s2] (null = same as previous) */
function stepSwap(arr,cls='',style=''){
  const v=[]; arr.forEach((x,i)=>v.push(x==null?v[i-1]:x));
  const segs=[]; v.forEach((x,i)=>{ if(i&&x===v[i-1]) segs[segs.length-1].e=i; else segs.push({x,s:i,e:i}); });
  const last=v.length-1;
  return `<div class="swap ${cls}" style="${style}">`+segs.map(g=>`<div${g.s>0?` data-in="${g.s}"`:''}${g.e<last?` data-out="${g.e+1}"`:''}>${g.x||''}</div>`).join('')+`</div>`;
}

/* ---------- example artifacts (cards) ---------- */
const card=(o,body)=>`<div class="card ${o.cls||''}"><div class="ch">${o.ic?icon(o.ic,20,o.icc):''}<span>${o.title}</span><span class="sp"></span>${o.right||''}</div><div class="cb">${body}</div></div>`;
function mail(o){
  return card({ic:'microsoftoutlook',title:o.app||'Outlook · inbox',cls:o.cls,right:o.right},
    `<dl class="mh"><dt>From</dt><dd>${o.from} <span class="xtag ${o.ext?'ext':'int'}">${o.ext?'EXTERNAL':'INTERNAL'}</span></dd>${o.to?`<dt>To</dt><dd>${o.to}</dd>`:''}<dt>Subj.</dt><dd><b>${o.subject}</b></dd></dl><div class="mb">${o.body}</div>${o.inj?`<span class="inj"><b>${o.injLabel||'HIDDEN INSTRUCTIONS · paraphrased'}</b>${o.inj}</span>`:''}`);
}
function chat(o){
  return card({ic:o.ic,title:o.title,cls:o.cls,right:o.right},`<div class="chat">${o.msgs.map(m=>`<div class="bub ${m[0]}">${m[1]?`<span class="who">${m[1]}</span>`:''}${m[2]}</div>`).join('')}</div>`);
}
function kvcard(o){
  return card({ic:o.ic,title:o.title,cls:o.cls,right:o.right},`<dl class="kv">${o.rows.map(r=>`<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('')}</dl>${o.extra||''}`);
}
function logcard(o){
  return card({ic:o.ic||'log',title:o.title,cls:o.cls,right:o.right},`<div class="logl">${o.lines.join('\n')}</div>${o.extra||''}`);
}

/* ---------- classification strip ---------- */
function klass(groups,bad){
  return `<div class="klass ${bad?'bad':''}">${groups.map(g=>`<div class="g"><i>${g[0]}</i>${g[1].map(t=>chip(t,g[2]||(/^AML/.test(t)?'ai':/^(LLM|ASI)/.test(t)?'amber':/^T\d/.test(t)?'red':''))).join('')}</div>`).join('')}</div>`;
}

/* ---------- colour legend (U7) ---------- */
const LEGEND=`<div class="legend"><span><i class="sw ai"></i>AI agent</span><span><i class="sw secret"></i>Sensitive data / credentials</span><span><i class="sw attacker"></i>Attacker</span><span><i class="sw flow"></i>Normal flow</span><span><b class="enum">1</b>normal step</span><span><b class="enum hot">5</b>attack step</span></div>`;

const gapTag=C=>`<span class="gaptag">${icon('search',20)}Forensic gap: ${C.gap}</span>`;
const STATE=['<span class="statebadge n">● NORMAL WORKFLOW</span>','<span class="statebadge x">● ATTACK IN PROGRESS</span>','<span class="statebadge x">● COMPROMISED</span>'];

/* SCREEN A - scenario */
const LAST=2;
function scenario(C,o){
  const st=o.states||STATE;
  const path=new Set(o.dg.path||[]);
  // nodes off the attack path and normal edges that are not marked hot dim at the last click (U2)
  const nodes=o.dg.nodes.map(n=>Object.assign({big:true,w:180,h:150,iconSize:62},n,path.has(n.id)||n.out!=null?{}:{dim:LAST}));
  const edges=o.dg.edges.map(e=>Object.assign({},e,(e.kind==='attack'||e.kind==='exfil'||e.hot||e.out!=null)?{}:{dim:LAST}));
  const slot=(ic,lbl,c)=>`<div class="slot"><div class="slotlbl">${icon(ic,20)} ${lbl}</div>${c}</div>`;
  const col=[0,1].map(i=>slot('eye',o.slotA,o.cardA[i]||o.cardA[0])+slot('bot',o.slotB,o.cardB[i]||o.cardB[0]));
  col.push(`<div class="slotlbl">${icon('eye',20)} ${o.slotA}</div><div class="inline-in">${o.input}</div>
    <div class="ba before"><span class="balbl">BEFORE</span>${o.before}</div>
    <div class="ba after"><span class="balbl">AFTER</span>${o.after}</div>`);
  return `<div class="kicker">${C.org} · ${C.date}${gapTag(C)}</div>
  ${stepSwap(o.h.map((h,i)=>`<h1 class="t scn-h">${h}${st[Math.min(i,st.length-1)]}</h1>`))}
  ${diagram(Object.assign({x:64,y:140,w:1060,h:590,calmAt:1},o.dg,{nodes,edges}))}
  <div class="abs" style="left:64px;top:742px">${LEGEND}</div>
  ${stepSwap(col,'scn-col','position:absolute;left:1164px;width:692px;top:140px')}
  ${stepSwap(o.bottom,'','position:absolute;left:64px;right:64px;top:800px')}`;
}

/* SCREEN B - forensic reach + readiness (C3: platform / 3rd-party column + Claude · ChatGPT Enterprise column) */
const V={y:'✔ YES',p:'◐ PARTIAL',n:'✖ NO',na:'N/A'};
const vd=c=>`<span class="vd ${c[0]}">${V[c[0]]}</span>${c[1]}`;
/* readiness cell: verdict + artifacts, each tagged ENTERPRISE (licensed capability) or EXTERNAL (non-generic external control) */
const TAG={ent:'ENTERPRISE',ext:'EXTERNAL CONTROL'};
const rdcell=r=>`<div class="rdw"><span class="vd ${r[0]}">${V[r[0]]}</span><div>`+r[1].map(a=>`<div class="art"><span class="atag ${a[0]}">${TAG[a[0]]}</span><span>${a[1]}</span></div>`).join('')+`</div></div>`;
const ENT_NOTE=`<span class="atag ent">ENTERPRISE</span> a capability of an enterprise licence: <b>Claude Enterprise</b> · <b>ChatGPT Enterprise</b> (Compliance API, OpenTelemetry, managed hooks) or the platform's own enterprise tier. &nbsp; <span class="atag ext">EXTERNAL CONTROL</span> a non-generic control you add: SWG, DSPM, DB proxy, canaries, AI inventory.`;
function readiness(C,o){
  return `<div class="kicker">Forensic reach → readiness · ${C.code}${gapTag(C)}</div>
  ${stepSwap(o.h.map(h=>`<h1 class="t rdy-h">${h}</h1>`))}
  <div class="abs kit-assume" style="left:64px;right:64px;top:142px">${icon('shield',22,'#34d399')} TODAY, BEST PRACTICE ON: ${o.assume.map(a=>chip(a,'green')).join('')}</div>
  <table class="rt abs" style="left:64px;width:1792px;top:210px">
    <colgroup><col style="width:56px"><col style="width:380px"><col style="width:500px"><col></colgroup>
    <tr><th>#</th><th>Investigation question</th><th>${icon('search',20)} Generic forensics today</th><th data-in="1" class="thp">${icon('history',20)} Readiness · the artifact that answers it</th></tr>
    ${o.rows.map((r,i)=>`<tr><td>Q${i+1}</td><td class="rq">${r.q}</td><td>${vd(r.now)}</td><td class="rd" data-in="1">${rdcell(r.rd)}</td></tr>`).join('')}
  </table>
  ${stepSwap([`<div class="callout amber">${o.note0}</div>`,`<div class="callout cyan">${o.note1}</div>`],'','position:absolute;left:64px;right:64px;top:780px')}
  <div class="abs entnote" data-in="1" style="left:64px;right:64px;top:882px">${ENT_NOTE}</div>`;
}

function defineCase(id,C,s){
  C.score=s.score;
  C.slides=[
    {id:id+'-a',phase:'scenario',cls:'scn',title:C.code+' · workflow → compromise',html:()=>scenario(C,s.scenario),notes:s.scenario.notes},
    {id:id+'-b',phase:'readiness',title:C.code+' · forensic reach → readiness',html:()=>readiness(C,s.readiness),notes:s.readiness.notes},
  ];
  DECK.cases[id]=C;
}
window.KIT={defineCase,stepSwap,mail,chat,kvcard,logcard,klass,card};
})();
