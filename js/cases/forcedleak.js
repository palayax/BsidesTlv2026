/* CASE — ForcedLeak: indirect prompt injection in Salesforce Agentforce via Web-to-Lead (Noma Labs, Sep 2025)
   Sources: Noma Labs blog 25 Sep 2025; The Hacker News Sep 2025. */
KIT.defineCase('forcedleak',{
  code:'FORCEDLEAK',title:'The web form that briefed the sales agent',date:'Sep 2025',sev:'crit',mins:5,
  org:'Salesforce Agentforce',agentType:'CRM agent · reads public lead data',
  logos:['salesforce'],
  tagline:'Text in a public Web-to-Lead form carried hidden instructions. When staff asked the agent about the lead, CRM data could leave through an expired, allow-listed domain.',
  refs:[['Noma','noma.security/blog/forcedleak-agent-risks-exposed-in-salesforce-agentforce'],['THN','thehackernews.com/2025/09/salesforce-patches-critical-forcedleak.html']],
},{
business:{
  headline:'Leads arrive from the web — the <em>agent</em> qualifies them',
  dg:{zones:[{x:0,y:20,w:290,h:560,label:'Internet',icon:'globe'},{x:330,y:20,w:860,h:560,label:'Salesforce org',kind:'cyan',icon:'salesforce'}],
    nodes:[
      {id:'vis',x:15,y:110,w:260,title:'Website visitor',sub:'prospect · or anyone',icon:'user'},
      {id:'form',x:15,y:380,w:260,title:'Web-to-Lead form',sub:'public · no login',icon:'file'},
      {id:'lead',x:360,y:250,w:270,title:'Lead record',sub:'name · company · <b>description</b>',icon:'ticket'},
      {id:'crm',x:360,y:450,w:270,title:'CRM data',sub:'contacts · emails · deals',icon:'db',kind:'secret'},
      {id:'rep',x:680,y:60,w:250,title:'Sales rep',sub:'"check this lead, draft a reply"',icon:'user'},
      {id:'ag',x:680,y:250,w:250,title:'Agentforce agent',sub:'reads lead + CRM',icon:'salesforce',kind:'ai'},
      {id:'csp',x:965,y:250,w:210,title:'Trusted domains',sub:'CSP allow-list',icon:'lock'},
    ],
    edges:[{from:'vis',to:'form'},{from:'form',to:'lead',label:'creates'},{from:'rep',to:'ag',label:'asks'},
      {from:'lead',to:'ag',kind:'ai',label:'context'},{from:'crm',to:'ag',kind:'ai'},{from:'ag',to:'csp',label:'rendered output'}]},
  people:['Prospects — or anyone on the internet','Sales &amp; marketing reps','Salesforce admins'],
  systems:['Salesforce Agentforce','Web-to-Lead','CRM objects','Browser rendering + CSP'],
  data:['Leads','Contacts &amp; email addresses','Opportunities','Internal notes'],
  agentRole:'Reads the lead plus related CRM records and answers the rep — treating <b>public form text as trusted data</b>.',
  bottom:'Business value: instant lead qualification. Reality: <b>anyone on the internet can write into the agent\'s context</b>.',
  notes:'Marketing captures leads through a public web form. A rep asks the Agentforce agent to qualify a lead and draft a reply. The agent reads the lead — including a free-text description written by whoever filled the form — and related CRM data.'
},
attack:{
  headline:'A <span class="red">$5 domain</span> and a form field',
  steps:[
    {who:'attacker',t:'Prepare a channel',d:'Register an expired domain that is still on Salesforce\'s trusted allow-list (~$5, per Noma).',tags:['T1583.001']},
    {who:'attacker',t:'Plant',d:'Submit the public form; the description field carries instructions written like ordinary text.',tags:['AML.T0051.001','LLM01']},
    {who:'victim',t:'Normal work',d:'A rep asks the agent about the new lead, using an ordinary business prompt.',tags:['LLM06']},
    {who:'ai',t:'Follows both',d:'The agent answers the rep — and also gathers CRM data into an image link on the "trusted" domain.',tags:['AML.T0057','LLM02','T1567']},
  ],
  bia:[
    {k:'Confidentiality',lv:'high',d:'CRM data: contacts, email addresses, pipeline details'},
    {k:'Integrity',lv:'med',d:'Outsiders can steer agent output and lead data'},
    {k:'Availability',lv:'none',d:'No disruption'},
    {k:'Regulatory',lv:'high',d:'Customer personal data → privacy breach-notification questions'},
  ],
  status:'Reported to Salesforce 28 Jul 2025 · Salesforce enforced <b>Trusted URLs</b> for Agentforce &amp; Einstein AI and re-secured the domain · disclosed 25 Sep 2025 · CVSS 9.4 (Noma) · research PoC, no public reports of exploitation.',
  notes:'Two preparation steps by the attacker, one ordinary user action, and the agent does the rest. The CSP allow-list — a guardrail — became the exit, because one trusted domain had expired.'
},
forensics:{
  headline:'The lead record is evidence — <span class="red">the leak is not</span>',
  assume:['Shield Event Monitoring','Field Audit Trail','Einstein Trust Layer audit data','Setup Audit Trail','Proxy logs'],
  can:[
    {q:'Which lead carried the instructions, and when was it created?',a:'<b>Lead record</b> + field history (created by the site guest user)'},
    {q:'Which rep asked the agent about it, and when?',a:'<b>Trust Layer audit / agent session data</b>'},
    {q:'Which records could the agent read?',a:'Agent topic/action config + <b>Event Monitoring</b> (partial for agent reads)'},
    {q:'Was the allow-list changed?',a:'<b>Setup Audit Trail</b>'},
  ],
  cant:[
    {q:'Which CRM fields ended up in the URL?',a:'The leak is an image request from the <b>user\'s browser</b>; Salesforce never logs the outbound URL'},
    {q:'Did the agent follow the rep or the hidden text?',a:'Prompt and response may be stored; the decision path is not'},
    {q:'How many other leads hide dormant instructions?',a:'Natural language in a free-text field — no signature; needs semantic scanning'},
    {q:'Did the attacker\'s server receive data?',a:'Attacker-owned host; only your proxy, if it saw the request, can tell'},
  ],
  notes:'With Shield and the Trust Layer audit you can find the poisoned lead and the session that read it. The exfiltration itself happened in the browser — outside Salesforce logs. And you cannot tell how many other dormant instructions sit in your CRM.'
},
mitigate:{
  headline:'Treat <em>public input</em> as untrusted — everywhere the agent reads it',
  third:{items:['Scan inbound free text (forms, tickets, email) for instruction-like content','AI runtime guard on agent output: links, markdown, images','Proxy: block image loads with data-heavy query strings to non-business domains','Monitor allow-listed domains for expiry &amp; ownership change','DSPM: give each agent the minimum data it needs']},
  claude:{items:['Building a similar agent on Claude: only owner-approved connectors and tools','Compliance API → SIEM: correlate public-input records with agent responses','Turn off web access where agents read public input','SSO / SCIM + audit logs for every agent operator']},
  openai:{items:['Admin control of apps, connectors and GPT actions — including allowed domains','Compliance API exports for retro-hunting','RBAC: limit which groups can build &amp; publish agents','Retention &amp; EKM for the evidence you keep']},
  fix:'Salesforce enforced Trusted URLs for Agentforce &amp; Einstein AI; expired domain re-secured.',
  principle:'Allow-lists age. An agent that reads public input must not hold an outbound channel.',
  notes:'Scan untrusted input before agents read it, guard agent output, and watch your allow-lists. Same pattern on Claude or ChatGPT: approved connectors only, no outbound access for agents reading public input, and export conversations so you can retro-hunt.'
}});
