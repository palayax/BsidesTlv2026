/* =========================================================================
   INTRO - 5 screens:
     1 concept + speaker
     2 AI breach statistics
     3 classical DFIR: the investigation questions, artifact types, real artifact examples
     4 the same questions for agentic AI: generic AI artifacts and the gap, explained
     5 the incidents (built by DECK.agenda from the selected cases)
   >>> EDIT SPEAKER DETAILS HERE <<<
   ========================================================================= */
window.SPEAKER={
  name:'Dor Amit',
  role:'Owner, PALAYA Ltd · Co-Founder, TenRoot Cyber Security',
  org:'PALAYA',
  photo:'assets/img/speaker.jpg',
  logo:'assets/img/palaya-logo.png?v=2',
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


/* 2 - AI breach statistics only.
   IBM Cost of a Data Breach Report 2026 (Ponemon, 602 orgs, breaches Mar 2025 - Feb 2026), press release 29 Jul 2026;
   figures marked * are from the report as summarised by Baker Donelson (Aug 2026). Gartner prediction, Oct 2024. */
DECK.intro.push({
  id:'stats', title:'AI breaches by the numbers', section:'Why this matters',
  html:()=>{
    const big=[
      ['&gt;20%','of organizations reported a breach of <b>AI models or applications</b>','up from 13% a year earlier','amber'],
      ['92%','of organizations with an AI-related incident <b>lacked proper AI access controls</b>','IBM 2026*','red'],
      ['1 in 4','malicious breaches were <b>AI-enabled</b>','+56% year over year','ai'],
    ];
    const small=[
      ['$6.0M','average cost of an AI-enabled breach, vs <b>$4.99M</b> global average','IBM 2026','cyan'],
      ['27%','of breaches of AI systems came through <b>compromised APIs, apps or plug-ins</b>','IBM 2026','red'],
      ['247 days','mean time to <b>identify and contain</b> a breach, the first rise in five years','IBM 2026*','amber'],
      ['25%','of enterprise breaches will be traced to <b>AI agent abuse</b> by 2028','Gartner prediction','ai'],
    ];
    const tileH=(s,sz)=>`<div class="bstat"><div class="bv ${s[3]}" style="font-size:${sz}px">${s[0]}</div><div class="bl">${s[1]}</div><div class="bs">${s[2]}</div></div>`;
    return `<div class="kicker">Why this matters · AI breaches</div>
    <h1 class="t" style="font-size:54px">AI is already <em>in the breach reports</em></h1>
    <div class="bgrid3">${big.map(s=>tileH(s,104)).join('')}</div>
    <div class="bgrid4">${small.map(s=>tileH(s,66)).join('')}</div>
    <div class="abs" style="left:64px;bottom:16px">${src([['IBM','Cost of a Data Breach Report 2026 (Ponemon, 602 organizations), press release 29 Jul 2026 · * figures via Baker Donelson summary'],['Gartner','Top predictions for IT organizations and users, Oct 2024']])}</div>`;
  },
  notes:'IBM\'s 2026 Cost of a Data Breach report: more than one in five organizations had a breach of AI models or applications, up from 13 percent. 92 percent of those had no proper AI access controls. One in four malicious breaches used AI. Breaches into AI systems came through APIs, apps and plug-ins: the same connectors agents use. And it takes 247 days to identify and contain a breach, so evidence has to survive that long. Gartner expects a quarter of enterprise breaches to trace back to AI agent abuse by 2028.'
});

/* the investigation questions shared by screens 3 and 4 */
const DFQ=[
  ['WHEN','When did it happen?'],
  ['WHO','Who did it?'],
  ['HOW','How did it get in?'],
  ['WHAT','What did it do?'],
  ['IMPACT','What was touched, what left?'],
  ['WHY','Why did it act?'],
  ['REPLAY','Can we reproduce it?'],
];
const qcell=i=>`<td class="dq"><span class="qtag">${DFQ[i][0]}</span>${DFQ[i][1]}</td>`;

/* 3 - classical DFIR: questions, artifact types and real artifact examples (Windows endpoint intrusion) */
DECK.intro.push({
  id:'dfir', title:'Classical digital forensics', section:'Digital forensics 101',
  html:()=>{
    const R=[
      [['clock','File system timeline'],'<span class="k">$MFT</span> invoice.pdf.exe  <span class="k">$SI Created</span> <span class="v">2025-09-02 09:12:44Z</span>  <span class="k">$FN</span> <span class="v">09:12:44Z</span>'],
      [['fingerprint','Windows Security log'],'<span class="k">EventID</span> 4624  <span class="k">LogonType</span> 10  <span class="k">TargetUserName</span> dana  <span class="k">IpAddress</span> 203.0.113.7'],
      [['mail','Mark of the Web · mail &amp; proxy logs'],'invoice.pdf.exe<span class="k">:Zone.Identifier</span>  <span class="k">ZoneId</span>=3  <span class="k">HostUrl</span>=https://files.example/inv'],
      [['term','Execution artifacts (Prefetch, Amcache, Sysmon)'],'<span class="k">Sysmon 1</span>  <span class="k">Image</span> …\\Downloads\\invoice.pdf.exe  <span class="k">ParentImage</span> OUTLOOK.EXE'],
      [['net','Network &amp; usage (SRUM, firewall, NetFlow)'],'<span class="k">SRUM</span> invoice.pdf.exe  <span class="k">BytesSent</span> 48,210,331  → 198.51.100.24:443'],
      [['target','Malware reverse engineering + ATT&amp;CK TTPs'],'<span class="k">config</span> C2=198.51.100.24  <span class="k">filter</span> *.docx;*.xlsx  → <span class="v">data theft</span>'],
      [['pkg','Sample + memory image, sandbox detonation'],'<span class="k">sha256</span> 9f2c…e41  <span class="k">sandbox</span>: same C2 beacon, same file filter'],
    ];
    return `<div class="kicker">Digital forensics 101 · a classic endpoint intrusion</div>
    <h1 class="t" style="font-size:50px">Classical DFIR: <em>every question has an artifact</em></h1>
    <table class="rt dft abs" style="left:64px;width:1792px;top:130px">
      <colgroup><col style="width:470px"><col style="width:140px"><col style="width:520px"><col></colgroup>
      <tr><th>Investigation question</th><th>Answered?</th><th>Artifact type</th><th>Real artifact example</th></tr>
      ${R.map((r,i)=>`<tr>${qcell(i)}<td><span class="vd y">✔ YES</span></td><td><span class="art2">${tile(r[0][0],36)}${r[0][1]}</span></td><td class="ex2">${r[1]}</td></tr>`).join('')}
    </table>
    <div class="callout abs" style="left:64px;right:64px;bottom:22px;font-size:24px">The evidence is <b>deterministic</b>: the binary carries the intent, and the sample can be run again. Every question ends in an artifact you can show in court.</div>`;
  },
  notes:'A quick refresher on digital forensics, using a classic endpoint intrusion. When: the MFT timeline. Who: logon event 4624. How it got in: the Mark of the Web on the downloaded file, plus mail and proxy logs. What it did: Prefetch, Amcache, Sysmon process creation. What left: SRUM and network logs. Why: reverse the sample and map its TTPs; the config shows it was after documents. Reproduce: detonate the sample. Seven questions, seven artifacts. Keep these questions in mind.'
});

/* 4 - the same questions for agentic AI: generic AI artifacts and the gap, explained */
DECK.intro.push({
  id:'artifacts', title:'The same questions for agentic AI', section:'Agentic AI forensics',
  html:()=>{
    // [verdict, artifact type (icon,name) | null, what it shows, the gap: why]
    const R=[
      ['p',['history','Conversation records, tool-call telemetry, SaaS audit'],'Timestamps, if logging was on','Nothing is retroactive: records exist only if logging was <b>switched on before</b> the incident, and local transcripts are deleted after 30 days by default.'],
      ['p',['fingerprint','Identity &amp; SaaS audit logs'],'The account that acted','The agent uses the <b>user\'s or the app\'s identity</b>. The human, the agent and a thief holding its token all look like the same account.'],
      ['n',null,'The email, page or ticket, but not as the cause','The "exploit" is <b>plain text inside normal data</b>: no binary, no signature. What the model read is not logged in full, so nothing links that input to the action.'],
      ['p',['term','Tool-call logs (hooks, OpenTelemetry)'],'The request the agent made','Logs record the <b>request</b>, not what the tool or the next service did with it. Off by default.'],
      ['p',['cloud','SaaS, cloud, proxy and provider logs'],'Records changed, data sent','The effect is logged by <b>another system</b> (SaaS, browser, email provider) with no ID that joins it back to the agent session.'],
      ['n',null,'The agent\'s own explanation','The decision happens <b>inside the model</b> and no vendor exposes the decision path. Ask the agent and you get newly generated text: testimony, not evidence.'],
      ['n',null,'Nothing to run again','<b>No sample to detonate.</b> Models are non-deterministic, context is assembled at run time and the model version changes. Same prompt, different result.'],
    ];
    const V={y:'✔ YES',p:'◐ PARTIAL',n:'✖ NO'};
    return `<div class="kicker">Agentic AI forensics · generic artifacts, all switched on</div>
    <h1 class="t" style="font-size:50px">Same questions, agentic AI: <span class="red">where the evidence breaks</span></h1>
    <table class="rt dft aig abs" style="left:64px;width:1792px;top:134px">
      <colgroup><col style="width:450px"><col style="width:150px"><col style="width:440px"><col></colgroup>
      <tr><th>Investigation question</th><th>Answered?</th><th>Generic AI artifact</th><th style="color:var(--red2)">The gap: why it falls short</th></tr>
      ${R.map((r,i)=>`<tr>${qcell(i)}<td><span class="vd ${r[0]}">${V[r[0]]}</span></td>
        <td>${r[1]?`<span class="art2">${tile(r[1][0],36)}${r[1][1]}</span>`:'<span class="art2 none">No generic artifact</span>'}<div class="shows">${r[2]}</div></td>
        <td class="gap">${r[3]}</td></tr>`).join('')}
    </table>
    <div class="callout abs" style="left:64px;right:64px;bottom:22px;font-size:24px">AI artifacts answer <b>when</b> and part of <b>who</b> and <b>what</b>. <b class="red">How it got in, why it acted and replay</b> have no artifact at all.</div>`;
  },
  notes:'Now the same seven questions for an AI agent, assuming every generic artifact is switched on. When: yes, but only if logging was on before the incident. Who: the agent acts as the user or the app, so every log shows the same account. How it got in: the exploit is plain text in normal data, with no signature and no full record of what the model read. What it did: you see the request, not the effect. Impact: another system logs it, with no join key. Why: inside the model; asking the agent gives you testimony, not evidence. Replay: there is no sample to detonate. The incidents that follow each show one of these gaps.'
});

/* 5 - incidents (selected cases) */
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
