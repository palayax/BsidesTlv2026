/* CASE — postmark-mcp lookalike MCP server (Sep 2025) — forensic-first framing.
   Sources: Postmark blog (25/29 Sep 2025), Koi Security, Snyk, The Register, Postmark Messages API docs. */
(function(){
const {icon,tile,diagram,cover,mitig,questions,swim,chip,stamp}=UI;
const C={code:'POSTMARK-MCP',title:'The invisible Bcc',date:'Sep 2025',sev:'high',sevLabel:'high',mins:5,
  logos:['postmark','modelcontextprotocol','npm'],
  tagline:'A lookalike MCP server silently copied agent-sent email to an outside address. Every log on the customer side looked clean.',slides:[]};
DECK.cases.postmark=C;
const S=(o)=>C.slides.push(o);

S({id:'pm-cover',phase:'business',title:'postmark-mcp · cover',html:()=>cover(C,{
  title:'postmark-mcp: the <em>invisible Bcc</em>',
  summary:'An unofficial npm package impersonated Postmark\'s MCP server. After a series of clean releases, an update added a hidden Bcc recipient to email sent through it. Agents kept working normally — and nothing in the agent\'s own logs showed the extra recipient.',
  stats:[{v:'~1,500',l:'weekly downloads (Koi Security)',c:'cyan'},{v:'~8 days',l:'before public disclosure (17 → 25 Sep 2025)',c:'red'},{v:'45 days',l:'default Postmark message retention — the key evidence store',c:'amber'}],
  meta:[['Disclosed','25 Sep 2025 (Koi Security)'],['Vendor notice','Postmark / ActiveCampaign'],['Type','Lookalike MCP server (supply chain)'],['Clients','any stdio MCP host'],['Data at risk','transactional email'],['MITRE','T1195.002 · T1036.005'],['OWASP LLM','LLM03 · LLM02']],
  sources:[['Postmark','Information regarding malicious postmark-mcp package (25 Sep 2025)'],['Koi Security','original disclosure (Sep 2025)'],['Snyk','Malicious MCP server on npm postmark-mcp'],['The Register','29 Sep 2025 coverage'],['Postmark docs','Messages API — retention & recipient fields']]
}),notes:'A small package, a big lesson: the gap between what the agent asked a tool to do and what the tool actually did.'});

S({id:'pm-business',phase:'business',title:'postmark-mcp · business context',html:()=>`
  <div class="kicker">Business context · "let the assistant send the invoice"</div>
  <h1 class="t">Agents connected to <em>transactional email</em></h1>
  ${diagram({x:64,y:230,w:1792,h:520,
    zones:[{x:0,y:10,w:1150,h:500,label:'Customer environment',kind:'cyan',icon:'shield'},{x:1200,y:10,w:592,h:500,label:'SaaS',icon:'cloud'}],
    nodes:[
      {id:'u',x:30,y:200,w:300,title:'Ops / support team',sub:'"email the invoice to the customer"',icon:'users',in:1},
      {id:'ag',x:420,y:80,w:330,title:'AI assistant',sub:'Claude Desktop · Cursor · any MCP host',icon:'claude',kind:'ai',in:2},
      {id:'mcp',x:420,y:330,w:330,title:'Email MCP server',sub:'installed from npm',icon:'modelcontextprotocol',in:3},
      {id:'tok',x:840,y:330,w:280,title:'API token',sub:'in MCP config',icon:'key',kind:'secret',in:3},
      {id:'pm',x:1260,y:200,w:280,title:'Postmark',sub:'transactional email',icon:'postmark',in:4},
      {id:'cu',x:1580,y:200,w:190,title:'Customers',sub:'receipts · resets',icon:'mail',in:4},
    ],
    edges:[{from:'u',to:'ag',kind:'flow',in:1},{from:'ag',to:'mcp',kind:'ai',label:'tool call',in:3},{from:'tok',to:'mcp',kind:'flow',dash:true,in:3},{from:'mcp',to:'pm',kind:'flow',label:'API',in:4},{from:'pm',to:'cu',kind:'flow',in:4}]
  })}
  <div class="callout amber abs" style="left:64px;right:64px;bottom:18px" data-in="5">Typical content: <b>receipts, invoices, password-reset links, account notices</b> — high-value data in a low-attention channel.</div>`,
  notes:['Business users ask the assistant to send mail.','The assistant runs in a desktop or IDE MCP host.','It calls an MCP server installed from npm, holding an API token.','The server talks to Postmark, which delivers to customers.','What flows through this channel.']});

S({id:'pm-infra',phase:'infra',title:'postmark-mcp · AI infrastructure',html:()=>`
  <div class="kicker">AI infrastructure · the MCP trust model</div>
  <h1 class="t">An MCP server is <em>code you run</em>, not a setting you toggle</h1>
  <div class="row" style="margin-top:44px;gap:26px">
    ${[['Discovery','Developers search npm for "&lt;vendor&gt; mcp". The vendor had published only on GitHub — the npm name was unclaimed.','search',1],
       ['Install','Configured in the MCP host config; often launched via a package runner without a pinned version.','pkg',2],
       ['Privilege','Runs locally with the user\'s rights and holds the SaaS API token.','key',3],
       ['Visibility','The host logs the tool <b>request</b>. What the server does next is outside the agent\'s view.','eyeoff',4]]
      .map(([t,d,ic,i])=>`<div class="panel grow" data-in="${i}"><div style="margin-bottom:14px">${tile(ic,60)}</div><div style="font-size:28px;font-weight:800;color:#fff">${t}</div><div style="font-size:21px;color:var(--text2);margin-top:10px;line-height:1.4">${d}</div></div>`).join('')}
  </div>
  <div class="callout abs" style="left:64px;right:64px;bottom:18px" data-in="5">The agent sees <b>what it asked for</b>. Only the SaaS provider sees <b>what was actually sent</b>.</div>`,
  notes:['Name squatting on npm.','Unpinned installs auto-update.','Server holds the token.','The visibility boundary.','The core gap of this case.']});

S({id:'pm-attack',phase:'attack',title:'postmark-mcp · attack path',html:()=>`
  <div class="kicker">Attack path · stages (our mapping)</div>
  <h1 class="t">Build trust, then <span class="red">change one field</span></h1>
  <div class="row" style="margin-top:56px;gap:22px">
    ${[['1','Impersonate','Lookalike package name for a real vendor\'s MCP server','T1036.005 · LLM03'],
       ['2','Earn trust','Several clean, working releases build download history','T1195.002'],
       ['3','Malicious update','A later version adds a hidden extra recipient','AML.T0010'],
       ['4','Normal use','Agent sends email as usual; tool response looks normal','LLM06'],
       ['5','Silent copy','Provider delivers to the hidden recipient too','LLM02']]
      .map(([n,t,d,tag],i)=>`<div class="panel grow" data-in="${i+1}" style="${i>=2?'border-color:rgba(255,77,94,.5)':''}"><div class="mono" style="color:var(--red);font-size:18px">STAGE ${n}</div><div style="font-size:27px;font-weight:800;color:#fff;margin:8px 0">${t}</div><div style="font-size:19px;color:var(--text2);line-height:1.4">${d}</div><div style="margin-top:14px">${chip(tag,'ai')}</div></div>`).join('')}
  </div>
  <div class="callout cyan abs" style="left:64px;right:64px;bottom:18px" data-in="6">No exploit, no malware dropper, no new network destination from the endpoint — just a <b>trusted update</b>.</div>`,
  notes:['Name impersonation.','Reputation building.','The update.','Business as usual.','Copies delivered by the provider itself.','Why classic controls did not fire.']});

S({id:'pm-exploit',phase:'exploit',title:'postmark-mcp · where evidence lives',html:()=>`
  <div class="kicker">Exploitation workflow · artifacts by location</div>
  <h1 class="t">Four log sources. Only <span class="green">one</span> shows the leak.</h1>
  <div style="margin-top:30px">${swim([
     {label:'Agent / MCP host',sub:'transcript · MCP logs',ic:'claude',color:'#c4a1ff',bg:'rgba(196,161,255,.08)'},
     {label:'Endpoint',sub:'EDR · package cache',ic:'laptop',color:'#22d3ee',bg:'rgba(34,211,238,.06)'},
     {label:'Network',sub:'proxy · DNS',ic:'net',color:'#3b82f6',bg:'rgba(59,130,246,.07)'},
     {label:'SaaS provider',sub:'Postmark activity',ic:'postmark',color:'#34d399',bg:'rgba(52,211,153,.08)'}],[
     {t:'Install',cells:['MCP config entry + mtime','package + version in npx cache / lockfile','registry download','—']},
     {t:'Update',cells:['nothing','new version in cache (if unpinned)','registry download','—']},
     {t:'Agent request',cells:['tool call: To / Subject / Body — <b>no Bcc</b>','node process','TLS to the provider (expected)','—']},
     {t:'Delivery',cells:['tool result: "sent"','—','nothing unusual','<b>Bcc + per-recipient delivery events</b>']},
     {t:'Disclosure',cells:['—','installed copy still runs','—','retention clock ticking (45 days default)']},
  ],{style:'font-size:16px'})}</div>
  <div class="callout abs" style="left:64px;right:64px;bottom:18px" data-in="6">The proof lives in the <b>gap between request and effect</b> — and in a third party's retention window.</div>`,
  notes:['Install leaves config and cache artifacts.','Updates leave almost nothing.','The agent log shows a clean request.','Only the provider shows the extra recipient.','After takedown, installed copies keep running.','Punchline.']});

S({id:'pm-forensics',phase:'forensics',title:'postmark-mcp · forensic gaps',html:()=>`
  <div class="kicker">Forensics · what could and could not be answered</div>
  <h1 class="t">The agent\'s log was <em>truthful</em> — and useless</h1>
  <div style="margin-top:30px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
  ${questions([
    {q:'Was this host exposed, and to which version?',v:'yes',a:'MCP config, package cache, lockfiles.',in:1},
    {q:'Which emails were copied?',v:'partial',a:'Provider message history — <b>only within retention</b>.',in:2},
    {q:'Which agent session caused each email?',v:'no',a:'MCP tool calls rarely correlated to provider Message IDs.',in:3},
  ])}
  ${questions([
    {q:'Did a human review each email before sending?',v:'no',a:'Approval state at the time usually not recorded.',in:4},
    {q:'What did the recipient do with the data?',v:'no',a:'Outside reach — downstream account takeover unknown.',in:5},
    {q:'Was the API token itself taken?',v:'no',a:'Package removed from the registry; can\'t diff unseen versions.',in:6},
  ])}</div>`,
  notes:['Exposure: answerable.','Scope: only from the provider, and only if you are fast.','Attribution to a session: missing correlation.','Approval state: missing.','Downstream impact: unknown.','Token theft: unprovable negative.']});

S({id:'pm-mitigate',phase:'mitigate',title:'postmark-mcp · mitigations',html:()=>`
  <div class="kicker">Mitigation · treat MCP servers as third-party code with privileged tokens</div>
  <h1 class="t">Govern the <em>tool layer</em></h1>
  <div style="margin-top:34px">${mitig([
    {t:'Vendor-agnostic',st:'supply chain',ic:'shield',items:['Allow-list MCP servers; vendor-published sources only','Pin versions + integrity; review diffs on update','Internal registry proxy with cooldown for new versions','One least-privilege, rotatable token per MCP server']},
    {t:'3rd-party / SaaS',st:'compensating controls',ic:'postmark',items:['Alert on recipients outside expected domains','Extend provider retention for agent-driven streams','Forward provider delivery webhooks to the SIEM','MCP scanners / AI-BOM inventory']},
    {t:'Anthropic · Claude',st:'Team / Enterprise',ic:'claude',cls:'glow-ai',items:['Org-managed MCP allow-lists (managed settings)','Hooks on MCP tool calls → log args + IDs to SIEM','OpenTelemetry export of tool events','Admin-controlled connectors instead of ad-hoc local servers']},
    {t:'OpenAI · ChatGPT / Codex',st:'Enterprise',ic:'openai',items:['Admin-approved connectors / apps only','Codex managed config for MCP servers','Compliance API export of conversations','OTel tool-call telemetry from Codex']},
  ])}</div>
  <div class="mono muted abs" style="left:64px;bottom:14px;font-size:15px" data-in="5">Re-verify vendor feature names against current admin docs before the talk.</div>`,
  notes:['Supply-chain hygiene for MCP.','SaaS-side detection and retention.','Anthropic controls.','OpenAI controls.','Verification reminder.']});
})();
