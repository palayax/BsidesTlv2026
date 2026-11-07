/* =========================================================================
   CASE KIT v3 — every incident is 2 screens:
     SCREEN A  scenario  : click 0 = normal business workflow (with a real-looking example)
                           click 1 = attacker plants / failure starts
                           click 2 = compromise outcome + attack classification (type, TTPs, CVE, impact)
     SCREEN B  readiness : click 0 = what generic forensics answers today (best practice assumed)
                           click 1 = forensic-readiness artifacts (3rd-party + Claude / ChatGPT Enterprise)
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
const card=(o,body)=>`<div class="card ${o.cls||''}"><div class="ch">${o.ic?icon(o.ic,18,o.icc):''}<span>${o.title}</span><span class="sp"></span>${o.right||''}</div><div class="cb">${body}</div></div>`;
function mail(o){
  return card({ic:'microsoftoutlook',title:o.app||'Outlook · inbox',cls:o.cls,right:o.right},
    `<dl class="mh"><dt>From</dt><dd>${o.from} <span class="xtag ${o.ext?'ext':'int'}">${o.ext?'EXTERNAL':'INTERNAL'}</span></dd><dt>To</dt><dd>${o.to}</dd><dt>Subject</dt><dd><b>${o.subject}</b></dd></dl><div style="font-size:16px;color:var(--text2)">${o.body}</div>${o.inj?`<span class="inj"><b>${o.injLabel||'HIDDEN INSTRUCTIONS · paraphrased'}</b>${o.inj}</span>`:''}`);
}
function chat(o){
  return card({ic:o.ic,title:o.title,cls:o.cls,right:o.right},`<div class="chat">${o.msgs.map(m=>`<div class="bub ${m[0]}"><span class="who">${m[1]}</span>${m[2]}</div>`).join('')}</div>`);
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

const STATE=['<span class="statebadge n">● NORMAL WORKFLOW</span>','<span class="statebadge x">● ATTACK IN PROGRESS</span>','<span class="statebadge x">● COMPROMISED</span>'];

/* SCREEN A — scenario */
function scenario(C,o){
  const st=o.states||STATE;
  const nodes=o.dg.nodes.map(n=>Object.assign({big:true,w:180,h:150},n));
  return `<div class="kicker">Business workflow → compromise · ${C.org} · ${C.date}</div>
  ${stepSwap(o.h.map((h,i)=>`<h1 class="t" style="font-size:48px">${h}${st[Math.min(i,st.length-1)]}</h1>`))}
  ${diagram(Object.assign({x:64,y:200,w:1080,h:520},o.dg,{nodes}))}
  <div class="abs" style="left:1190px;width:666px;top:168px;display:flex;flex-direction:column;gap:14px">
    <div><div class="slotlbl">${icon('eye',16)} ${o.slotA}</div>${stepSwap(o.cardA)}</div>
    <div><div class="slotlbl">${icon('bot',16)} ${o.slotB}</div>${stepSwap(o.cardB)}</div>
  </div>
  ${stepSwap(o.bottom,'','position:absolute;left:64px;right:64px;top:752px')}`;
}

/* SCREEN B — forensic reach + readiness */
const V={y:'✔ YES',p:'◐ PARTIAL',n:'✖ NO'};
const ENT=`<span class="src3 ent">${icon('claude',13)}${icon('openai',13)} Claude · ChatGPT Ent.</span>`;
const SRC={tp:'<span class="src3 tp">3rd-party</span>',ent:ENT,ct:'<span class="src3 ct">contract</span>',none:''};
function readiness(C,o){
  return `<div class="kicker">Forensic reach → forensic readiness · ${C.code}</div>
  ${stepSwap(o.h.map(h=>`<h1 class="t" style="font-size:44px">${h}</h1>`))}
  <div class="abs kit-assume" style="left:64px;right:64px;top:150px">${icon('shield',18,'#34d399')} TODAY · BEST PRACTICE ON: ${o.assume.map(a=>chip(a,'green')).join('')}</div>
  <table class="rt abs" style="left:64px;width:1792px;top:198px">
    <tr><th>#</th><th style="width:430px">Business / investigation question</th><th style="width:500px">${icon('search',14)} Generic forensics today</th><th data-in="1" style="color:var(--green)">${icon('history',14)} + Forensic-readiness artifact (enable before the incident)</th></tr>
    ${o.rows.map((r,i)=>`<tr><td>Q${i+1}</td><td class="rq">${r.q}</td>
      <td><span class="vd ${r.now[0]}">${V[r.now[0]]}</span>${r.now[1]}</td>
      <td class="rd" data-in="1"><span class="vd ${r.ready[0]}">${V[r.ready[0]]}</span>${SRC[r.ready[1]]}${r.ready[2]}</td></tr>`).join('')}
  </table>
  ${stepSwap([`<div class="callout amber" style="font-size:19px">${o.note0}</div>`,`<div class="callout cyan" style="font-size:19px">${o.note1}</div>`],'','position:absolute;left:64px;right:64px;bottom:24px')}`;
}

function defineCase(id,C,s){
  C.slides=[
    {id:id+'-a',phase:'scenario',title:C.code+' · workflow → compromise',html:()=>scenario(C,s.scenario),notes:s.scenario.notes},
    {id:id+'-b',phase:'readiness',title:C.code+' · forensic reach → readiness',html:()=>readiness(C,s.readiness),notes:s.readiness.notes},
  ];
  DECK.cases[id]=C;
}
window.KIT={defineCase,stepSwap,mail,chat,kvcard,logcard,klass,card};
})();
