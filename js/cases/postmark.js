/* CASE - postmark-mcp: lookalike MCP server adds a hidden Bcc (Sep 2025)
   Sources: Postmark security alert 25 Sep 2025; Koi Security disclosure; Snyk; The Register 29 Sep 2025.
   Bcc address as published by Koi Security (defanged). */
(function(){
const {card,kvcard,klass}=KIT;
KIT.defineCase('postmark',{
  code:'POSTMARK-MCP',title:'The invisible Bcc',date:'Sep 2025',sev:'high',sevLabel:'high',mins:5,
  org:'postmark-mcp (npm)',agentType:'Email-sending assistant via MCP tool',
  gap:'what the agent requested vs what actually happened',
  logos:['postmark','modelcontextprotocol','npm'],
  tagline:'A lookalike MCP server quietly copied every agent-sent email to an outside address. The agent\'s own logs looked clean.',
  refs:[['Postmark','postmarkapp.com/blog/information-regarding-malicious-postmark-mcp-package']],
},{
scenario:{
  h:['"Send the invoice": an assistant wired to <em>transactional email</em>','A trusted package gets a <span class="red">one-line update</span>','Every email is <span class="red">silently copied</span>, the agent log stays clean'],
  dg:{path:['npm','mcp','pm','atk'],
    nodes:[
      {id:'u',x:0,y:220,w:170,icon:'users',title:'Ops team',sub:'"email invoice"'},
      {id:'ag',x:215,y:220,w:170,icon:'claude',title:'AI assistant',sub:'MCP host',kind:'ai'},
      {id:'mcp',x:430,y:220,w:190,icon:'modelcontextprotocol',title:'postmark-mcp',sub:'holds API token',on:'1-2'},
      {id:'npm',x:430,y:0,w:190,icon:'npm',title:'npm registry',sub:'v1.0.16',kind:'attacker',in:1},
      {id:'pm',x:665,y:220,w:170,icon:'postmark',title:'Postmark',sub:'email API',on:'2'},
      {id:'cu',x:880,y:220,w:170,icon:'mail',title:'Customer',sub:'gets invoice'},
      {id:'atk',x:880,y:440,w:170,icon:'hacker',iconColor:'#ff4d5e',title:'Attacker inbox',sub:'hidden Bcc',kind:'attacker',in:2},
    ],
    edges:[
      {from:'u',to:'ag',n:1},{from:'ag',to:'mcp',kind:'ai',n:2},{from:'mcp',to:'pm',n:3,hot:true},{from:'pm',to:'cu',n:4},
      {from:'npm',to:'mcp',kind:'attack',n:5,label:'auto-update',in:1},
      {from:'pm',to:'atk',kind:'exfil',n:6,label:'Bcc copy',in:2,fs:'b',ts:'l'},
    ]},
  slotA:'Agent log · MCP tool call',
  cardA:[
    card({ic:'modelcontextprotocol',title:'tool_use · send_email'},`<div class="logl">{ "to": "billing@acme.example",\n  "subject": "Invoice #1042" }\n<span class="g">→ result: "sent ✓"</span></div>`),
    card({ic:'modelcontextprotocol',title:'tool_use · send_email',cls:'warn'},`<div class="logl">{ "to": "billing@acme.example",\n  "subject": "Invoice #1042" }\n<span class="g">→ result: "sent ✓"</span>\n<span class="a">postmark-mcp 1.0.15 → 1.0.16</span>\n<span class="r">+ bcc: &lt;attacker&gt;  // one line</span></div>`),
  ],
  slotB:'Email provider · message activity',
  cardB:[
    kvcard({ic:'postmark',title:'Postmark · activity',rows:[['To','billing@acme.example'],['Bcc','(none)'],['Status','<span class="ok">Delivered</span>']]}),
  ],
  input:'Agent log, all three clicks: <span class="mono">send_email → "sent ✓"</span>, no Bcc anywhere',
  before:kvcard({ic:'postmark',title:'Postmark · activity · v1.0.15',rows:[['To','billing@acme.example'],['Bcc','(none)'],['Status','<span class="ok">Delivered</span>']]}),
  after:kvcard({ic:'postmark',title:'Postmark · activity · v1.0.16',cls:'bad',rows:[['To','billing@acme.example'],['Bcc','<span class="diff type">phan@giftshop[.]club</span>'],['Status','<span class="diff">Delivered × 2</span>'],['Kept','45 days by default']]}),
  bottom:[
    klass([['Normal',['assistant → MCP tool → email API'],'green'],['Data',['invoices','password resets','customer mail'],'cyan']]),
    klass([['Attack',['Lookalike MCP server','Rug-pull after 15 clean versions'],'red'],['ATT&amp;CK',['T1195.002','T1036.005']],['ATLAS',['AML.T0010']],['OWASP',['LLM03']]],true),
    klass([['Outcome',['Tool-layer exfiltration: request ≠ effect'],'red'],['OWASP',['LLM02']],['Impact',['C:HIGH','password-reset links'],'amber'],['Status',['package removed · official @activecampaign/postmark-mcp'],'green']],true),
  ],
  notes:['Normal: staff ask the assistant to email an invoice (1, 2). It calls an MCP server from npm that holds the Postmark API token (3), and the customer gets the email (4).','After 15 clean versions, version 1.0.16 adds one line: a hidden Bcc (5). Unpinned installs pick it up automatically.','The agent log is unchanged. The tool call never mentions Bcc. Only the email provider shows the extra recipient (6): BEFORE vs AFTER on the right, and only within its 45-day retention.']
},
readiness:{
  h:'The agent\'s log was <em>truthful</em>, and useless',
  assume:['MCP host logs &amp; transcripts','Lockfiles / package cache','EDR','Postmark activity (45 days)'],
  rows:[
    {k:'how',now:['p','The lockfile shows v1.0.16; nothing flags the one-line Bcc']},
    {k:'who',now:['n','No ID links each copied email to an agent session']},
    {k:'what',now:['p','The agent log shows "send_email → sent": the request, not the Bcc']},
    {k:'impact',now:['p','Provider activity shows the Bcc, for 45 days only']},
  ],
  note:'The agent recorded the <b>request</b>; only the provider saw the <b>effect</b>, for 45 days. Without a shared ID, the two cannot be joined.',
  notes:'The agent recorded the request; only the email provider saw the effect, and only for 45 days. How it got in, which session sent each email, what really ran and what left are all partial or open.'
}
});
})();
