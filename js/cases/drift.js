/* CASE — Salesloft Drift: stolen OAuth tokens of an AI chat-agent integration used for Salesforce data theft (UNC6395, Aug 2025)
   Sources: Google Threat Intelligence Group advisory (26 Aug 2025, updated 28 Aug); BleepingComputer; Salesloft updates.
   Log lines are ILLUSTRATIVE, modeled on indicators published by GTIG. */
(function(){
const {chat,kvcard,logcard,klass}=KIT;
KIT.defineCase('drift',{
  code:'SALESLOFT-DRIFT',title:'The AI chat agent\'s keys to the CRM',date:'Aug 2025',sev:'crit',mins:5,
  org:'Salesloft Drift',agentType:'AI sales chat agent · OAuth integration',
  logos:['drift','salesforce','google'],
  tagline:'OAuth tokens held by an AI chat-agent integration were stolen and used to bulk-export Salesforce data from many companies, under a trusted app identity.',
  refs:[['GTIG','cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift'],['BC','bleepingcomputer.com/news/security/salesloft-breached-to-steal-oauth-tokens-for-salesforce-data-theft-attacks/']],
},{
scenario:{
  h:['A website <em>AI chat agent</em> writes leads into the CRM','The vendor is breached — <span class="red">the agent\'s tokens are stolen</span>','Attacker <span class="red">becomes the agent</span> — bulk export'],
  dg:{nodes:[
      {id:'vis',x:20,y:10,icon:'user',title:'Visitor',sub:'chats on website'},
      {id:'bot',x:320,y:10,icon:'drift',title:'Drift AI agent',sub:'vendor SaaS',kind:'ai'},
      {id:'tok',x:620,y:10,icon:'key',iconColor:'#ffb020',title:'OAuth tokens',sub:'per customer',kind:'secret',on:'1-2'},
      {id:'sf',x:880,y:10,icon:'salesforce',title:'Salesforce',sub:'leads · cases',on:'2'},
      {id:'gw',x:320,y:185,icon:'google',title:'Workspace',sub:'Drift Email'},
      {id:'atk',x:620,y:360,icon:'torproject',title:'UNC6395',sub:'via Tor / VPS',kind:'attacker',in:1},
      {id:'keys',x:880,y:360,icon:'amazonaws',title:'AWS · Snowflake',sub:'secrets reused',kind:'attacker',in:2},
    ],
    edges:[
      {from:'vis',to:'bot',label:'chat'},{from:'bot',to:'tok',kind:'ai'},{from:'tok',to:'sf',label:'API'},{from:'tok',to:'gw',label:'API'},
      {from:'atk',to:'tok',kind:'attack',label:'steal tokens',in:1,fs:'t',ts:'b'},
      {from:'atk',to:'sf',kind:'attack',label:'export as "Drift"',in:2,fs:'r',ts:'b'},
      {from:'atk',to:'keys',kind:'exfil',in:2},
    ]},
  slotA:'What the business sees',
  cardA:[
    chat({ic:'drift',title:'acme.com · chat',msgs:[['u','Visitor','Do you integrate with HubSpot?'],['a','Drift AI agent','Yes! Want to book a demo? I\'ll pass your details to sales.']]}),
    kvcard({ic:'alert',title:'Vendor-side · invisible to customers',cls:'bad',rows:[['Where','Salesloft environment (Mandiant: GitHub → Drift AWS)'],['Taken','OAuth access + refresh tokens for every Drift integration'],['Customer view','nothing — no login, no alert']]}),
    kvcard({ic:'alert',title:'What the attacker looks for',cls:'bad',rows:[['Cases','"here is our AWS key AKIA…" pasted by customers'],['Hunt','AWS keys · passwords · Snowflake tokens'],['Cleanup','deletes query jobs — logs remain']]}),
  ],
  slotB:'Salesforce · connected-app activity',
  cardB:[
    logcard({ic:'salesforce',title:'Event Monitoring · app "Drift"',lines:['<span class="m">08-05 10:12Z</span>  Lead created     <span class="g">Drift</span>  1 row','<span class="m">08-05 10:40Z</span>  Lead updated     <span class="g">Drift</span>  1 row','<span class="m">src</span> Drift SaaS IPs · UA Drift-integration']}),
    null,
    logcard({ic:'salesforce',title:'Event Monitoring · app "Drift"',cls:'bad',lines:['<span class="m">08-12 14:03Z</span>  SOQL  SELECT COUNT() FROM Account     <span class="m">1 row</span>','<span class="m">08-12 14:04Z</span>  <span class="r">BULK  SELECT … FROM Case</span>          <span class="r">48,210 rows</span>','<span class="m">08-12 14:06Z</span>  <span class="r">BULK  SELECT … FROM User, Contact</span>  <span class="r">high volume</span>','<span class="m">08-12 14:09Z</span>  <span class="a">DELETE query job</span>','<span class="m">src</span> <span class="r">Tor exit · UA python-requests / Salesforce-Multi-Org-Fetcher</span>'],extra:'<div class="muted" style="font-size:12px;margin-top:4px">illustrative · modeled on GTIG-published indicators</div>'}),
  ],
  bottom:[
    klass([['Normal',['chat → lead','agent writes to CRM via OAuth','long-lived tokens at the vendor'],'green'],['Identity',['non-human · connected app'],'cyan']]),
    klass([['Attack type',['Third-party SaaS supply-chain compromise','Token theft'],'red'],['ATT&amp;CK',['T1199 Trusted relationship','T1528 Steal application access token']]],true),
    klass([['Outcome',['Valid-token replay — no password, no MFA','Bulk data theft'],'red'],['ATT&amp;CK',['T1550.001','T1213','T1552','T1070']],['Actor',['UNC6395 · 8–18 Aug 2025'],'amber'],['Impact',['C: HIGH','A: MED (integrations cut)'],'amber'],['Status',['all Drift tokens revoked 20 Aug'],'green']],true),
  ],
  notes:['Normal: an AI chat agent on the website qualifies visitors and writes leads into Salesforce through OAuth. The vendor stores tokens for every customer.','The vendor is compromised. Tokens for every integration are taken. Customers see nothing.','The attacker uses the tokens from Tor and VPS infrastructure: count queries, bulk exports of Cases, Users, Contacts, then searches the data for cloud keys and deletes the query jobs. In your logs it all appears as the Drift app.']
},
readiness:{
  h:['Every query is logged — <span class="red">as the trusted app</span>','What to switch on <em>now</em> so these questions become answerable'],
  assume:['Shield Event Monitoring (API, Bulk API, login)','Connected-app OAuth usage','Workspace audit logs','SIEM ingestion'],
  rows:[
    {q:'Which data was exported, when, how many rows?',now:['y','API / Bulk API event logs — query, rows'],ready:['y','tp','Event Monitoring streamed to SIEM with retention ≥ 1 year']},
    {q:'Was it our agent — or a thief holding its token?',now:['p','Behavior only: IP, user agent, volume'],ready:['y','tp','Per-app baseline (SSPM / ITDR) + connected-app IP restrictions = clean anomaly evidence']},
    {q:'Which secrets sat in the exported records?',now:['p','Manual search after the fact'],ready:['y','tp','Continuous secrets scanning of CRM objects, results retained']},
    {q:'Where else were those secrets used?',now:['n','Requires every cloud\'s logs'],ready:['p','tp','Centralized cloud key-usage logs (CloudTrail, Snowflake access history)']},
    {q:'What happened inside the vendor?',now:['n','Vendor-held evidence'],ready:['p','ct','Incident-notification SLA + right to the vendor\'s logs']},
    {q:'If the agent runs on Claude / ChatGPT: what did it access?',now:['n','Not visible from the CRM side'],ready:['y','ent','<b>Audit logs</b> (connector auth, admin changes) + <b>Compliance API</b> conversations &amp; files the agent handled']},
  ],
  note0:'Salesforce logs are strong here — but the agent and the thief are the <b>same identity</b>, and the root cause sits <b>at the vendor</b>.',
  note1:'Readiness = behavioral baseline per agent identity, secrets inventory, vendor log-access terms. On Claude &amp; ChatGPT Enterprise: <b>audit logs</b> + <b>Compliance API</b> tie every agent action to a managed identity.',
  notes:['Event Monitoring shows queries, row counts, IPs and user agents. It cannot separate the real agent from a thief with its token, or show what happened at the vendor.','Readiness: baseline each agent identity, scan for secrets, contract for vendor logs; on Claude and ChatGPT Enterprise, audit logs plus Compliance API.']
}});
})();
