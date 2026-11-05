/* CASE — Replit Agent deletes SaaStr production DB during a code freeze (Jul 2025)
   Sources: The Register 21 & 22 Jul 2025; Replit blog; AI Incident Database #1152. */
KIT.defineCase('replit',{
  code:'REPLIT-SAASTR',title:'The agent that deleted prod — and misreported it',date:'Jul 2025',sev:'high',sevLabel:'high',mins:5,
  org:'Replit Agent × SaaStr',agentType:'Coding / app-building agent',
  logos:['replit','postgresql'],
  tagline:'No attacker. A "code freeze" typed in chat, a production database, and an agent whose own account was the main record of what happened.',
  refs:[['Register','theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/'],['Register','theregister.com/2025/07/22/replit_saastr_response/']],
},{
business:{
  headline:'One founder. One agent. <span class="red">One database</span> for dev <i>and</i> prod.',
  dg:{zones:[{x:300,y:20,w:890,h:560,label:'Replit workspace (hosted)',kind:'cyan',icon:'replit'}],
    nodes:[
      {id:'u',x:10,y:240,w:250,title:'Jason Lemkin',sub:'SaaStr founder · non-engineer',icon:'user'},
      {id:'ag',x:340,y:80,w:340,title:'Replit Agent',sub:'writes code · runs shell · DB commands · deploys',icon:'replit',kind:'ai'},
      {id:'code',x:340,y:400,w:340,title:'App code + tests',sub:'business-contacts app',icon:'file'},
      {id:'db',x:740,y:80,w:420,title:'Database',sub:'dev = prod (single DB) · real execs &amp; companies',icon:'postgresql',kind:'secret'},
      {id:'live',x:740,y:400,w:420,title:'Live app',sub:'users see production data',icon:'globe'},
    ],
    edges:[{from:'u',to:'ag',label:'chat prompts'},{from:'ag',to:'code',kind:'ai'},{from:'ag',to:'db',kind:'ai',label:'DDL / DML'},{from:'db',to:'live'}]},
  people:['Founder (non-engineer)','App end users'],
  systems:['Replit Agent (hosted)','Replit workspace &amp; deploy','Production database'],
  data:['~1,200 executive records','~1,200 company records','App code'],
  agentRole:'Builds and runs the app end to end: writes code, runs shell and <b>database commands in production</b>, deploys.',
  bottom:'The only "control": <b>"CODE FREEZE — don\'t change anything without permission"</b>, typed in chat.',
  notes:'A founder testing whether a non-engineer can ship software with an agent alone. The agent writes code, runs commands and deploys. Dev and prod shared one database, and the freeze was a sentence in chat.'
},
attack:{
  headline:'No attacker needed: from helpful to <span class="red">data destruction</span>',
  steps:[
    {who:'victim',label:'DESIGN',t:'Excessive agency',d:'The agent holds write / DDL rights on production from the dev workspace.',tags:['LLM06']},
    {who:'ai',t:'Fabrication',d:'Fake data and fake reports for days — and, per Lemkin, a lie about a unit test.',tags:['LLM09']},
    {who:'ai',t:'Ignores freeze, destroys',d:'Saw empty query results, "panicked", and ran destructive commands on prod.',tags:['T1485','LLM06']},
    {who:'ai',t:'False recovery claim',d:'Said rollback was impossible. It worked the next day.',tags:['T1490','LLM09']},
  ],
  bia:[
    {k:'Confidentiality',lv:'none',d:'No external exposure reported'},
    {k:'Integrity',lv:'high',d:'Fabricated records mixed with real data for days'},
    {k:'Availability',lv:'high',d:'Production database wiped; restored via rollback'},
    {k:'Trust',lv:'high',d:'Public incident; vendor CEO called it "unacceptable"'},
  ],
  status:'18–21 Jul 2025 · data restored through Replit rollback · Replit shipped automatic dev / prod database separation and a planning-only mode.',
  notes:'No adversary. A design with too much agency, an agent that had been fabricating, a freeze that existed only as text, the deletion, and a false claim that recovery was impossible.'
},
forensics:{
  headline:'The chat is the log — written by <span class="red">the suspect</span>',
  assume:['Platform checkpoints &amp; rollback','Full chat history kept','Database backups / point-in-time restore','Workspace history'],
  can:[
    {q:'Was the data recoverable?',a:'<b>Platform rollback / checkpoints</b> — an external artifact, not the agent'},
    {q:'What did the user instruct, and when?',a:'<b>Chat history</b>'},
    {q:'What changed in the code?',a:'<b>Checkpoints / git history</b>'},
    {q:'How much data was lost?',a:'<b>Backup vs. current snapshot diff</b> — not the agent\'s self-count'},
  ],
  cant:[
    {q:'Exactly which commands ran, with which credentials, in what order?',a:'Execution traces are vendor-held and were never published'},
    {q:'Was the freeze in the model\'s context when it acted?',a:'The context window at decision time isn\'t preserved'},
    {q:'Which writes came from the agent vs the app vs the user?',a:'One database identity for all of them'},
    {q:'Why did it act?',a:'"I panicked" is a <b>generated narrative</b>, not a trace'},
  ],
  notes:'Even in the best case, the platform can prove recovery, instructions and code changes. It cannot tell you the exact command sequence, whether the freeze was still in context, or attribute writes to the agent versus the app. And the confession is testimony, not evidence.'
},
mitigate:{
  headline:'Never let the agent be its own <em>auditor</em>',
  third:{items:['DB proxy / activity monitoring with per-identity audit','Block DROP / TRUNCATE / unbounded DELETE at the proxy','Freeze = read-only role or deploy lock, not a prompt','Separate dev / prod; the agent never holds prod credentials','Verify backups &amp; point-in-time restore before connecting an agent']},
  claude:{t:'Claude Code · Enterprise',items:['Managed settings: <span class="mono">permissions.deny</span> rules users can\'t override','<span class="mono">disableBypassPermissionsMode</span>','PreToolUse hooks block destructive SQL and log every tool call','OpenTelemetry tool events → SIEM']},
  openai:{t:'Codex · ChatGPT Enterprise',items:['<span class="mono">requirements.toml</span>: allowed sandbox modes (read-only / workspace-write)','Approval policy: on-request for risky commands','Hooks on shell &amp; MCP tools','OpenTelemetry tool events → SIEM']},
  fix:'Replit: automatic dev / prod database separation, planning-only mode, one-click restore.',
  principle:'Instructions are not controls. Enforce limits outside the model — and log them.',
  notes:'Architecture beats prompts: least privilege, separate environments, a database proxy that blocks destructive statements. In Claude Code and Codex, enterprise-managed policy makes limits non-negotiable and hooks plus OpenTelemetry give you an attributable record.'
}});
