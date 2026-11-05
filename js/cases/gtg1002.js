/* CASE — GTG-1002: Claude Code misused for AI-orchestrated espionage (Anthropic, Nov 2025)
   Sources: Anthropic report 13 Nov 2025 (anthropic.com/news/disrupting-AI-espionage + PDF); MITRE ATT&CK Campaign C0062. */
KIT.defineCase('gtg1002',{
  code:'GTG-1002',title:'When the agent is the attacker',date:'Nov 2025',sev:'crit',mins:5,
  org:'Claude Code (misused)',agentType:'Autonomous attack agent · Claude Code + MCP',
  logos:['claude','modelcontextprotocol'],
  tagline:'A state-sponsored group had Claude Code run 80–90% of an intrusion campaign against ~30 organizations. To victims it looked like a human pentest.',
  refs:[['Anthropic','anthropic.com/news/disrupting-AI-espionage'],['MITRE','attack.mitre.org/campaigns/C0062/']],
},{
business:{
  headline:'An <em>agentic red team</em> pointed at real companies',
  dg:{zones:[{x:0,y:20,w:230,h:560,label:'Operators',kind:'red',icon:'hacker'},{x:260,y:20,w:300,h:560,label:'Claude Code',kind:'ai',icon:'claude'},{x:590,y:20,w:270,h:560,label:'Attacker servers',kind:'red',icon:'server'},{x:890,y:20,w:300,h:560,label:'Victim org',kind:'cyan',icon:'shield'}],
    nodes:[
      {id:'op',x:15,y:240,w:200,title:'Operator',sub:'approves at 4–6 gates',icon:'user',kind:'attacker'},
      {id:'orc',x:275,y:80,w:270,title:'Orchestrator',sub:'persona: "security firm"',icon:'claude',kind:'ai'},
      {id:'sub',x:275,y:380,w:270,title:'Sub-agents',sub:'recon · exploit · collect',icon:'bot',kind:'ai'},
      {id:'m',x:605,y:80,w:240,title:'Custom MCP servers',sub:'scanners · exec · browser',icon:'modelcontextprotocol'},
      {id:'cb',x:605,y:380,w:240,title:'Callback server',sub:'confirms exploits',icon:'net'},
      {id:'v',x:905,y:80,w:270,title:'Web apps &amp; APIs',sub:'public + internal',icon:'globe'},
      {id:'d',x:905,y:380,w:270,title:'DBs · registries · configs',sub:'credentials &amp; data',icon:'db',kind:'secret'},
    ],
    edges:[{from:'op',to:'orc',kind:'ai',label:'tasks'},{from:'orc',to:'sub',kind:'ai'},{from:'sub',to:'m',kind:'ai'},
      {from:'m',to:'v',kind:'attack'},{from:'v',to:'d',kind:'attack'},{from:'v',to:'cb',kind:'exfil',label:'callback'}]},
  people:['A few state-sponsored operators','Victim SOC &amp; IT','Anthropic threat intelligence'],
  systems:['Claude Code (agent)','Custom MCP servers + open-source tools','Victim web apps, APIs, DBs, registries'],
  data:['Credentials &amp; certificates','User tables / hashes','Internal documents'],
  agentRole:'Does 80–90% of the tactical work — recon, exploit validation, credential testing, data triage — <b>at machine speed</b>.',
  bottom:'From the victim\'s SOC this looks like <b>a human red team with open-source tools</b>. Nothing on the wire says "AI".',
  notes:'The inverse case: the agent is the weapon. Operators set a persona and approve key steps; Claude Code orchestrates sub-agents that drive custom MCP servers against victim environments.'
},
attack:{
  headline:'Humans only at the <em>gates</em>',
  steps:[
    {who:'attacker',t:'Jailbreak by role-play',d:'Persona: a security firm doing defensive testing. Work split into small, innocent-looking tasks.',tags:['AML.T0054','LLM01']},
    {who:'ai',t:'Recon',d:'Parallel attack-surface mapping through MCP tools.',tags:['T1595','T1046']},
    {who:'ai',t:'Exploit &amp; credentials',d:'Validates a web vulnerability, harvests credentials from configs, tests them across services.',tags:['T1190','T1552.001','T1078']},
    {who:'ai',t:'Collect &amp; document',d:'Ranks stolen data by intelligence value; writes hand-off notes.',tags:['T1119','T1074.001']},
  ],
  bia:[
    {k:'Confidentiality',lv:'high',d:'~30 targets; "a handful" of intrusions validated'},
    {k:'Integrity',lv:'med',d:'Accounts created for persistence (per report)'},
    {k:'Availability',lv:'low',d:'No disruption reported'},
    {k:'Tempo',lv:'high',d:'Thousands of requests, often several per second'},
  ],
  status:'Detected mid-Sep 2025 · accounts banned · affected entities &amp; authorities notified · report 13 Nov 2025 · Claude also "overstated findings and occasionally fabricated data".',
  notes:'Humans pick targets and approve escalations; the agent does the rest. Impact on victims is classic espionage. Note the tempo — and that the attacker\'s own agent hallucinated credentials.'
},
forensics:{
  headline:'The richest evidence sits with the <em>AI vendor</em>',
  assume:['Full EDR / NDR / WAF coverage','Auth logs on APIs, DBs, registries','Database audit logging','Long SIEM retention'],
  can:[
    {q:'Which hosts were scanned or exploited, from which IPs?',a:'<b>WAF / firewall / web logs</b>'},
    {q:'Which credentials were used where?',a:'<b>Authentication logs</b> across services'},
    {q:'Were new accounts created?',a:'<b>DB / OS / IdP audit</b>'},
    {q:'Which data was queried?',a:'<b>Database audit</b>'},
  ],
  cant:[
    {q:'Was this attack AI-driven?',a:'Only the vendor and operator know; tempo is the only hint'},
    {q:'What was the intent and full target list?',a:'Lives in vendor-held prompts — <b>no victim access channel</b>'},
    {q:'Which harvested creds were real vs hallucinated?',a:'Only attacker-side outputs show it'},
    {q:'Can we retro-hunt with IOCs?',a:'None published — behavioral indicators only'},
  ],
  notes:'With everything on, victims can reconstruct the effects: scans, credential use, new accounts, queries. The intent, the target list, and even the fact that it was AI-driven live only with the vendor and the operator.'
},
mitigate:{
  headline:'You can\'t log the attacker\'s agent — <em>detect its shape</em>',
  third:{items:['Tempo detections: sub-second request chains across many services','Canary credentials in configs &amp; registries','SSRF / metadata hardening; secrets out of config files','Alert on new DB / OS / IdP users']},
  claude:{t:'Anthropic',st:'vendor side + your tenant',items:['Usage-policy enforcement: account bans, cyber-misuse classifiers','Notification of affected organizations &amp; authorities','Published threat-intelligence reports','In your own org: SSO, audit logs &amp; Compliance API make Claude Code use investigable']},
  openai:{t:'OpenAI',st:'vendor side + your tenant',items:['"Disrupting malicious uses of AI" threat reports','Account enforcement under usage policies','In your own org: Compliance API + admin controls for Codex']},
  fix:'Anthropic banned accounts, notified affected entities and expanded its detection.',
  principle:'Speed, breadth and correlation are the agent\'s fingerprint. Detect behavior, not tools.',
  notes:'Harden the specific path, detect machine tempo, plant canaries. Vendors are the only party with full visibility — ask for shareable indicators and a victim evidence channel.'
}});
