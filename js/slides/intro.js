/* =========================================================================
   INTRO - 4 screens:
     1 concept + speaker
     2 statistics + the three questions where agentic-AI DFIR has a gap
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

/* 1 - concept + speaker */
DECK.intro.push({
  id:'title', title:'The Forensic Gaps in Agentic AI', section:'BSides TLV 2026 · AI Village',
  html:()=>`
  <div class="abs" style="left:64px;top:30px;width:1150px">
    <div class="kicker">BSides TLV 2026 <span class="tag">AI VILLAGE</span></div>
    <h1 class="t" style="font-size:100px;line-height:1">The <em>Forensic Gaps</em><br>in Agentic AI</h1>
    <div class="sub" style="font-size:30px;margin-top:26px;max-width:1120px">AI agents read untrusted content, decide inside a model, and act with <b style="color:#fff">your identity</b>. When one goes wrong, can you prove <b class="cyan">what</b> happened, and <b class="red">why</b>?</div>
  </div>
  <div class="abs concept" style="left:64px;top:500px;width:1150px">
    ${[['READS','chat','Mail, files, web forms, tickets, repos: trusted and untrusted mixed'],
       ['DECIDES','brain','Inside the model, often at the vendor, not replayable'],
       ['ACTS','bolt','CRM, mail, APIs, DBs, shell, with a human\'s or app\'s credentials'],
       ['EVIDENCE?','search','Split across AI vendor, SaaS and endpoints, or never recorded']]
      .map(([h,ic,d],i)=>`${i?'<div class="ca">›</div>':''}<div class="cc" style="${i===3?'border-color:rgba(255,77,94,.6)':i===1?'border-color:rgba(196,161,255,.6)':''}"><div class="h"><span style="color:${i===3?'var(--red)':i===1?'var(--ai)':'var(--cyan)'}">${icon(ic,30)}</span>${h}</div><div class="d">${d}</div></div>`).join('')}
  </div>
  <div class="abs" style="left:64px;top:770px;width:1150px;display:flex;align-items:center;gap:16px">
    <span class="mono muted" style="font-size:18px;letter-spacing:.1em">AGENTS IN THIS TALK</span>
    ${['microsoft','salesforce','perplexity','replit','modelcontextprotocol','claude','openai'].map(n=>tile(n,58)).join('')}
  </div>
  <div class="abs panel" style="left:1270px;top:30px;width:586px;padding:0;overflow:hidden">
    <div style="height:360px;background:#0d1828 url('${SPEAKER.photo}') center 20%/cover"></div>
    <div style="padding:22px 28px">
      <div style="font-size:40px;font-weight:800;color:#fff">${SPEAKER.name}</div>
      <div style="font-size:20px;color:var(--text2);margin-top:4px">${SPEAKER.role}</div>
      <ul class="list" style="font-size:20px;gap:8px;margin-top:16px">${SPEAKER.bio.map(b=>`<li>${b}</li>`).join('')}</ul>
      <div class="row" style="margin-top:18px;align-items:center;justify-content:space-between">
        <span class="mono cyan" style="font-size:18px">${SPEAKER.handle}</span>
      </div>
      <img src="${SPEAKER.logo}" alt="PALAYA" style="height:58px;margin-top:14px">
    </div>
  </div>`,
  notes:'Welcome. Agents now read our data, decide, and act with our identities across mail, CRM, code and SaaS. 25 minutes, real incidents, one question: when an agent does something bad, can you prove what happened and why? 30 seconds on who I am.'
});


/* 2 - statistics + where agentic forensics has a gap (C6: only the three gap rows) */
DECK.intro.push({
  id:'questions', title:'Classical vs agentic forensics', section:'Why this matters',
  html:()=>{
    const T={y:'ANSWERED',p:'PARTIAL',n:'GAP'};
    const R=[
      ['HOW did it get in?',['y','Exploit, phishing click, malware binary'],['n','Plain-language instructions hidden in data: no binary, no signature']],
      ['WHY did it act?',['p','Inferred from attacker TTPs and tooling'],['n','Decided inside the model; its "explanation" is generated text']],
      ['Can we reproduce it?',['y','Detonate the sample in a sandbox'],['n','Non-deterministic; context and model change, no replay']],
    ];
    const cell=(c,cls)=>`<td class="${cls}"><span class="tg ${c[0]}">${T[c[0]]}</span>${c[1]}</td>`;
    return `<div class="kicker">Why this matters</div>
    <h1 class="t" style="font-size:52px">A new actor in the enterprise, <em>new investigation gaps</em></h1>
    <div class="bigstats" style="margin-top:28px">${stats([
      {v:'40%',l:'of enterprise apps will have task-specific AI agents by end-2026, up from &lt;5% in 2025 (Gartner)',c:'cyan'},
      {v:'15%',l:'of day-to-day work decisions made autonomously by agentic AI by 2028 (Gartner)',c:'ai'},
      {v:'13%',l:'of organizations reported breaches of AI models or apps (IBM 2025)',c:'amber'},
      {v:'97%',l:'of those breached lacked proper AI access controls (IBM 2025)',c:'red'},
    ])}</div>
    <table class="cmp" style="margin-top:26px">
      <colgroup><col style="width:330px"><col style="width:620px"><col></colgroup>
      <tr><th>Question</th><th>${icon('search',20)} Classical DFIR</th><th style="color:var(--red2)">${icon('bot',20)} Agentic AI DFIR</th></tr>
      ${R.map(r=>`<tr><td>${r[0]}</td>${cell(r[1],'cl')}${cell(r[2],'ag')}</tr>`).join('')}
    </table>
    <div class="abs" style="left:64px;bottom:16px">${src([['Gartner','press releases 26 Aug 2025 &amp; 21 Oct 2024 (gartner.com/en/newsroom)'],['IBM','Cost of a Data Breach Report 2025, press release 30 Jul 2025 (newsroom.ibm.com)']])}</div>`;
  },
  notes:'Adoption is real: Gartner and IBM numbers. Classic DFIR still answers what happened and who did it. Three questions break with agents: how it got in has no binary, why it acted lives inside a model, and you cannot replay it.'
});

/* 3 - generic AI artifacts: can / cannot */
DECK.intro.push({
  id:'artifacts', title:'What AI artifacts can and cannot answer', section:'Generic AI forensic artifacts',
  html:()=>{
    // [question, verdict y/p/n, generic artifact type (icon,name), why / limitation]
    const R=[
      ['Who used which agent, when, from where?','y',['fingerprint','Identity &amp; admin audit logs'],'Reliable if every session is bound to SSO'],
      ['Which tools ran, with which arguments?','y',['term','Tool-call logs (hooks, OpenTelemetry)'],'Off by default; the <b>request</b>, not the effect'],
      ['Which records or files were touched?','y',['cloud','SaaS &amp; cloud audit logs'],'The effect, not which prompt caused it'],
      ['What did the user ask, what did it reply?','y',['chat','Conversation records (compliance export)'],'Only within retention; not retroactive'],
      ['Which permissions and tokens did it hold?','y',['key','Connector &amp; OAuth grants'],'Granted scope ≠ scope actually used'],
      ['Human or agent?','p',['laptop','Endpoint &amp; network telemetry'],'Same identity and token in every SaaS log'],
      ['What happened past the tool boundary?','p',['plug','Third-party provider logs'],'Agent logs the request; another vendor the effect'],
      ['Which input steered the action?','n',null,'Retrieved context is not logged whole'],
      ['Why did the model choose it?','n',null,'No reasoning trace; "explanations" are generated'],
      ['Would it do it again?','n',null,'Non-deterministic, no replay'],
    ];
    const V={y:'✔ YES',p:'◐ PARTIAL',n:'✖ NO'};
    return `<div class="kicker">Generic AI forensic artifacts · assuming they are all switched on</div>
    <h1 class="t" style="font-size:46px">Which questions the artifacts <em>can</em> answer, and which they <span class="red">can't</span></h1>
    <table class="rt at abs" style="left:64px;width:1792px;top:128px">
      <colgroup><col style="width:56px"><col style="width:520px"><col style="width:170px"><col style="width:540px"><col></colgroup>
      <tr><th>#</th><th>Investigation question</th><th>Answerable?</th><th>Generic artifact type</th><th>Why / limitation</th></tr>
      ${R.map((r,i)=>`<tr><td>${i+1}</td><td class="rq">${r[0]}</td><td><span class="vd ${r[1]}">${V[r[1]]}</span></td>
        <td style="${r[2]?'':'color:var(--faint)'}">${r[2]?`<span style="display:inline-flex;align-items:center;gap:12px;color:#fff">${tile(r[2][0],36)}${r[2][1]}</span>`:'No generic artifact records it'}</td>
        <td>${r[3]}</td></tr>`).join('')}
    </table>
    <div class="callout abs" style="left:64px;right:64px;bottom:22px;font-size:24px">Artifacts answer the <b>what</b>. Nothing preserves the root cause: an <b>instruction hidden in data</b>, and <b>why</b> the model followed it.</div>`;
  },
  notes:'Even with every artifact on, you get the what: who, which tool, which records, what was said. You do not get the why: which input steered it, why the model chose it, whether it repeats, human versus agent, and what happened beyond the tool boundary. We come back to these questions on the scorecard at the end.'
});

/* 4 - incidents (selected cases) */
DECK.agenda=(order)=>({
  id:'agenda', title:'The incidents', section:'Real incidents · public sources',
  html:()=>{
    const many=order.length>4, cols=many?3:2;
    return `<div class="kicker">Real incidents · public sources only</div>
    <h1 class="t" style="font-size:50px">Today's <em>investigations</em> and the gap each one proves</h1>
    <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:18px;margin-top:22px">
    ${order.map((id,i)=>{const c=DECK.cases[id];return `<div class="panel" style="padding:${many?'14px 18px':'18px 24px'};display:flex;flex-direction:column;gap:10px">
      <div class="row" style="align-items:center;gap:12px">${c.logos.slice(0,3).map(l=>tile(l,many?46:54)).join('')}
        <div style="margin-left:6px;min-width:0"><div class="mono" style="font-size:18px;color:var(--red2)">CASE ${String(i+1).padStart(2,'0')} · ${c.date}</div><div class="mono muted" style="font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.org}</div></div></div>
      <div style="font-size:${many?27:30}px;font-weight:800;color:#fff;line-height:1.15">${c.title}</div>
      <div class="agap"><b>FORENSIC GAP</b>${c.gap}</div>
      ${many?`<div style="font-size:22px;color:var(--ai);line-height:1.3">${c.agentType}</div>`:`<div style="font-size:22px;color:var(--text2);line-height:1.3">${c.tagline}</div>`}
      <div class="refs" style="margin-top:auto"><div><span>↗ ${c.refs[0][0]}</span>${c.refs[0][1]}</div></div></div>`}).join('')}
    </div>
    <div class="abs mono" style="left:64px;bottom:16px;display:flex;gap:12px;align-items:center;font-size:18px;color:var(--muted)">Each incident · 2 screens: <span class="chip cyan" style="font-size:18px">Normal</span>›<span class="chip red" style="font-size:18px">Attack</span>›<span class="chip red" style="font-size:18px">Before / after</span> &nbsp;then&nbsp; <span class="chip amber" style="font-size:18px">Forensic reach</span>›<span class="chip green" style="font-size:18px">Readiness</span></div>`;
  },
  notes:'The incidents. Each is real and publicly documented, with references on screen and in the repo. Each one proves a different forensic gap, shown on every card and on each case screen.'
});
})();
