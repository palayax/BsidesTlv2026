/* CASE — EchoLeak: zero-click prompt injection in Microsoft 365 Copilot (CVE-2025-32711, Jun 2025)
   Sources: MSRC CVE-2025-32711; Aim Labs (Aim Security) EchoLeak research; The Hacker News 12 Jun 2025. */
KIT.defineCase('echoleak',{
  code:'ECHOLEAK',title:'The email that briefed Copilot',date:'Jun 2025',sev:'crit',mins:5,
  org:'Microsoft 365 Copilot',agentType:'Enterprise assistant · RAG over mail, files, chat',
  logos:['microsoft','copilot'],
  tagline:'An inbound email carried hidden instructions. When Copilot later pulled it into context, it could leak internal data — no click needed.',
  refs:[['MSRC','msrc.microsoft.com/update-guide/vulnerability/CVE-2025-32711'],['THN','thehackernews.com/2025/06/zero-click-ai-vulnerability-exposes.html']],
},{
business:{
  headline:'Copilot answers from <em>everything the user can access</em>',
  dg:{zones:[{x:0,y:20,w:280,h:230,label:'Internet',icon:'globe'},{x:320,y:20,w:870,h:560,label:'Microsoft 365 tenant',kind:'cyan',icon:'shield'}],
    nodes:[
      {id:'ext',x:15,y:80,w:250,title:'Anyone outside',sub:'customer · vendor · stranger',icon:'globe'},
      {id:'mail',x:350,y:70,w:270,title:'Outlook mailbox',sub:'inbound email',icon:'mail'},
      {id:'sp',x:350,y:250,w:270,title:'SharePoint · OneDrive',sub:'internal files',icon:'file'},
      {id:'tm',x:350,y:430,w:270,title:'Teams',sub:'chats &amp; meetings',icon:'chat'},
      {id:'g',x:670,y:250,w:230,title:'Graph retrieval',sub:'finds relevant items (RAG)',icon:'search'},
      {id:'cop',x:940,y:90,w:235,title:'M365 Copilot',sub:'LLM writes the answer',icon:'copilot',kind:'ai'},
      {id:'emp',x:940,y:420,w:235,title:'Employee',sub:'"summarize our Q3 plan"',icon:'user'},
    ],
    edges:[{from:'ext',to:'mail',label:'email'},{from:'mail',to:'g'},{from:'sp',to:'g'},{from:'tm',to:'g'},
      {from:'g',to:'cop',kind:'ai',label:'context'},{from:'emp',to:'cop',label:'question ⇄ answer',fs:'t',ts:'b'}]},
  people:['All employees','External email senders','M365 admins'],
  systems:['Microsoft 365 Copilot','Microsoft Graph','Outlook · SharePoint · OneDrive · Teams'],
  data:['Email','Internal documents','Chats','Anything the user can open'],
  agentRole:'Searches everything the user can access — <b>including email from outsiders</b> — and writes an answer from what it finds.',
  bottom:'Business value: one question searches the whole tenant. Security reality: <b>untrusted email and confidential files share one context window</b>.',
  notes:'The workflow: employees ask Copilot questions; Copilot retrieves mail, files and chats via Graph and answers. Note that inbound email from anyone on the internet is part of that searchable corpus.'
},
attack:{
  headline:'One email. <span class="red">Zero clicks.</span> Data leaves inside a link.',
  steps:[
    {who:'attacker',t:'Plant',d:'Send a normal-looking business email. Hidden instructions are phrased for a human reader, so the injection filter doesn\'t flag them.',tags:['AML.T0051.001','LLM01']},
    {who:'victim',t:'Wait for retrieval',d:'Days later an employee asks a related question. Retrieval pulls the attacker\'s email into Copilot\'s context.',tags:['AML.T0070','LLM08']},
    {who:'ai',t:'Scope violation',d:'Copilot follows the email\'s instructions and places sensitive context data into a reference link.',tags:['AML.T0057','LLM02']},
    {who:'ai',t:'Zero-click exfil',d:'The client auto-loads that link through an allowed Microsoft domain, and the data reaches the attacker\'s server.',tags:['T1567','LLM05']},
  ],
  bia:[
    {k:'Confidentiality',lv:'high',d:'Anything in Copilot\'s context: mail, files, chats the user can access'},
    {k:'Integrity',lv:'low',d:'No data changed; answers could be steered'},
    {k:'Availability',lv:'none',d:'No disruption'},
    {k:'Reach',lv:'high',d:'Default configuration; attacker needs only an email address'},
  ],
  status:'Reported by Aim Labs → fixed server-side by Microsoft · <b>CVE-2025-32711</b>, CVSS 9.3, published Jun 2025 · no customer action required · Microsoft: not exploited in the wild.',
  notes:'Attack path in four steps, high level. Plant, wait for retrieval, the model crosses its scope, and the client fetches the link automatically. Impact: confidentiality of everything Copilot can see. Patched server-side; no known exploitation.'
},
forensics:{
  headline:'Mail logs show an email. Nothing shows <span class="red">it was a weapon</span>.',
  assume:['Purview audit incl. Copilot interactions','Mailbox audit + message trace','Defender for Office 365','Proxy / DNS logs','Long retention'],
  can:[
    {q:'Did the email arrive — from whom, when, to whom else?',a:'<b>Message trace</b>, mailbox audit, email hunting'},
    {q:'When did the user ask Copilot, and which items were referenced?',a:'<b>Copilot interaction audit records</b> (accessed resources)'},
    {q:'Did the client contact an external host afterwards?',a:'<b>Proxy / DNS</b> — but the request went through an allowed Microsoft domain, so it looks benign'},
    {q:'Who else could be exposed?',a:'Same sender / subject across mailboxes'},
  ],
  cant:[
    {q:'Which sentence in which email steered the answer?',a:'Retrieved passages and their ranking aren\'t logged — only resource references'},
    {q:'Exactly what data left the tenant?',a:'It was hidden in URL parameters of an allowed domain; proxies truncate or never see it'},
    {q:'Did Copilot follow the user or the email?',a:'The model\'s decision path isn\'t recorded; content retention varies'},
    {q:'Was anyone hit before the fix?',a:'Server-side patch, no IOCs; the payload is plain English — <b>no signature to retro-hunt</b>'},
  ],
  notes:'Assume everything is on: Purview audit with Copilot interaction records, message trace, Defender, proxy. You can show the email arrived and that Copilot referenced it. You cannot show which instruction drove the answer, what exactly left, or whether anyone was hit before the patch.'
},
mitigate:{
  headline:'Separate <em>untrusted input</em> from private data and outbound channels',
  third:{items:['AI security gateway / DLP inspecting prompts and responses','Block auto-loading of external images &amp; links in AI clients; strict CSP','Email filtering for instruction-like text aimed at AI','Least-privilege access + sensitivity labels: AI leaks only what the user can read','SIEM: AI interaction → outbound URL with long query string']},
  claude:{items:['Owners decide which connectors (e.g., M365, Google Workspace) users may enable','Compliance API: export chats &amp; outputs to SIEM / eDiscovery for retro-hunting','SSO + SCIM + audit logs tie every session to a managed identity','Restrict web access for workspaces that handle sensitive data']},
  openai:{items:['Admin / RBAC control over which apps &amp; connectors each group can use','Compliance API: conversation export for eDiscovery &amp; SIEM','Retention controls; Enterprise Key Management','Least-privilege connector scopes; review synced sources']},
  fix:'Microsoft patched server-side (CVE-2025-32711); no customer action.',
  principle:'Untrusted content + private data + an outbound channel = the "lethal trifecta". Break at least one.',
  notes:'Third-party: inspect prompts and responses, kill auto-loading of external content, least privilege. Claude and ChatGPT Enterprise: control which connectors exist, export conversations for retro-hunting, tie sessions to identities. The principle: never combine untrusted input, private data and an outbound channel.'
}});
