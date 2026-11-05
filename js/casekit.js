/* =========================================================================
   CASE KIT — every incident is exactly 4 screens, one click each:
     1 business  : workflow diagram + who/what is involved + the agent's role
     2 attack    : attack path with TTPs + business impact analysis (BIA)
     3 forensics : what generic forensics CAN / CANNOT answer (best-practice config assumed)
     4 mitigate  : 3rd-party controls · Claude Enterprise · ChatGPT Enterprise
   ========================================================================= */
(function(){
const {icon,tile,diagram,chip,mitig}=UI;

const head=(k,h)=>`<div class="kicker">${k}</div><h1 class="t" style="font-size:52px">${h}</h1>`;
const tagChip=t=>chip(t,/^AML/.test(t)?'ai':/^(LLM|ASI)/.test(t)?'amber':/^T\d/.test(t)?'red':'');
const grp=(t,ic,items)=>`<div class="kit-grp"><div class="kit-h">${icon(ic,18)} ${t}</div><div class="kit-chips">${items.map(i=>`<span class="chip">${i}</span>`).join('')}</div></div>`;
const WHO={attacker:'ATTACKER',ai:'AI AGENT',victim:'VICTIM / USER'};
const LV={high:'HIGH',med:'MEDIUM',low:'LOW',none:'NONE'};

function business(C,o){
  return head(`Business workflow · ${C.org} · ${C.date}`,o.headline)+
  diagram(Object.assign({x:64,y:175,w:1190,h:600},o.dg))+
  `<div class="abs kit-who" style="left:1300px;top:160px;width:556px">
     ${grp('People','users',o.people)}
     ${grp('Systems &amp; services','server',o.systems)}
     ${grp('Data','db',o.data)}
     <div class="kit-ai">${icon('bot',34,'#c4a1ff')}<div><div class="kit-h ai">The agent's role</div>${o.agentRole}</div></div>
   </div>
   <div class="callout cyan abs" style="left:64px;right:64px;bottom:12px;font-size:23px">${o.bottom}</div>`;
}

function attack(C,o){
  const n=o.steps.length;
  return head(`Attack path · TTPs · business impact`,o.headline)+
  `<div class="abs kit-steps" style="left:64px;right:64px;top:170px;height:400px;grid-template-columns:repeat(${n},1fr)">
    ${o.steps.map((s,i)=>`<div class="kit-step ${s.who}">
      <div class="kit-sn">${icon(s.who==='attacker'?'hacker':s.who==='ai'?'bot':'user',18)} STEP ${i+1} · ${s.label||WHO[s.who]}</div>
      <div class="kit-st">${s.t}</div><div class="kit-sd">${s.d}</div>
      <div class="kit-tags">${(s.tags||[]).map(tagChip).join('')}</div></div>`).join('')}
  </div>
  <div class="abs" style="left:64px;right:64px;top:600px">
    <div class="kit-h" style="font-size:17px">${icon('scale',20,'#ffb020')} <span style="color:var(--amber)">Business impact analysis</span></div>
    <div class="kit-bia" style="grid-template-columns:repeat(${o.bia.length},1fr)">
      ${o.bia.map(b=>`<div class="kit-imp ${b.lv}"><div class="k"><span>${b.k}</span><span class="lv">${LV[b.lv]}</span></div><div class="d">${b.d}</div></div>`).join('')}
    </div>
    <div class="kit-status" style="margin-top:14px">${icon('clock',18,'#22d3ee')} <b style="color:var(--cyan)">Timeline &amp; status:</b> ${o.status}</div>
  </div>
  <div class="mono muted abs" style="right:64px;bottom:16px;font-size:13px">Tags: ${chip('T####','red')} MITRE ATT&amp;CK · ${chip('AML.T####','ai')} MITRE ATLAS · ${chip('LLM##','amber')} OWASP LLM Top 10 (2025)</div>`;
}

function forensics(C,o){
  const col=(cls,title,ic,items,mk)=>`<div class="kit-col ${cls}"><div class="kit-h ${cls==='can'?'green':'red'}">${icon(ic,20)} ${title}</div>
    ${items.map(x=>`<div class="kit-qi"><div class="mk">${mk}</div><div><div class="qq">${x.q}</div><div class="qa">${x.a}</div></div></div>`).join('')}</div>`;
  return head(`Generic forensic process · this use case`,o.headline)+
  `<div class="abs kit-assume" style="left:64px;right:64px;top:168px">${icon('shield',18,'#34d399')} ASSUME BEST PRACTICE &amp; BUILT-IN GUARDRAILS ON: ${o.assume.map(a=>chip(a,'green')).join('')}</div>
   <div class="abs kit-cols" style="left:64px;right:64px;top:236px;display:grid;grid-template-columns:1fr 1fr;gap:22px">
     ${col('can','Can answer — and from which artifact','check',o.can,'✔')}
     ${col('cant','Cannot answer — and why','eyeoff',o.cant,'?')}
   </div>`;
}

function mitigate(C,o){
  const cols=[
    Object.assign({t:'3rd-party controls',st:'vendor-agnostic',ic:'shield'},o.third),
    Object.assign({t:'Claude Enterprise',st:'Anthropic',ic:'claude',cls:'glow-ai'},o.claude),
    Object.assign({t:'ChatGPT Enterprise',st:'OpenAI',ic:'openai'},o.openai),
  ].map(c=>Object.assign(c,{in:0}));
  return head(`Mitigation · optional controls`,o.headline)+
  `<div class="abs kit-mit" style="left:64px;right:64px;top:170px">${mitig(cols)}</div>
   <div class="abs kit-foot" style="left:64px;right:64px;bottom:44px">
     <div class="callout cyan" style="font-size:20px"><b>Vendor fix:</b> ${o.fix}</div>
     <div class="callout amber" style="font-size:20px"><b>Principle:</b> ${o.principle}</div>
   </div>
   <div class="mono muted abs" style="left:64px;bottom:16px;font-size:13px">Feature availability varies by plan and changes often — verify against current Anthropic / OpenAI admin docs.</div>`;
}

/* register a 4-screen case */
function defineCase(id,C,s){
  C.slides=[
    {id:id+'-1',phase:'business',title:C.code+' · business workflow',html:()=>business(C,s.business),notes:s.business.notes},
    {id:id+'-2',phase:'attack',title:C.code+' · attack path & impact',html:()=>attack(C,s.attack),notes:s.attack.notes},
    {id:id+'-3',phase:'forensics',title:C.code+' · forensic reach',html:()=>forensics(C,s.forensics),notes:s.forensics.notes},
    {id:id+'-4',phase:'mitigate',title:C.code+' · mitigation',html:()=>mitigate(C,s.mitigate),notes:s.mitigate.notes},
  ];
  DECK.cases[id]=C;
}
window.KIT={defineCase,business,attack,forensics,mitigate};
})();
