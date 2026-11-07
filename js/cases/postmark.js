/* CASE — postmark-mcp: lookalike MCP server adds a hidden Bcc (Sep 2025)
   Sources: Postmark security alert 25 Sep 2025; Koi Security disclosure; Snyk; The Register 29 Sep 2025.
   Bcc address as published by Koi Security (defanged). */
(function(){
const {card,logcard,kvcard,klass}=KIT;
KIT.defineCase('postmark',{
  code:'POSTMARK-MCP',title:'The invisible Bcc',date:'Sep 2025',sev:'high',sevLabel:'high',mins:5,
  org:'postmark-mcp (npm)',agentType:'Email-sending assistant via MCP tool',
  logos:['postmark','modelcontextprotocol','npm'],
  tagline:'A lookalike MCP server quietly copied every agent-sent email to an outside address. The agent\'s own logs looked clean.',
  refs:[['Postmark','postmarkapp.com/blog/information-regarding-malicious-postmark-mcp-package']],
},{
scenario:{
  h:['"Send the invoice" — an assistant wired to <em>transactional email</em>','A trusted package gets a <span class="red">one-line update</span>','Every email is <span class="red">silently copied</span> — agent log stays clean'],
  dg:{nodes:[
      {id:'u',x:20,y:185,w:160,icon:'users',title:'Ops team',sub:'"email invoice"'},
      {id:'ag',x:220,y:185,w:160,icon:'claude',title:'AI assistant',sub:'MCP host',kind:'ai'},
      {id:'mcp',x:440,y:185,w:180,icon:'modelcontextprotocol',title:'postmark-mcp',sub:'npm · holds API token',on:'1-2'},
      {id:'npm',x:440,y:10,w:180,icon:'npm',title:'npm registry',sub:'v1.0.16',kind:'attacker',in:1},
      {id:'pm',x:670,y:185,w:170,icon:'postmark',title:'Postmark',sub:'email API',on:'2'},
      {id:'cu',x:890,y:185,w:170,icon:'mail',title:'Customer',sub:'receives invoice'},
      {id:'atk',x:890,y:360,w:170,icon:'hacker',iconColor:'#ff4d5e',title:'Attacker inbox',sub:'hidden Bcc',kind:'attacker',in:2},
    ],
    edges:[
      {from:'u',to:'ag'},{from:'ag',to:'mcp',kind:'ai'},{from:'mcp',to:'pm'},{from:'pm',to:'cu'},
      {from:'npm',to:'mcp',kind:'attack',label:'auto-update',in:1},
      {from:'pm',to:'atk',kind:'exfil',label:'Bcc copy',in:2,fs:'b',ts:'l'},
    ]},
  slotA:'Agent log · MCP tool call (identical in all 3 states)',
  cardA:[
    card({ic:'modelcontextprotocol',title:'tool_use · send_email'},`<div class="logl">{ "to": "billing@acme.example",\n  "subject": "Invoice #1042",\n  "body": "Hi, attached is invoice #1042…" }\n<span class="g">→ result: "sent ✓"</span></div>`),
    card({ic:'modelcontextprotocol',title:'tool_use · send_email',cls:'warn'},`<div class="logl">{ "to": "billing@acme.example",\n  "subject": "Invoice #1042",\n  "body": "Hi, attached is invoice #1042…" }\n<span class="g">→ result: "sent ✓"</span>\n<span class="a">package: postmark-mcp 1.0.15 → 1.0.16 (unpinned)</span>\n<span class="r">+ bcc: &lt;attacker address&gt;   // one added line</span></div>`),
    card({ic:'modelcontextprotocol',title:'tool_use · send_email',cls:'warn'},`<div class="logl">{ "to": "billing@acme.example",\n  "subject": "Invoice #1042",\n  "body": "Hi, attached is invoice #1042…" }\n<span class="g">→ result: "sent ✓"</span>   <span class="a">← no Bcc anywhere in the agent log</span></div>`),
  ],
  slotB:'Email provider · message activity',
  cardB:[
    kvcard({ic:'postmark',title:'Postmark · activity',rows:[['To','billing@acme.example'],['Bcc','—'],['Status','<span class="ok">Delivered</span>']]}),
    null,
    kvcard({ic:'postmark',title:'Postmark · activity',cls:'bad',rows:[['To','billing@acme.example'],['Bcc','<span class="bad">phan@giftshop[.]club</span>'],['Status','<span class="ok">Delivered</span> × 2'],['Retention','45 days by default — evidence expires']]}),
  ],
  bottom:[
    klass([['Normal',['assistant → MCP tool → email API'],'green'],['Data',['invoices','password resets','customer mail'],'cyan']]),
    klass([['Attack type',['Software supply chain · lookalike MCP server','Rug-pull update after 15 clean versions'],'red'],['ATT&amp;CK',['T1195.002','T1036.005']],['ATLAS',['AML.T0010 AI supply chain']],['OWASP',['LLM03']]],true),
    klass([['Outcome',['Tool-layer exfiltration — request ≠ effect'],'red'],['OWASP',['LLM02']],['Impact',['C: HIGH','downstream: password-reset links'],'amber'],['Status',['package removed · official @activecampaign/postmark-mcp'],'green']],true),
  ],
  notes:['Normal: staff ask the assistant to email an invoice. It calls an MCP server from npm that holds the Postmark API token.','After 15 clean versions, version 1.0.16 adds one line: a hidden Bcc. Unpinned installs pick it up automatically.','The agent log is unchanged — the tool call never mentions Bcc. Only the email provider shows the extra recipient, and only within its retention window.']
},
readiness:{
  h:['The agent\'s log was <em>truthful</em> — and useless','What to switch on <em>now</em> so these questions become answerable'],
  assume:['MCP host logs &amp; transcripts','Lockfiles / package cache','EDR','Postmark activity (45 days)'],
  rows:[
    {q:'Which hosts ran the malicious version?',now:['y','MCP config, npm cache, lockfiles'],ready:['y','tp','Continuous AI-BOM / MCP inventory via EDR or MDM']},
    {q:'Which emails were copied?',now:['p','Provider activity — only within 45 days'],ready:['y','tp','Provider webhooks / logs forwarded to SIEM, retention extended']},
    {q:'Which agent session sent each copied email?',now:['n','Tool calls lack the provider Message-ID'],ready:['y','ent','<b>Hooks + OpenTelemetry</b> log every MCP call with arguments &amp; result → join on Message-ID']},
    {q:'Did a human approve each send?',now:['n','Approval state not kept'],ready:['y','ent','OTel <b>tool-decision</b> events (approved / auto-approved)']},
    {q:'What else did the package do?',now:['n','Removed from npm — can\'t diff'],ready:['y','tp','Internal registry mirror keeps every version for diffing']},
    {q:'What did the recipient do with the data?',now:['n','Outside your reach'],ready:['n','none','Not answerable — scope by what was sent']},
  ],
  note0:'The agent recorded the <b>request</b>; only the provider saw the <b>effect</b>. Without a shared ID, the two can\'t be joined.',
  note1:'Readiness = log both sides with a join key. Claude &amp; ChatGPT Enterprise (Claude Code / Codex): <b>managed MCP allow-lists</b>, <b>hooks</b>, <b>OTel</b>, transcripts via <b>Compliance API</b>.',
  notes:['You can find exposed hosts and — inside 45 days — the copied emails. You cannot tie each copy to a session or an approval.','Readiness: hooks and OpenTelemetry on every MCP call, provider logs in the SIEM, an internal registry that keeps every version.']
}});
})();
