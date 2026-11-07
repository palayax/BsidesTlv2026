/* =========================================================================
   INTRO — 4 screens:
     1 concept + speaker
     2 statistics + classical DFIR vs agentic-AI DFIR (which questions each answers)
     3 generic AI forensic artifacts: what they can / cannot answer, and why
     4 the incidents (built by DECK.agenda from the selected cases)
   >>> EDIT SPEAKER DETAILS HERE <<<
   ========================================================================= */
window.SPEAKER={
  name:'Dor Amit',
  role:'Owner, PALAYA Ltd · Co-Founder, TenRoot Cyber Security',
  org:'PALAYA',
  photo:'assets/img/speaker.jpg',
  logo:'assets/img/palaya-logo.png',
  handle:'palaya.net · linkedin.com/in/dor-amit-7791397',
  bio:[
    '~20 years as a white-hat hacker &amp; security researcher',
    '3 registered patents',
    'Speaker: Microsoft BlueHat, BSides TLV',
    'Incident response, forensics &amp; AI-enabled security at PALAYA',
  ]
};

(function(){
const {icon,tile,stats,src}=UI;

/* 1 — concept + speaker */
DECK.intro.push({
  id:'title', title:'The Forensic Gaps in Agentic AI', section:'BSides TLV 2026 · AI Village',
  html:()=>`
  <div class="abs" style="left:64px;top:30px;width:1150px">
    <div class="kicker">BSides TLV 2026 <span class="tag">AI VILLAGE</span></div>
    <h1 class="t" style="font-size:100px;line-height:1">The <em>Forensic Gaps</em><br>in Agentic AI</h1>
    <div class="sub" style="font-size:30px;margin-top:26px;max-width:1120px">AI agents read untrusted content, decide inside a model, and act with <b style="color:#fff">your identity</b>. When one goes wrong — can you prove <b class="cyan">what</b> happened, and <b class="red">why</b>?</div>
  </div>
  <div class="abs concept" style="left:64px;top:500px;width:1150px">
    ${[['READS','chat','Emails, files, web forms, tickets, chats, repos — trusted and untrusted mixed together'],
       ['DECIDES','brain','Model inference — often at the AI vendor, non-deterministic, not replayable'],
       ['ACTS','bolt','CRM, mail, APIs, databases, shell — with a human\'s or an app\'s credentials'],
       ['EVIDENCE?','search','Split between AI vendor, SaaS apps and endpoints — or never recorded']]
      .map(([h,ic,d],i)=>`${i?'<div class="ca">›</div>':''}<div class="cc" style="${i===3?'border-color:rgba(255,77,94,.6)':i===1?'border-color:rgba(196,161,255,.6)':''}"><div class="h"><span style="color:${i===3?'var(--red)':i===1?'var(--ai)':'var(--cyan)'}">${icon(ic,30)}</span>${h}</div><div class="d">${d}</div></div>`).join('')}
  </div>
  <div class="abs" style="left:64px;top:770px;width:1150px;display:flex;align-items:center;gap:16px">
    <span class="mono muted" style="font-size:16px;letter-spacing:.1em">AGENTS IN THIS TALK</span>
    ${['microsoft','salesforce','drift','replit','modelcontextprotocol','claude','openai'].map(n=>tile(n,58)).join('')}
  </div>
  <div class="abs panel" style="left:1270px;top:30px;width:586px;padding:0;overflow:hidden">
    <div style="height:360px;background:#0d1828 url('${SPEAKER.photo}') center 20%/cover"></div>
    <div style="padding:22px 28px">
      <div style="font-size:40px;font-weight:800;color:#fff">${SPEAKER.name}</div>
      <div style="font-size:19px;color:var(--text2);margin-top:4px">${SPEAKER.role}</div>
      <ul class="list" style="font-size:19px;gap:8px;margin-top:16px">${SPEAKER.bio.map(b=>`<li>${b}</li>`).join('')}</ul>
      <div class="row" style="margin-top:18px;align-items:center;justify-content:space-between">
        <span class="mono cyan" style="font-size:15px">${SPEAKER.handle}</span>
      </div>
      <img src="${SPEAKER.logo}" alt="PALAYA" style="height:58px;margin-top:14px">
    </div>
  </div>`,
  notes:'Welcome. Agents now read our data, decide, and act with our identities — across mail, CRM, code and SaaS. 25 minutes, real incidents, one question: when an agent does something bad, can you prove what happened and why? 30 seconds on who I am.'
});

/* 2 — statistics + classical vs agentic DFIR */
DECK.intro.push({
  id:'questions', title:'Classical vs agentic forensics', section:'Why this matters',
  html:()=>{
    const T={y:'ANSWERED',p:'PARTIAL',n:'GAP'};
    const R=[
      ['WHAT happened?',['y','Process, file, network and audit logs'],['y','Same effect logs — buried among thousands of legitimate agent actions']],
      ['WHO did it?',['y','User account, session, source IP'],['p','Agent acts with a human\'s or app\'s token — same audit actor as the human']],
      ['HOW did it get in?',['y','Exploit, phishing click, malware binary'],['n','Plain-language instructions hidden in data — no binary, no signature']],
      ['WHY did it act?',['p','Inferred from attacker TTPs and tooling'],['n','Decided inside the model; its explanation is generated text, not a trace']],
      ['Can we reproduce it?',['y','Detonate the sample in a sandbox'],['n','Non-deterministic; context and model version change — no replay']],
      ['WHERE is the evidence?',['y','Endpoints and logs you own'],['p','Split across AI vendor, SaaS and endpoints — retention depends on plan']],
    ];
    const cell=(c,cls)=>`<td class="${cls}"><span class="tg ${c[0]}">${T[c[0]]}</span>${c[1]}</td>`;
    return `<div class="kicker">Why this matters</div>
    <h1 class="t" style="font-size:52px">A new actor in the enterprise — and <em>new investigation questions</em></h1>
    <div style="margin-top:24px">${stats([
      {v:'40%',l:'of enterprise apps will feature task-specific AI agents by end-2026, up from &lt;5% in 2025 — Gartner',c:'cyan'},
      {v:'15%',l:'of day-to-day work decisions made autonomously by agentic AI by 2028 — Gartner',c:'ai'},
      {v:'13%',l:'of organizations reported breaches of AI models or applications — IBM 2025',c:'amber'},
      {v:'97%',l:'of those breached organizations lacked proper AI access controls — IBM 2025',c:'red'},
    ])}</div>
    <table class="cmp" style="margin-top:18px">
      <tr><th style="width:250px">Question</th><th>${icon('search',16)} Classical DFIR</th><th style="color:var(--red2)">${icon('bot',16)} Agentic AI DFIR</th></tr>
      ${R.map(r=>`<tr><td>${r[0]}</td>${cell(r[1],'cl')}${cell(r[2],'ag')}</tr>`).join('')}
    </table>
    <div class="abs" style="left:64px;bottom:16px">${src([['Gartner','press releases 26 Aug 2025 &amp; 21 Oct 2024 (gartner.com/en/newsroom)'],['IBM','Cost of a Data Breach Report 2025, press release 30 Jul 2025 (newsroom.ibm.com)']])}</div>`;
  },
  notes:'Adoption is real — Gartner and IBM numbers. Classic DFIR answers WHAT, WHO and HOW well. With agents, WHAT still works, but WHO blurs, HOW has no binary, WHY lives inside a model, you cannot replay it, and the evidence sits with vendors.'
});

/* 3 — generic AI artifacts: can / cannot */
DECK.intro.push({
  id:'artifacts', title:'What AI artifacts can and cannot answer', section:'Generic AI forensic artifacts',
  html:()=>{
    // [question, verdict y/p/n, generic artifact type (icon,name), why / limitation]
    const R=[
      ['Who used which agent, when, from where?','y',['fingerprint','Identity &amp; admin audit logs'],'Reliable when every agent session is bound to SSO'],
      ['Which tools / connectors ran, with which arguments?','y',['term','Agent tool-call logs (hooks, OpenTelemetry)'],'Off by default; records the <b>request</b>, not the effect'],
      ['Which records, files or mailboxes were touched?','y',['cloud','SaaS &amp; cloud audit logs'],'Shows the effect — not which prompt caused it'],
      ['What did the user ask, and what did the agent reply?','y',['chat','Conversation records (compliance export)'],'Only within retention; not retroactive'],
      ['Which permissions and tokens did the agent hold?','y',['key','Connector &amp; OAuth grants'],'Granted scope ≠ what was actually used'],
      ['Human or agent?','p',['laptop','Endpoint &amp; network (process tree, user agent)'],'Same identity and token in every SaaS log'],
      ['What happened past the tool boundary?','p',['plug','Third-party provider logs'],'Agent logs the request; another vendor performs the effect'],
      ['Which input steered the action?','n',null,'Retrieved context is not logged as a whole — at best, references'],
      ['Why did the model choose it?','n',null,'No reasoning trace; "explanations" are generated afterwards'],
      ['Would it do it again?','n',null,'Non-deterministic; model and context change — no replay'],
    ];
    const V={y:'✔ YES',p:'◐ PARTIAL',n:'✖ NO'};
    return `<div class="kicker">Generic AI forensic artifacts · assuming they are all switched on</div>
    <h1 class="t" style="font-size:46px">Which questions the artifacts <em>can</em> answer — and which they <span class="red">can't</span></h1>
    <table class="rt at abs" style="left:64px;width:1792px;top:132px">
      <tr><th>#</th><th style="width:500px">Investigation question</th><th style="width:150px">Answerable?</th><th style="width:540px">Generic artifact type that answers it</th><th>Why / limitation</th></tr>
      ${R.map((r,i)=>`<tr><td>${i+1}</td><td class="rq">${r[0]}</td><td><span class="vd ${r[1]}">${V[r[1]]}</span></td>
        <td style="${r[2]?'':'color:var(--faint)'}">${r[2]?`<span style="display:inline-flex;align-items:center;gap:10px;color:#fff">${tile(r[2][0],34)}${r[2][1]}</span>`:'— no generic artifact records it'}</td>
        <td>${r[3]}</td></tr>`).join('')}
    </table>
    <div class="callout abs" style="left:64px;right:64px;bottom:26px;font-size:20px">Artifacts answer the <b>what</b>. The root cause — an <b>instruction hidden in data</b> and <b>why</b> the model followed it — is the link nothing preserves.</div>`;
  },
  notes:'Even with every artifact on, you get the what: who, which tool, which records, what was said. You do not get the why: which input steered it, why the model chose it, whether it repeats, human versus agent, and what happened beyond the tool boundary. Keep this table in mind — we will apply it to each case.'
});

/* 4 — incidents (selected cases) */
DECK.agenda=(order)=>({
  id:'agenda', title:'The incidents', section:'Real incidents · public sources',
  html:()=>{
    const many=order.length>4, cols=many?3:2;
    return `<div class="kicker">Real incidents · public sources only</div>
    <h1 class="t" style="font-size:52px">Today's <em>investigations</em></h1>
    <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:18px;margin-top:26px">
    ${order.map((id,i)=>{const c=DECK.cases[id];return `<div class="panel" style="padding:${many?'16px 20px':'20px 24px'};display:flex;flex-direction:column;gap:8px">
      <div class="row" style="align-items:center;gap:12px">${c.logos.slice(0,3).map(l=>tile(l,many?48:58)).join('')}
        <div style="margin-left:6px"><div class="mono" style="font-size:15px;color:var(--red2)">CASE ${String(i+1).padStart(2,'0')} · ${c.date}</div><div class="mono muted" style="font-size:14px">${c.org}</div></div></div>
      <div style="font-size:${many?24:28}px;font-weight:800;color:#fff;line-height:1.15">${c.title}</div>
      <div><span class="chip ai" style="font-size:14px">${c.agentType}</span></div>
      <div style="font-size:${many?16:18}px;color:var(--text2);line-height:1.35">${c.tagline}</div>
      <div class="refs" style="margin-top:auto">${c.refs.map(r=>`<div><span>↗ ${r[0]}</span>${r[1]}</div>`).join('')}</div></div>`}).join('')}
    </div>
    <div class="abs mono" style="left:64px;bottom:18px;display:flex;gap:12px;align-items:center;font-size:17px;color:var(--muted)">Each incident · 2 screens: <span class="chip cyan">Normal workflow</span>›<span class="chip red">Compromise</span>(click) &nbsp;then&nbsp; <span class="chip amber">Forensic reach</span>›<span class="chip green">Forensic readiness</span>(click)</div>`;
  },
  notes:'The incidents. Each is real and publicly documented — the references are on screen and in the repo. Different agent types: enterprise assistant, CRM agent, AI chat-agent integration, coding agent.'
});
})();
