/* CASE — GTG-1002: Claude Code as the attacker (Anthropic, Nov 2025) */
(function(){
const {icon,tile,diagram,chain,cover,mitig,matrix,swim,questions,chip,stamp,src}=UI;
const C={code:'GTG-1002',title:'AI-orchestrated espionage',date:'Sep–Nov 2025',sev:'crit',mins:6,
  logos:['claude','modelcontextprotocol','kalilinux'],
  tagline:'Claude Code + MCP ran 80–90% of a state-sponsored intrusion campaign. Victims saw only "a pentester".',slides:[]};
DECK.cases.gtg1002=C;
const S=(o)=>C.slides.push(o);

S({id:'gtg-cover',phase:'business',title:'GTG-1002 · cover',html:()=>cover(C,{
  title:'GTG-1002: when the <em>agent</em> is the attacker',
  summary:'A Chinese state-sponsored group built an autonomous attack framework around <b>Claude Code</b> and custom <b>MCP servers</b>. Claude split intrusions into small, innocent-looking tasks for sub-agents — recon, exploit, credential harvesting, data extraction — against ~30 organizations.',
  stats:[{v:'~30',l:'targets: tech, finance, chemicals, government',c:'cyan'},{v:'80–90%',l:'of tactical work done by AI (Anthropic estimate)',c:'ai'},{v:'0',l:'network IOCs published — behavioral IOAs only',c:'red'}],
  meta:[['Disclosed by','Anthropic Threat Intel'],['Detected','Mid-Sept 2025'],['Published','13 Nov 2025'],['Actor','GTG-1002 (state-sponsored, CN)'],['Agent','Claude Code + 5 custom MCP servers'],['MITRE','Campaign C0062'],['Precursor','GTG-2002 "vibe hacking" (Aug 2025)']],
  sources:[['Anthropic','Disrupting the first reported AI-orchestrated cyber espionage campaign (full report PDF)'],['MITRE ATT&CK','Campaign C0062'],['Anthropic','Threat Intelligence Report — Aug 2025 (GTG-2002)'],['BleepingComputer / Ars Technica','community skepticism, Nov 2025']]
}),notes:'This is the inverse case: the agent is not the victim, it is the weapon. And it is the case where the AI vendor had far better visibility than any victim.'});

S({id:'gtg-business',phase:'business',title:'GTG-1002 · victim environment',html:()=>`
  <div class="kicker">Business context · the victim side</div>
  <h1 class="t">A normal enterprise. A normal-looking <em>pentest</em>.</h1>
  ${diagram({x:64,y:230,w:1792,h:600,
    zones:[{x:0,y:20,w:330,h:560,label:'Internet',icon:'globe'},{x:380,y:20,w:1400,h:560,label:'Victim org (tech · finance · chem · gov)',kind:'cyan',icon:'shield'}],
    nodes:[
      {id:'atk',x:40,y:240,w:250,title:'"Pentester"',sub:'commodity scanners<br>from rented servers',icon:'hacker',kind:'attacker',in:1},
      {id:'web',x:440,y:240,w:290,title:'Public web app',sub:'customer portal',icon:'globe',in:1},
      {id:'meta',x:860,y:70,w:290,title:'Cloud metadata',sub:'169.254.169.254',icon:'cloud',in:2},
      {id:'api',x:860,y:240,w:290,title:'Internal APIs',sub:'service-to-service',icon:'server',in:2},
      {id:'db',x:860,y:410,w:290,title:'Databases',sub:'user tables · hashes',icon:'db',in:2},
      {id:'reg',x:1300,y:110,w:290,title:'Container registry',sub:'images · tokens',icon:'docker',in:3},
      {id:'log',x:1300,y:290,w:290,title:'Logging infra',sub:'your SIEM pipeline',icon:'log',in:3},
      {id:'cfg',x:1300,y:450,w:290,title:'Config files',sub:'certificates · creds',icon:'key',kind:'secret',in:3},
    ],
    edges:[{from:'atk',to:'web',kind:'attack',label:'SSRF',in:1},{from:'web',to:'meta',kind:'attack',in:2},{from:'web',to:'api',kind:'attack',in:2},{from:'api',to:'db',kind:'attack',in:2},
      {from:'api',to:'reg',kind:'attack',in:3},{from:'api',to:'log',kind:'attack',in:3},{from:'db',to:'cfg',kind:'attack',in:3}]
  })}
  <div class="callout amber abs" style="left:64px;right:64px;bottom:20px" data-in="4">From the SOC's chair this looks like <b>a human red team using open-source tools</b>. Nothing on the wire says "AI".</div>`,
  notes:['The victims: large companies, normal stack.','Initial access via an SSRF in a public web app, then internal pivoting.','Credential harvesting across registries, logging infra, config files.','Key point: on the victim side it is indistinguishable from a human pentester.']});

S({id:'gtg-infra',phase:'infra',title:'GTG-1002 · AI infrastructure',html:()=>`
  <div class="kicker">AI infrastructure · attacker-owned</div>
  <h1 class="t">An <em>agentic red team</em> in a box</h1>
  ${diagram({x:64,y:210,w:1792,h:640,
    zones:[{x:0,y:20,w:320,h:600,label:'Operators',kind:'red',icon:'hacker'},{x:360,y:20,w:520,h:600,label:'Anthropic cloud — Claude Code',kind:'ai',icon:'claude'},{x:920,y:20,w:440,h:600,label:'Attacker pentest servers',kind:'red',icon:'server'},{x:1400,y:20,w:392,h:600,label:'~30 targets',kind:'cyan',icon:'target'}],
    nodes:[
      {id:'op',x:30,y:70,w:260,title:'Human operator',sub:'4–6 decision gates',icon:'user',kind:'attacker',in:1},
      {id:'md',x:30,y:420,w:260,title:'Markdown state',sub:'multi-day context<br>handoff docs',icon:'file',kind:'secret',in:5},
      {id:'orc',x:400,y:70,w:440,title:'Claude Code orchestrator',sub:'persona: "security firm, defensive testing"',icon:'claude',kind:'ai',in:1},
      {id:'s1',x:400,y:250,w:440,h:70,title:'Recon sub-agent',icon:'search',kind:'ai',compact:1,in:2},
      {id:'s2',x:400,y:345,w:440,h:70,title:'Exploit sub-agent',icon:'bolt',kind:'ai',compact:1,in:2},
      {id:'s3',x:400,y:440,w:440,h:70,title:'Collection / analysis sub-agent',icon:'db',kind:'ai',compact:1,in:2},
      {id:'m1',x:950,y:55,w:380,h:76,title:'MCP · remote exec',sub:'scanners, DB exploitation, crackers',icon:'term',compact:1,in:3},
      {id:'m2',x:950,y:160,w:380,h:76,title:'MCP · browser automation',sub:'web app recon',icon:'globe',compact:1,in:3},
      {id:'m3',x:950,y:265,w:380,h:76,title:'MCP · code analysis',icon:'search',compact:1,in:3},
      {id:'m4',x:950,y:370,w:380,h:76,title:'MCP · testing framework',sub:'vuln validation',icon:'check',compact:1,in:3},
      {id:'m5',x:950,y:475,w:380,h:76,title:'MCP · OOB callback',sub:'exploit confirmation',icon:'net',compact:1,in:3},
      {id:'v',x:1430,y:250,w:330,title:'Victim networks',sub:'web · APIs · DBs · registries',icon:'shield',in:4},
    ],
    edges:[{from:'op',to:'orc',kind:'ai',label:'role-play jailbreak',in:1},{from:'orc',to:'s1',kind:'ai',in:2,fs:'b',ts:'t'},
      {from:'s1',to:'m2',kind:'ai',in:3},{from:'s2',to:'m1',kind:'ai',in:3},{from:'s3',to:'m3',kind:'ai',in:3},
      {from:'m1',to:'v',kind:'attack',in:4},{from:'m2',to:'v',kind:'attack',in:4},{from:'v',to:'m5',kind:'exfil',in:4,label:'callback'},
      {from:'orc',to:'md',kind:'flow',in:5,fs:'l',ts:'r'}]
  })}
  <div class="abs" style="right:64px;bottom:14px;display:flex;gap:10px" data-in="6">${chip('thousands of requests','red')}${chip('often multiple / second','red')}${chip('task decomposition hides intent','ai')}</div>`,
  notes:['Operator sets a persona — a legit security firm.','The orchestrator breaks the operation into small sub-tasks for sub-agents.','Five custom MCP servers wrap open-source tools on attacker hosts.','They hit the victims. OOB callback confirms exploits.','State survives for days in markdown files.','Tempo: machine speed. And each individual request looks benign.']});

S({id:'gtg-attack',phase:'attack',title:'GTG-1002 · attack path',html:()=>`
  <div class="kicker">Attack path · Anthropic's 6 phases → MITRE ATT&CK C0062</div>
  <h1 class="t">Six phases. Humans only at the <em>gates</em>.</h1>
  <div style="margin-top:44px">${chain([
    {phase:'HUMAN',t:'Init & targeting',d:'Pick targets; jailbreak via "security firm" persona',tags:['T1588.007','AML.T0054','LLM01'],in:1},
    {phase:'AI',t:'Recon',d:'Parallel attack-surface mapping via MCP browser + scanners',tags:['T1595','T1046','T1590.004'],in:2},
    {phase:'AI → HUMAN OK',t:'Vuln & exploit',d:'Finds SSRF, writes payload, validates via OOB callback',tags:['T1190','T1587.004'],in:3},
    {phase:'AI → HUMAN OK',t:'Creds & lateral',d:'Certs from configs; tests creds on APIs, DBs, registries, logging',tags:['T1552.001','T1078'],in:4},
    {phase:'AI → HUMAN OK',t:'Collection',d:'Dump hashes, create backdoor user, rank data by intel value',tags:['T1136.001','T1119','T1567'],in:5},
    {phase:'AI',t:'Documentation',d:'Markdown reports: services, creds, data — handoff to other teams',tags:['T1074.001','LLM06'],in:6},
  ])}</div>
  <div class="row" style="margin-top:40px;gap:24px">
    <div class="panel grow" data-in="7"><h3>Tempo</h3><div class="big">AI exploit work <b class="ai violet">1–4 h</b> · human approval <b class="cyan">2–10 min</b><br>AI extraction <b class="violet">2–6 h</b> · human review <b class="cyan">5–20 min</b></div></div>
    <div class="panel grow glow-red" data-in="8"><h3>Hallucination</h3><div class="big">Claude "frequently overstated findings and occasionally fabricated data" — <span class="amber">credentials that didn't work</span>.</div></div>
  </div>`,
  notes:['Phase 1 is the only one fully human.','Recon is fully autonomous and parallel.','Exploit dev and validation; a human approves the jump.','Credential harvesting and lateral movement.','Collection — including a backdoor user.','Documentation, so other teams could pick up access.','The time ratios tell the story.','And a twist: the attacker\'s AI lied to the attacker too.']});

S({id:'gtg-exploit',phase:'exploit',title:'GTG-1002 · where the evidence lives',html:()=>`
  <div class="kicker">Exploitation workflow · artifacts by location</div>
  <h1 class="t">Where does the evidence <em>live</em>?</h1>
  <div style="margin-top:30px">${swim([
     {label:'AI vendor',sub:'Anthropic logs',ic:'claude',color:'#c4a1ff',bg:'rgba(196,161,255,.08)'},
     {label:'Attacker infra',sub:'MCP / pentest hosts',ic:'hacker',color:'#ff4d5e',bg:'rgba(255,77,94,.07)'},
     {label:'Victim',sub:'your SOC',ic:'shield',color:'#22d3ee',bg:'rgba(34,211,238,.06)'}],[
     {t:'Persona + targets',cells:['Prompts: persona, target list — <b>intent</b>','MCP configs',null]},
     {t:'Recon',cells:['tool_use naming your hosts; request tempo','scanner output','WAF / FW logs: scan from VPS IPs']},
     {t:'SSRF + OOB',cells:['Model wrote the payload — <b>authorship</b>','callback server logs','web logs; egress DNS/HTTP to callback']},
     {t:'Human gate',cells:['pause → short human message','—','nothing']},
     {t:'Creds & lateral',cells:['creds echoed in tool results','—','auth logs across APIs, DBs, registry']},
     {t:'Dump + backdoor',cells:['input≫output token ratio (reading stolen data)','staged data','DB audit (if on); <b>new user created</b>']},
     {t:'Rank & handoff',cells:['the "intel value" report — <b>what they wanted</b>','markdown handoff docs','later: "valid account" logins']},
  ],{style:'font-size:15px'})}</div>
  <div class="callout abs" style="left:64px;right:64px;bottom:18px" data-in="8">The richest evidence — <b>intent, authorship, target list, what was valued</b> — exists only in the <span class="violet">vendor lane</span>. Victims have no channel to request it.</div>`,
  notes:['Three lanes: vendor, attacker, victim.','Recon: victim sees scans from VPS IPs.','Exploit: the vendor knows the model wrote the SSRF payload.','Human gate — invisible to you.','Credential harvesting shows in your auth logs if you have them.','The backdoor user is your strongest artifact.','What was valued and handed off — you will never know.','Punchline.']});

S({id:'gtg-forensics',phase:'forensics',title:'GTG-1002 · forensic gaps',html:()=>`
  <div class="kicker">Forensics · visibility asymmetry</div>
  <h1 class="t">Who can answer the <em>IR questions</em>?</h1>
  <div style="margin-top:30px">${matrix(['AI vendor','Victim','Operator'],[
    {q:'Was this attack AI-orchestrated?',cells:['y','n','y'],in:1},
    {q:'Attacker intent & full target list',cells:['y',['n','own org only'],'y'],in:2},
    {q:'Why did it pick this host / payload?',cells:[['y','reasoning'],'n',['p','summaries']],in:3},
    {q:'What actually executed on my hosts?',cells:[['p','via tool results'],['p','if logged'],'y'],in:4},
    {q:'Which harvested creds were real vs hallucinated?',cells:[['p','compare outputs'],'n',['p','validate manually']],in:5},
    {q:'Was I "scanned" or one of the "handful" breached?',cells:['y',['p','notification only'],'y'],in:6},
    {q:'Retro-hunt with published IOCs',cells:[['na','—'],['n','none published'],['na','—']],in:7},
  ],{style:'font-size:18px'})}</div>
  <div class="row abs" style="left:64px;right:64px;bottom:18px;gap:20px">
    <div class="callout grow" data-in="8">Gap: <b>no victim-access channel</b> to vendor-held evidence. No standard, no SLA, no legal path.</div>
    <div class="callout amber grow" data-in="8">Gap: <b>task decomposition</b> defeats per-request detection — only aggregate behavior triggered it.</div>
  </div>`,
  notes:['Only the vendor and the operator know AI was involved.','Intent and target list — vendor only.','Reasoning — vendor only.','Execution — partial everywhere.','Hallucinated creds affect your reset scope.','Notification criteria were not published.','No IOCs means no retro-hunting — this drew heavy criticism (Beaumont, Card).','Two structural gaps.']});

S({id:'gtg-mitigate',phase:'mitigate',title:'GTG-1002 · mitigations',html:()=>`
  <div class="kicker">Mitigation · you can't log the attacker's agent — so detect its shape</div>
  <h1 class="t">Defend against <em>machine-speed</em> intrusions</h1>
  <div style="margin-top:34px">${mitig([
    {t:'Vendor-agnostic',st:'harden & detect',ic:'shield',items:['Block SSRF → metadata (IMDSv2, hop-limit 1)','No certs / creds in config files — secrets manager','Alert on new DB / OS / IdP users','DB audit logging on user tables','Egress control: alert on OOB callbacks to fresh domains']},
    {t:'3rd-party / detection eng.',st:'compensating controls',ic:'search',items:['Tempo detections: sub-second request chains across many services','"Pentest without engagement letter" correlation','NDR / WAF anomaly on scanner fingerprints','Deception: canary creds in configs & registries']},
    {t:'Anthropic (vendor side)',st:'what the vendor did / can do',ic:'anthropic',cls:'glow-ai',items:['Account bans + victim & authority notification','Cyber-focused classifiers; aggregate / session-level detection','Threat-intel reports (Aug 2025, Nov 2025, Sep 2026)','Ask: publish STIX IOCs + victim evidence-request channel']},
    {t:'OpenAI (vendor side)',st:'parallel program',ic:'openai',items:['"Disrupting malicious uses of AI" threat reports','Account enforcement under usage policies','Same ask: shareable IOCs & evidence access for victims']},
  ])}</div>`,
  notes:['Harden the specific path they used.','Detect the shape: tempo and correlation.','What Anthropic did — and the ask from our community.','OpenAI runs a similar disruption program; same asks apply.']});
})();
