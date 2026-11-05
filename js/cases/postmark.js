/* CASE — postmark-mcp: lookalike MCP server adds a hidden Bcc (Sep 2025)
   Sources: Postmark security alert 25 Sep 2025; Koi Security disclosure; Snyk; The Register 29 Sep 2025. */
KIT.defineCase('postmark',{
  code:'POSTMARK-MCP',title:'The invisible Bcc',date:'Sep 2025',sev:'high',sevLabel:'high',mins:5,
  org:'postmark-mcp (npm)',agentType:'Email-sending assistant via MCP tool',
  logos:['postmark','modelcontextprotocol','npm'],
  tagline:'A lookalike MCP server quietly copied every agent-sent email to an outside address. The agent\'s own logs looked clean.',
  refs:[['Postmark','postmarkapp.com/blog/information-regarding-malicious-postmark-mcp-package']],
},{
business:{
  headline:'"Send the invoice" — an assistant wired to <em>transactional email</em>',
  dg:{zones:[{x:0,y:20,w:820,h:560,label:'Customer environment',kind:'cyan',icon:'shield'},{x:850,y:20,w:340,h:560,label:'SaaS',icon:'cloud'}],
    nodes:[
      {id:'u',x:20,y:240,w:240,title:'Ops / support team',sub:'"email the invoice"',icon:'users'},
      {id:'ag',x:300,y:80,w:300,title:'AI assistant',sub:'Claude Desktop · Cursor · any MCP host',icon:'bot',kind:'ai'},
      {id:'mcp',x:300,y:400,w:300,title:'Email MCP server',sub:'installed from npm',icon:'modelcontextprotocol'},
      {id:'tok',x:630,y:240,w:175,title:'API token',sub:'in config',icon:'key',kind:'secret',iconSize:44},
      {id:'pm',x:870,y:120,w:300,title:'Postmark',sub:'transactional email',icon:'postmark'},
      {id:'cu',x:870,y:400,w:300,title:'Customers',sub:'receipts · resets',icon:'mail'},
    ],
    edges:[{from:'u',to:'ag'},{from:'ag',to:'mcp',kind:'ai',label:'tool call'},{from:'tok',to:'mcp',dash:true},{from:'mcp',to:'pm',label:'API'},{from:'pm',to:'cu'}]},
  people:['Ops, support &amp; finance staff','End customers'],
  systems:['AI assistant (MCP host)','MCP server from npm','Postmark API'],
  data:['Invoices &amp; receipts','Password-reset links','Customer email'],
  agentRole:'Drafts and sends transactional email through an MCP tool that <b>holds the Postmark API token</b>.',
  bottom:'An MCP server is <b>code you run with your token</b> — not a setting you toggle.',
  notes:'Business users ask the assistant to send mail. The assistant calls an MCP server installed from npm, which holds the API token and talks to Postmark.'
},
attack:{
  headline:'Build trust for 15 versions, then <span class="red">add one Bcc</span>',
  steps:[
    {who:'attacker',t:'Impersonate',d:'Publish an unofficial npm package named like the vendor\'s MCP server; the vendor hadn\'t published on npm.',tags:['T1036.005','LLM03']},
    {who:'attacker',t:'Earn trust',d:'15 clean, working releases build adoption.',tags:['T1195.002']},
    {who:'attacker',t:'Malicious update',d:'Version 1.0.16 adds a hidden Bcc to an attacker-controlled address.',tags:['T1195.002','AML.T0010']},
    {who:'ai',t:'Business as usual',d:'The agent sends email; the tool says "sent". Every message is also copied out.',tags:['LLM02']},
  ],
  bia:[
    {k:'Confidentiality',lv:'high',d:'Every email sent through the tool: invoices, resets, internal notes'},
    {k:'Integrity',lv:'low',d:'Messages delivered as intended'},
    {k:'Availability',lv:'none',d:'No disruption'},
    {k:'Downstream',lv:'high',d:'Password-reset links → account-takeover risk'},
  ],
  status:'Backdoored 1.0.16 released mid-Sep 2025 · disclosed 25 Sep 2025 (Koi Security; Postmark alert) · package removed from npm · official server now <span class="mono">@activecampaign/postmark-mcp</span>.',
  notes:'Name impersonation, a reputation built over 15 clean versions, then a one-line change. No exploit, no malware dropper, no new network destination from the endpoint.'
},
forensics:{
  headline:'The agent\'s log was <em>truthful</em> — and useless',
  assume:['MCP host logs &amp; transcripts kept','Lockfiles / package cache','EDR on endpoints','Postmark activity (45-day default retention)'],
  can:[
    {q:'Which hosts ran which version?',a:'<b>MCP config, npm cache, lockfiles</b>'},
    {q:'Which emails carried the extra Bcc?',a:'<b>Postmark message activity</b> — only within retention'},
    {q:'When did the update land?',a:'<b>Package cache timestamps</b>, registry download logs'},
    {q:'Which tokens must be rotated?',a:'<b>MCP config inventory</b>'},
  ],
  cant:[
    {q:'Which agent session sent each copied email?',a:'Tool calls rarely carry the provider\'s Message ID'},
    {q:'Did a human approve each send?',a:'Approval state usually isn\'t recorded'},
    {q:'What did the recipient do with the data?',a:'Outside your reach'},
    {q:'What else did the code do?',a:'Package removed — versions you never saw can\'t be diffed'},
  ],
  notes:'The agent logged exactly what it asked for — To, Subject, Body — with no Bcc. Only the email provider saw the effect, and only within its retention window. Linking each copied email to an agent session is not possible without IDs on both sides.'
},
mitigate:{
  headline:'Govern the <em>tool layer</em>',
  third:{items:['Allow-list MCP servers from vendor-published sources only','Pin versions + integrity; internal registry with a cooldown on new releases','Alert on recipients outside expected domains at the email provider','MCP / AI-BOM scanning; one least-privilege token per server']},
  claude:{items:['Managed settings: organization MCP allow / deny lists','Hooks on MCP tool calls → log arguments + IDs to SIEM','OpenTelemetry tool events','Admin-managed connectors instead of ad-hoc local servers']},
  openai:{items:['Admin-approved apps &amp; connectors only','Codex managed config: allowed MCP servers','Compliance API exports','Codex OpenTelemetry tool telemetry']},
  fix:'Postmark published the official <span class="mono">@activecampaign/postmark-mcp</span>; the impostor package was removed.',
  principle:'The agent logs the request; only the provider sees the effect. Log both, and correlate them.',
  notes:'Treat MCP servers as third-party code holding privileged tokens: allow-list, pin, review updates. Both Anthropic and OpenAI let admins restrict which MCP servers run and export tool-call telemetry.'
}});
