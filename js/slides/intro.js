/* =========================================================================
   INTRO — title, speaker, hook, the "evidence chain" model, agenda
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
const {icon,tile,diagram,terminal,chip,stamp,stats,src}=UI;

DECK.intro.push({
  id:'title', title:'Title', section:'BSides TLV 2026 · AI Village',
  html:()=>`
  <div class="abs" style="left:64px;top:110px;width:1080px">
    <div class="kicker">BSides TLV 2026 <span class="tag">AI VILLAGE</span></div>
    <h1 class="t" style="font-size:96px;line-height:1">The <em>Forensic Gaps</em><br>in AI Coding Agents</h1>
    <div class="sub" style="font-size:32px;margin-top:28px">What your logs <span class="red">can't</span> tell you when the agent did it.</div>
    <div class="row" style="margin-top:54px;align-items:center;gap:22px">
      ${['claude','openai','githubactions','npm','visualstudiocode','modelcontextprotocol'].map(n=>tile(n,72)).join('')}
    </div>
    <div style="margin-top:56px;font-size:28px;color:#fff;font-weight:700">${SPEAKER.name}<span class="muted" style="font-weight:400"> · ${SPEAKER.role} · ${SPEAKER.org}</span></div>
  </div>
  <div class="abs" style="right:64px;top:96px;width:640px">
    <div class="panel" style="padding:0;overflow:hidden">
      <div style="padding:14px 18px;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:15px;color:var(--muted);display:flex;gap:10px;align-items:center">${icon('search',18,'#22d3ee')} SIEM · hunt query</div>
      <div class="code" style="border:none;border-radius:0;font-size:16px"><span class="k">process.parent.name</span>:<span class="s">"node"</span> <span class="n">AND</span>
<span class="k">process.command_line</span>:(
  <span class="s">"*--dangerously-skip-permissions*"</span> <span class="n">OR</span>
  <span class="s">"*--yolo*"</span> <span class="n">OR</span> <span class="s">"*--trust-all-tools*"</span>)</div>
      <div style="padding:10px 18px;font-family:var(--mono);font-size:15px;color:var(--text2);border-top:1px solid var(--line)">
        <div style="display:grid;grid-template-columns:150px 90px 1fr;gap:6px 10px">
          <span class="muted">TIME (UTC)</span><span class="muted">HOST</span><span class="muted">COMMAND</span>
          <span>22:32:41</span><span>dev-mbp-14</span><span class="red">claude --dangerously-skip-…</span>
          <span>22:32:41</span><span>dev-mbp-14</span><span class="red">gemini --yolo -p …</span>
          <span>22:32:42</span><span>ci-runner-7</span><span class="red">q chat --trust-all-tools …</span>
          <span class="blink" style="grid-column:1/4;color:var(--amber)">▌ prompt content: <b>not logged</b> · model output: <b>not logged</b></span>
        </div>
      </div>
    </div>
  </div>`,
  notes:'Welcome. 25 minutes, real incidents, one question: when an AI agent does something bad on your network — can you prove what happened, and why?'
});

DECK.intro.push({
  id:'speaker', title:'About me', section:'whoami',
  html:()=>`
  <div class="kicker">$ whoami</div>
  <div class="row" style="margin-top:30px;gap:64px;align-items:center">
    <div style="width:420px;height:420px;border-radius:24px;border:2px solid var(--line2);background:#0d1828 url('${SPEAKER.photo}') center 20%/cover;display:flex;align-items:flex-end;justify-content:center;box-shadow:0 0 60px rgba(34,211,238,.12)"></div>
    <div class="grow">
      <h1 class="t" style="font-size:76px">${SPEAKER.name}</h1>
      <div class="sub" style="font-size:32px">${SPEAKER.role} · <span class="cyan">${SPEAKER.org}</span></div>
      <ul class="list" style="margin-top:36px;font-size:30px">${SPEAKER.bio.map(b=>`<li>${b}</li>`).join('')}</ul>
      ${SPEAKER.handle?`<div class="mono cyan" style="margin-top:30px;font-size:24px">${SPEAKER.handle}</div>`:''}
    </div>
  </div>`,
  notes:'Short intro — 30 seconds max.'
});

DECK.intro.push({
  id:'hook', title:'The new insider', section:'Why this matters',
  html:()=>`
  <div class="kicker">Why this matters</div>
  <h1 class="t">Your developers hired a <em>new insider</em>.<br>It has their keys, their shell — and <span class="red">no audit trail</span>.</h1>
  <div style="margin-top:46px">${stats([
    {v:'84%',l:'of developers use or plan to use AI tools in their workflow (Stack Overflow Dev Survey 2025)',c:'cyan',in:1},
    {v:'51%',l:'of professional developers use AI tools daily (Stack Overflow Dev Survey 2025)',c:'ai',in:1},
    {v:'Shell',l:'Coding agents run commands, edit files, call APIs and MCP tools — with the developer\'s identity',c:'amber',in:2},
    {v:'?',l:'When it goes wrong: which input made it act? what did it see? what did it decide?',c:'red',in:3},
  ])}</div>
  <div class="row" style="margin-top:44px;gap:24px">
    <div class="callout grow" data-in="4">Classic DFIR answers <b class="cyan">WHAT</b> happened.<br>Agent DFIR must also answer <b class="red">WHO instructed it</b> and <b class="red">WHY it acted</b>.</div>
  </div>
  <div class="abs" style="left:64px;bottom:20px">${src([['Stack Overflow','2025 Developer Survey — AI section (survey.stackoverflow.co/2025/ai)']])}</div>`,
  notes:['Agents are now everywhere in engineering.','Adoption numbers.','They act with the developer\'s identity and permissions.','And when it goes wrong, the questions change.','That is the thesis of this talk.']
});

DECK.intro.push({
  id:'chain', title:'The agent evidence chain', section:'Mental model',
  html:()=>{
    const L=[
      {h:'01 · INPUT',t:'Instruction',d:'User prompt, GitHub issue, README, web page, MCP tool response, AGENTS.md / CLAUDE.md',q:'"Who / what told it to do this?"',ic:'chat'},
      {h:'02 · CONTEXT',t:'What it saw',d:'Files read, fetched URLs, tool outputs, memory — the full context window at decision time',q:'"Was it poisoned? By what?"',ic:'layers'},
      {h:'03 · DECISION',t:'Model reasoning',d:'Inference happens at the vendor. Non-deterministic. Not replayable.',q:'"Why did it choose that?"',ic:'brain'},
      {h:'04 · ACTION',t:'Tool call',d:'Bash command, file edit, MCP call, git push — as the agent requested it, with approval state',q:'"Did a human approve it?"',ic:'term'},
      {h:'05 · EFFECT',t:'OS / cloud event',d:'Process, file, network, CloudTrail, GitHub audit — what classic tooling sees',q:'"What changed?"',ic:'server'},
    ];
    return `<div class="kicker">Mental model</div>
    <h1 class="t">The <em>agent evidence chain</em> — five links</h1>
    <div class="echain" style="margin-top:44px;height:420px">
      ${L.map((l,i)=>`<div class="elink ${i===4?'':''}" data-in="1"${i===4?' data-on="2"':''}>
        <div class="eh">${l.h}</div><div style="color:${i===2?'var(--ai)':'var(--cyan)'}">${icon(l.ic,44)}</div>
        <div class="et">${l.t}</div><div class="ed">${l.d}</div><div class="eq">${l.q}</div>
        <div class="stamp-slot" style="position:absolute;top:16px;right:16px">
          <span data-in="3">${i===4?stamp('LOGGED','green'):i===3?stamp('LOCAL / FRAGILE','amber'):stamp('BLIND','red')}</span>
        </div></div>`).join('')}
    </div>
    <div class="row" style="margin-top:34px;gap:24px">
      <div class="callout cyan grow" data-in="2">EDR, CloudTrail and GitHub audit logs see link <b>05</b> — the <b>effect</b>.</div>
      <div class="callout grow" data-in="4">Root-cause lives in links <b>01–03</b> — mostly <b>outside</b> your telemetry.</div>
    </div>`;
  },
  notes:['Here is the model we will use for every case.','Five links: input, context, decision, action, effect.','Classic security tooling sees the last link.','Overlay: what is typically logged today. Action link exists only in local transcripts — user-deletable, short retention.','The causal links — who instructed, what it saw, why it decided — are the forensic gap.']
});

DECK.agenda=(order)=>({
  id:'agenda', title:'Case files', section:'Case files',
  html:()=>`
  <div class="kicker">Case files · real incidents · public sources</div>
  <h1 class="t">Today's <em>investigations</em></h1>
  <div style="display:grid;grid-template-columns:repeat(${order.length>4?3:2},1fr);gap:22px;margin-top:40px">
    ${order.map((id,i)=>{const c=DECK.cases[id];return `<div class="panel" data-in="1" style="display:flex;gap:20px;align-items:center;padding:22px">
      <div style="display:flex;gap:8px">${c.logos.slice(0,2).map(l=>tile(l,64)).join('')}</div>
      <div><div class="mono muted" style="font-size:16px">CASE ${String(i+1).padStart(2,'0')} · ${c.date}</div>
      <div style="font-size:28px;font-weight:800;color:#fff;margin-top:4px">${c.title}</div>
      <div style="font-size:18px;color:var(--text2);margin-top:6px">${c.tagline}</div></div></div>`}).join('')}
  </div>
  <div class="row" style="margin-top:34px;gap:14px;font-family:var(--mono);font-size:18px;color:var(--muted)" data-in="2">
    Each case: <span class="chip cyan">Business</span>›<span class="chip ai">AI Infra</span>›<span class="chip red">Attack path</span>›<span class="chip red">Exploitation</span>›<span class="chip amber">Forensics</span>›<span class="chip green">Mitigation</span>
  </div>`,
  notes:'The cases. Every one is real and publicly documented — references on each slide.'
});
})();
