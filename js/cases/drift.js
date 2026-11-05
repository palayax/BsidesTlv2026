/* CASE — Salesloft Drift: stolen OAuth tokens of an AI chat-agent integration used for Salesforce data theft (UNC6395, Aug 2025)
   Sources: Google Threat Intelligence Group advisory (26 Aug 2025, updated 28 Aug); BleepingComputer; Salesloft trust updates. */
KIT.defineCase('drift',{
  code:'SALESLOFT-DRIFT',title:'The AI chat agent\'s keys to the CRM',date:'Aug 2025',sev:'crit',mins:5,
  org:'Salesloft Drift',agentType:'AI sales chat agent · OAuth integration',
  logos:['drift','salesforce','google'],
  tagline:'OAuth tokens held by an AI chat-agent integration were stolen and used to bulk-export Salesforce data from many companies, under a trusted app identity.',
  refs:[['GTIG','cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift'],['BC','bleepingcomputer.com/news/security/salesloft-breached-to-steal-oauth-tokens-for-salesforce-data-theft-attacks/']],
},{
business:{
  headline:'A website <em>AI chat agent</em> that writes leads into your CRM',
  dg:{zones:[{x:0,y:20,w:250,h:560,label:'Internet',icon:'globe'},{x:285,y:20,w:410,h:560,label:'Vendor SaaS · Salesloft Drift',kind:'ai',icon:'cloud'},{x:730,y:20,w:460,h:560,label:'Customer org',kind:'cyan',icon:'shield'}],
    nodes:[
      {id:'vis',x:12,y:250,w:225,title:'Website visitor',sub:'chats with the bot',icon:'user'},
      {id:'bot',x:310,y:110,w:360,title:'Drift AI chat agent',sub:'qualifies leads · books meetings',icon:'drift',kind:'ai'},
      {id:'tok',x:310,y:390,w:360,title:'Stored OAuth tokens',sub:'one set per customer integration',icon:'key',kind:'secret'},
      {id:'sf',x:760,y:110,w:400,title:'Salesforce',sub:'leads · contacts · cases · deals',icon:'salesforce'},
      {id:'gw',x:760,y:390,w:400,title:'Google Workspace',sub:'"Drift Email" integration',icon:'google'},
    ],
    edges:[{from:'vis',to:'bot',label:'chat'},{from:'bot',to:'tok',kind:'ai',dash:true},{from:'tok',to:'sf',label:'API (OAuth)'},{from:'tok',to:'gw',label:'API (OAuth)'}]},
  people:['Website visitors','Sales / SDR teams','Salesforce &amp; Workspace admins'],
  systems:['Drift AI chat agent (Salesloft)','Salesforce','Google Workspace','Connected-app OAuth'],
  data:['Leads &amp; contacts','Support cases — often with secrets','Opportunities','Email'],
  agentRole:'Chats with visitors and <b>writes into the CRM for the company</b> — so it holds long-lived OAuth tokens to customer systems.',
  bottom:'The agent\'s identity is a <b>non-human identity with broad API scopes</b> — and its keys live in someone else\'s SaaS.',
  notes:'A very common pattern: an AI chat agent on the website qualifies visitors and pushes leads into Salesforce, sometimes email. To do that, the vendor stores OAuth tokens for every customer.'
},
attack:{
  headline:'Steal the agent\'s tokens — <span class="red">become the agent</span>',
  steps:[
    {who:'attacker',t:'Compromise the vendor',d:'Access to Salesloft\'s environment; the Drift integration\'s OAuth tokens are taken.',tags:['T1199','T1528']},
    {who:'attacker',t:'Act as the app',d:'Use valid tokens against each customer\'s Salesforce — no password, no MFA prompt.',tags:['T1550.001']},
    {who:'attacker',t:'Bulk export',d:'Automated queries pull Accounts, Contacts, Cases, Users, Opportunities.',tags:['T1213','T1119']},
    {who:'attacker',t:'Hunt secrets, tidy up',d:'Search the data for AWS keys, passwords, Snowflake tokens; delete query jobs (logs remain).',tags:['T1552','T1070']},
  ],
  bia:[
    {k:'Confidentiality',lv:'high',d:'CRM data from many companies, plus secrets pasted into support cases'},
    {k:'Integrity',lv:'low',d:'Read / export activity'},
    {k:'Availability',lv:'med',d:'Integrations cut: all Drift tokens revoked, app pulled from AppExchange'},
    {k:'Downstream',lv:'high',d:'Harvested cloud keys enable follow-on intrusions'},
  ],
  status:'Activity <b>8–18 Aug 2025</b> (UNC6395 per Google GTIG) · tokens revoked by Salesloft &amp; Salesforce 20 Aug · GTIG advisory 26 Aug, scope widened to Drift Email on 28 Aug · not a Salesforce platform vulnerability.',
  notes:'No prompt injection here: the AI agent\'s integration identity is the target. Steal its tokens and you are the agent — trusted, already consented, no MFA. Then bulk export, and hunt the data for cloud credentials.'
},
forensics:{
  headline:'Every query is logged — <span class="red">as the trusted app</span>',
  assume:['Shield Event Monitoring (API, Bulk API, login)','Connected-app OAuth usage','Workspace audit logs','Long log retention','SIEM ingestion'],
  can:[
    {q:'Which queries ran, when, and how many rows?',a:'<b>API / Bulk API event logs</b> — query text, rows processed'},
    {q:'From where, with what client?',a:'Source IPs (incl. Tor) + user agents such as <span class="mono">python-requests</span> — published by GTIG'},
    {q:'Were query jobs deleted to hide activity?',a:'Yes — and deletion doesn\'t remove the event logs'},
    {q:'Which secrets were exposed?',a:'Scan your own exported records for keys (GTIG guidance)'},
  ],
  cant:[
    {q:'Was it the agent or an attacker holding its token?',a:'Same connected-app identity — only behavior (IP, client, volume) differs'},
    {q:'How did the vendor get compromised, and when?',a:'Vendor-held evidence — you depend on <b>their</b> IR and disclosure'},
    {q:'What did the attacker do with the data?',a:'Exfiltration happened at the API — no egress from your network to inspect'},
    {q:'Were the leaked keys used elsewhere?',a:'Needs cross-cloud log review for every secret found — often months back'},
  ],
  notes:'Salesforce logs are good here: with Event Monitoring you see every query, row counts, IPs and user agents. What you cannot answer: whether it was the real agent or a thief with its token — same identity — what happened at the vendor, and where the stolen data and keys went next.'
},
mitigate:{
  headline:'Govern the agent as a <em>privileged non-human identity</em>',
  third:{items:['SSPM / ITDR: inventory connected apps, OAuth grants &amp; scopes','Restrict connected-app IP ranges; short token lifetimes &amp; rotation','Detect a new client, ASN or query volume for an integration','Secrets scanning in CRM cases &amp; tickets','Vendor contracts: breach-notification SLA + log access']},
  claude:{items:['SSO + SCIM: agent access tied to managed identities, removed centrally','Audit logs → SIEM: connector and integration events','Owner-controlled connectors and MCP integrations','Compliance API: what the agent was asked and what data it returned']},
  openai:{items:['Admin console: approve / disable apps &amp; connectors per group','Compliance API + audit logs → SIEM','SSO / SCIM, domain verification','Retention controls for agent conversations']},
  fix:'Salesloft &amp; Salesforce revoked all Drift tokens (20 Aug 2025); Drift removed from AppExchange.',
  principle:'An AI agent integration is a privileged identity. Inventory it, scope it, and monitor it like an admin.',
  notes:'Treat the agent\'s integration like a service account with admin-level reach: inventory, scope, IP restrictions, short-lived tokens, behavioral detections. On Claude or ChatGPT Enterprise: centralized identity, admin-controlled connectors, audit and compliance exports.'
}});
