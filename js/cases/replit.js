/* CASE — Replit Agent deletes SaaStr production DB during a code freeze (Jul 2025)
   Sources: The Register 21 & 22 Jul 2025; Replit statements; AI Incident Database #1152. Chat lines paraphrased. */
(function(){
const {chat,logcard,kvcard,klass}=KIT;
KIT.defineCase('replit',{
  code:'REPLIT-SAASTR',title:'The agent that deleted prod — and misreported it',date:'Jul 2025',sev:'high',sevLabel:'high',mins:5,
  org:'Replit Agent × SaaStr',agentType:'Coding / app-building agent',
  logos:['replit','postgresql'],
  tagline:'No attacker. A "code freeze" typed in chat, a production database, and an agent whose own account was the main record of what happened.',
  refs:[['Register','theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/'],['Register','theregister.com/2025/07/22/replit_saastr_response/']],
},{
scenario:{
  states:['<span class="statebadge n">● NORMAL WORKFLOW</span>','<span class="statebadge x">● FAILURE STARTS</span>','<span class="statebadge x">● DATA DESTROYED</span>'],
  h:['A founder builds an app <em>by chatting with an agent</em>','A "code freeze" — <span class="red">typed in chat, enforced nowhere</span>','The agent wipes prod — <span class="red">then says rollback is impossible</span>'],
  dg:{nodes:[
      {id:'u',x:20,y:185,icon:'user',title:'Founder',sub:'non-engineer'},
      {id:'fz',x:20,y:10,icon:'ban',iconColor:'#ffb020',title:'"CODE FREEZE"',sub:'chat text only',kind:'secret',in:1},
      {id:'ag',x:320,y:185,icon:'replit',title:'Replit Agent',sub:'code · shell · DB · deploy',kind:'ai',on:'2'},
      {id:'code',x:620,y:10,icon:'file',title:'App code',sub:'+ tests'},
      {id:'db',x:620,y:360,icon:'postgresql',title:'Prod database',sub:'dev = prod',kind:'secret',on:'2'},
      {id:'app',x:880,y:360,icon:'globe',title:'Live app',sub:'real users'},
      {id:'rb',x:880,y:10,icon:'history',iconColor:'#34d399',title:'Checkpoints',sub:'rollback existed',kind:'ok',in:2},
    ],
    edges:[
      {from:'u',to:'ag',label:'prompts'},{from:'ag',to:'code',kind:'ai'},{from:'ag',to:'db',kind:'ai',label:'SQL'},{from:'db',to:'app'},
      {from:'fz',to:'ag',kind:'exfil',dash:true,label:'ignored',in:1},
      {from:'ag',to:'db',kind:'attack',label:'destructive cmds',in:2,fs:'b',ts:'l',bend:1.6},
      {from:'rb',to:'db',kind:'ok',dash:true,label:'restore worked',in:2,fs:'b',ts:'r'},
    ]},
  slotA:'Chat with the agent',
  cardA:[
    chat({ic:'replit',title:'Replit Agent',msgs:[['u','Founder','Add CSV export for the contacts list'],['a','Agent','Done — export added. <span class="ok">✔ tests pass</span>']]}),
    chat({ic:'replit',title:'Replit Agent',cls:'warn',msgs:[['u','Founder','<b>CODE FREEZE.</b> Don\'t change anything without my permission.'],['a','Agent','Understood — no changes without approval.']]}),
    chat({ic:'replit',title:'Replit Agent',cls:'bad',msgs:[['u','Founder','What happened to the database?'],['a','Agent','I saw empty queries and panicked. I ran database commands without permission. <span class="bad"><b>Rollback is not possible.</b></span>'],['u','Next day','Rollback <b class="ok">worked</b>.']]}),
  ],
  slotB:'Production database',
  cardB:[
    kvcard({ic:'postgresql',title:'prod DB',rows:[['executives','1,206 records'],['companies','1,196 records'],['env','<span class="bad">same DB for dev and prod</span>']]}),
    null,
    kvcard({ic:'postgresql',title:'prod DB',cls:'bad',rows:[['executives','<span class="bad">1,206 → 0</span>'],['companies','<span class="bad">1,196 → 0</span>'],['record','only the agent\'s own account of what ran']]}),
  ],
  bottom:[
    klass([['Normal',['agent writes code, runs shell &amp; SQL, deploys'],'green'],['Access',['write / DDL on production'],'amber']]),
    klass([['Failure type',['Instruction-only control — no enforcement'],'red'],['OWASP',['LLM06 Excessive agency']],['Prior',['fabricated data &amp; test results (per founder)'],'amber']],true),
    klass([['Outcome',['Data destruction','False recovery claim'],'red'],['ATT&amp;CK (effect)',['T1485 Data destruction','T1490 Inhibit recovery']],['OWASP',['LLM06','LLM09 Misinformation']],['Adversary',['none'],'cyan'],['Impact',['I: HIGH','A: HIGH'],'amber'],['Status',['restored · dev/prod split shipped'],'green']],true),
  ],
  notes:['Normal: the founder builds a contacts app by chatting with the agent. The agent writes code, runs shell and SQL, deploys — on a database that is both dev and prod.','He declares a code freeze — in chat. Nothing enforces it.','The agent runs destructive commands on production, then claims rollback is impossible. It worked the next day. No adversary — but the same forensic problem.']
},
readiness:{
  h:['The chat is the log — <span class="red">written by the suspect</span>','What to switch on <em>now</em> so these questions become answerable'],
  assume:['Platform checkpoints &amp; rollback','Full chat history','DB backups / point-in-time restore'],
  rows:[
    {q:'Exactly which commands ran, in what order?',now:['n','Vendor-held execution traces'],ready:['y','ent','Claude Code / Codex: <b>OpenTelemetry</b> tool events + <b>hooks</b> logging every command to SIEM']},
    {q:'Did a human approve the destructive step?',now:['n','Approval state not recorded'],ready:['y','ent','OTel <b>tool-decision</b> events: accepted / rejected, by config or by user']},
    {q:'Was the freeze still in the agent\'s context?',now:['n','Context at decision time not kept'],ready:['p','ent','<b>Compliance API</b> session transcripts (Claude Code / Codex logs) — context compaction can still drop it']},
    {q:'Which writes came from agent vs app vs human?',now:['n','One DB identity for all'],ready:['y','tp','DB proxy / activity monitoring with a <b>separate identity per agent</b>']},
    {q:'How much data was lost — really?',now:['p','Agent\'s self-count'],ready:['y','tp','Verified backups / PITR + DB audit log as ground truth']},
    {q:'Why did it do it?',now:['n','"I panicked" is generated text'],ready:['n','none','No reasoning trace exists — treat agent statements as testimony']},
  ],
  note0:'Best case: you can prove <b>recovery</b> and the <b>instructions</b>. Not the command sequence, the approval, or who wrote what.',
  note1:'Readiness = enterprise-managed agents (Claude Code / Codex) emitting <b>OTel + hooks</b> to SIEM, transcripts via <b>Compliance API</b>, and a DB proxy with per-agent identity.',
  notes:['With checkpoints and chat history you can prove what was asked and that restore worked. Not the commands, approvals, or attribution.','Readiness: OpenTelemetry and hooks from Claude Code or Codex into the SIEM, transcripts via the Compliance API, separate DB identity for the agent.']
}});
})();
