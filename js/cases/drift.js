/* CASE — Salesloft Drift: stolen OAuth tokens of an AI chat-agent integration used for Salesforce data theft (UNC6395, Aug 2025)
   Sources: Google Threat Intelligence Group advisory (26 Aug 2025, updated 28 Aug: "Drift Email" tokens also used to access
   a small number of Google Workspace accounts on 9 Aug 2025); BleepingComputer; Salesloft updates.
   Log lines are ILLUSTRATIVE, modeled on indicators published by GTIG. */
(function(){
const {chat,kvcard,logcard,klass}=KIT;
KIT.defineCase('drift',{
  code:'SALESLOFT-DRIFT',title:'The AI chat agent\'s keys to the CRM',date:'Aug 2025',sev:'crit',mins:5,
  org:'Salesloft Drift',agentType:'AI sales chat agent · OAuth integration',
  gap:'human, agent or thief — same identity',
  logos:['drift','salesforce','google'],
  tagline:'OAuth tokens held by an AI chat-agent integration were stolen and used to bulk-export Salesforce data from many companies, under a trusted app identity.',
  refs:[['GTIG','cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift'],['BC','bleepingcomputer.com/news/security/salesloft-breached-to-steal-oauth-tokens-for-salesforce-data-theft-attacks/']],
},{
scenario:{
  h:['A website <em>AI chat agent</em> writes leads into the CRM','The vendor is breached — <span class="red">the agent\'s tokens are stolen</span>','Attacker <span class="red">becomes the agent</span> — bulk export'],
  dg:{path:['atk','tok','sf','gw','keys'],
    nodes:[
      {id:'vis',x:0,y:0,icon:'user',title:'Visitor',sub:'chats on website'},
      {id:'bot',x:290,y:0,icon:'drift',title:'Drift AI agent',sub:'vendor SaaS',kind:'ai'},
      {id:'tok',x:580,y:0,icon:'key',iconColor:'#ffb020',title:'OAuth tokens',sub:'per customer',kind:'secret',on:'1-2'},
      {id:'sf',x:870,y:220,icon:'salesforce',title:'Salesforce',sub:'leads · cases',on:'2'},
      {id:'gw',x:290,y:220,icon:'google',title:'Workspace',sub:'"Drift Email"'},
      {id:'atk',x:580,y:440,icon:'torproject',title:'UNC6395',sub:'via Tor / VPS',kind:'attacker',in:1},
      {id:'keys',x:870,y:440,w:190,icon:'amazonaws',title:'Cloud keys',sub:'AWS · Snowflake',kind:'secret',in:2},
    ],
    edges:[
      {from:'vis',to:'bot',n:1,label:'chat'},
      {from:'bot',to:'tok',kind:'ai',n:2},
      {from:'tok',to:'sf',n:3,label:'writes leads',fs:'r',ts:'t',hot:true},
      {from:'tok',to:'gw',label:'email API',fo:-45,hot:true},
      {from:'atk',to:'tok',kind:'attack',n:4,label:'steal tokens',in:1,fs:'t',ts:'b',fo:45,tp:45},
      {from:'atk',to:'sf',kind:'attack',n:5,label:'export as "Drift"',in:2,fs:'r',ts:'l',fo:-35,ly:412},
      {from:'atk',to:'gw',kind:'attack',n:6,label:'mailboxes',in:2,fs:'l',ts:'b'},
      {from:'atk',to:'keys',kind:'attack',n:7,in:2,fo:35,tp:35},
    ]},
  slotA:'What the business sees',
  cardA:[
    chat({ic:'drift',title:'acme.com · chat',msgs:[['u','Visitor','Do you integrate with HubSpot?'],['a','Drift AI agent','Yes! I\'ll pass your details to sales.']]}),
    kvcard({ic:'alert',title:'Vendor side · invisible to customers',cls:'bad',rows:[['Where','Salesloft (Mandiant: GitHub → Drift AWS)'],['Taken','OAuth access + refresh tokens, every Drift integration'],['You see','nothing — no login, no alert']]}),
  ],
  slotB:'Salesforce · app "Drift"',
  cardB:[
    logcard({ic:'salesforce',title:'Event Monitoring',lines:['<span class="m">10:12</span> Lead created  <span class="g">1 row</span>','<span class="m">10:40</span> Lead updated  <span class="g">1 row</span>','<span class="m">src</span> Drift SaaS IPs']}),
  ],
  input:'Same app identity "Drift", same OAuth token — attacker from Tor / VPS',
  before:logcard({ic:'salesforce',title:'Event Monitoring · app "Drift"',lines:['<span class="m">10:12</span> Lead created  <span class="g">1 row</span>  <span class="m">Drift IPs</span>']}),
  after:logcard({ic:'salesforce',title:'Event Monitoring · app "Drift"',cls:'bad',lines:['<span class="m">14:03</span> SELECT COUNT() Account  1 row','<span class="m">14:04</span> <span class="diff">BULK Case     48,210 rows</span>','<span class="m">14:06</span> <span class="diff">BULK User, Contact  high vol.</span>','<span class="m">14:09</span> <span class="diff">DELETE query job</span>','<span class="m">src</span> <span class="diff">Tor exit · python-requests</span>'],extra:'<div class="cnote">illustrative · modeled on GTIG-published indicators</div>'}),
  bottom:[
    klass([['Normal',['chat → lead','agent writes via OAuth','long-lived tokens at vendor'],'green'],['Identity',['non-human · connected app'],'cyan']]),
    klass([['Attack',['3rd-party SaaS supply chain','Token theft'],'red'],['ATT&amp;CK',['T1199 Trusted relationship','T1528 Steal app token']]],true),
    klass([['Outcome',['Token replay — no password, no MFA','Bulk data theft'],'red'],['ATT&amp;CK',['T1550.001','T1213','T1552','T1070']],['Actor',['UNC6395 · 8–18 Aug 2025'],'amber'],['Also',['few Workspace mailboxes · 9 Aug'],'amber'],['Status',['all Drift tokens revoked 20 Aug'],'green']],true),
  ],
  notes:['Normal: a visitor chats with the AI agent (1); the agent uses the per-customer OAuth token (2) to write leads into Salesforce (3). The same integration also has a "Drift Email" link into Google Workspace.','Arrow 4: the vendor is compromised and tokens for every integration are taken. Customers see nothing.','The attacker becomes the agent: count queries, bulk export of Cases, Users, Contacts (5) — BEFORE vs AFTER on the right, same app identity. GTIG: Drift Email tokens were also used to read a small number of Workspace mailboxes on 9 August (6). Cloud keys found in the exported cases — your own AWS and Snowflake secrets — were then targeted (7). Query jobs deleted; logs remain.']
},
readiness:{
  h:['Every query is logged — <span class="red">as the trusted app</span>','What to switch on <em>now</em> — on Salesforce, and on Claude / ChatGPT'],
  assume:['Shield Event Monitoring (API, Bulk API)','Connected-app OAuth usage','Workspace audit logs','SIEM'],
  plat:'Salesforce or 3rd-party',
  rows:[
    {q:'Which data was exported — when, how many rows?',now:['y','API / Bulk API event logs'],plat:['y','<b>Event Monitoring</b> streamed to SIEM, kept ≥ 1 year'],ent:['y','Same — the export happens in Salesforce']},
    {q:'Was it our agent — or a thief with its token?',now:['p','Behaviour only: IP, user agent, volume'],plat:['y','Per-app baseline (SSPM / ITDR) + connected-app IP restrictions'],ent:['p','API calls with no matching <b>Compliance API</b> conversation → not the agent']},
    {q:'Which secrets sat in the exported records?',now:['p','Manual search after the fact'],plat:['y','Continuous secrets scanning of CRM objects, results kept'],ent:['p','Same scan; secrets pasted into chats show in conversation records']},
    {q:'What happened inside the vendor?',now:['n','Vendor-held evidence'],plat:['p','Contract: notification SLA + right to the vendor\'s logs'],ent:['p','Vendor-held too — beyond what the Compliance API exports']},
  ],
  note0:'Salesforce logs are strong here — but the agent and the thief are the <b>same identity</b>, and the root cause sits <b>at the vendor</b>.',
  note1:'Readiness = a behavioural baseline per agent identity, a secrets inventory, and contract terms for vendor logs.',
  notes:['Event Monitoring shows queries, row counts, IPs and user agents. It cannot separate the real agent from a thief with its token, or show what happened at the vendor.','Readiness on Salesforce: baseline each agent identity, restrict connected-app IPs, scan for secrets, contract for vendor logs. If the agent ran on Claude or ChatGPT Enterprise: an API call with no matching conversation record is a strong sign it was not the agent.']
},
score:{who:['p','y'],act:['y','y'],effect:['y','y'],input:['na','na'],why:['n','n']}
});
})();
