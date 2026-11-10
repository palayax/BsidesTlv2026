/* CASE — Replit Agent deletes SaaStr production DB during a code freeze (Jul 2025)
   Sources: The Register 21 & 22 Jul 2025; Replit statements; AI Incident Database #1152. Chat lines paraphrased. */
(function(){
const {chat,kvcard,klass}=KIT;
KIT.defineCase('replit',{
  code:'REPLIT-SAASTR',title:'The agent that deleted prod — and misreported it',date:'Jul 2025',sev:'high',sevLabel:'high',mins:5,
  org:'Replit Agent × SaaStr',agentType:'Coding / app-building agent',
  gap:'the agent\'s own account is the only record',
  logos:['replit','postgresql'],
  tagline:'No attacker. A "code freeze" typed in chat, a production database, and an agent whose own account was the main record of what happened.',
  refs:[['Register','theregister.com/2025/07/21/replit_saastr_vibe_coding_incident/'],['Register','theregister.com/2025/07/22/replit_saastr_response/']],
},{
scenario:{
  states:['<span class="statebadge n">● NORMAL WORKFLOW</span>','<span class="statebadge x">● FAILURE STARTS</span>','<span class="statebadge x">● DATA DESTROYED</span>'],
  h:['A founder builds an app <em>by chatting with an agent</em>','A "code freeze" — <span class="red">typed in chat, enforced nowhere</span>','The agent wipes prod — <span class="red">then says rollback is impossible</span>'],
  dg:{path:['u','fz','ag','db','rb'],
    nodes:[
      {id:'fz',x:0,y:0,icon:'ban',iconColor:'#ffb020',title:'"CODE FREEZE"',sub:'chat text only',kind:'secret',in:1},
      {id:'u',x:0,y:220,w:160,icon:'user',title:'Founder',sub:'non-engineer'},
      {id:'ag',x:290,y:220,icon:'replit',title:'Replit Agent',sub:'code · shell · DB',kind:'ai',on:'2'},
      {id:'code',x:580,y:0,icon:'file',title:'App code',sub:'+ tests'},
      {id:'db',x:580,y:440,icon:'postgresql',title:'Prod database',sub:'dev = prod',kind:'secret',on:'2'},
      {id:'app',x:870,y:220,icon:'globe',title:'Live app',sub:'real users'},
      {id:'rb',x:870,y:440,icon:'history',iconColor:'#34d399',title:'Checkpoints',sub:'restore worked',kind:'ok',in:2},
    ],
    edges:[
      {from:'u',to:'ag',n:1,label:'prompt',hot:true},
      {from:'ag',to:'code',kind:'ai',n:2,label:'code',fs:'t',ts:'l',fo:45},
      {from:'ag',to:'db',kind:'ai',n:3,label:'SQL',fs:'r',ts:'t'},
      {from:'db',to:'app',n:4,fs:'r',ts:'l',fo:-40},
      {from:'fz',to:'ag',kind:'exfil',dash:true,n:5,label:'ignored',in:1,fs:'r',ts:'t',tp:-45},
      {from:'ag',to:'db',kind:'attack',n:6,label:'destructive cmds',in:2,fs:'b',ts:'l'},
      {from:'rb',to:'db',kind:'ok',dash:true,n:7,in:2,fs:'l',ts:'r',fo:35,tp:35,hot:true},
    ]},
  slotA:'Chat with the agent',
  cardA:[
    chat({ic:'replit',title:'Replit Agent',msgs:[['u','Founder','Add CSV export for contacts'],['a','Agent','Done — export added. <span class="ok">✔ tests pass</span>']]}),
    chat({ic:'replit',title:'Replit Agent',cls:'warn',msgs:[['u','Founder','<b>CODE FREEZE.</b> No changes without my permission.'],['a','Agent','Understood — no changes without approval.']]}),
  ],
  slotB:'Production database',
  cardB:[
    kvcard({ic:'postgresql',title:'prod DB',rows:[['executives','1,206 records'],['companies','1,196 records'],['env','<span class="bad">same DB for dev and prod</span>']]}),
  ],
  input:'Agent: "I saw empty queries and panicked… <b>rollback is not possible</b>." Next day: rollback <b class="ok">worked</b>.',
  before:kvcard({ic:'postgresql',title:'prod DB · before',rows:[['executives','1,206 records'],['companies','1,196 records']]}),
  after:kvcard({ic:'postgresql',title:'prod DB · after',cls:'bad',rows:[['executives','<span class="diff">1,206 → 0</span>'],['companies','<span class="diff">1,196 → 0</span>'],['record','<span class="diff">only the agent\'s own account</span>']]}),
  bottom:[
    klass([['Normal',['agent writes code, runs shell &amp; SQL, deploys'],'green'],['Access',['write / DDL on production'],'amber']]),
    klass([['Failure',['Instruction-only control — no enforcement'],'red'],['OWASP',['LLM06 Excessive agency']],['Prior',['fabricated data &amp; test results (per founder)'],'amber']],true),
    klass([['Outcome',['Data destruction','False recovery claim'],'red'],['ATT&amp;CK (effect)',['T1485','T1490']],['OWASP',['LLM06','LLM09']],['Adversary',['none'],'cyan'],['Impact',['I:HIGH A:HIGH'],'amber'],['Status',['restored · dev/prod split shipped'],'green']],true),
  ],
  notes:['Normal: the founder prompts the agent (1); it writes code (2), runs SQL (3) on a database that is both dev and prod and serves the live app (4).','He declares a code freeze — in chat (5). Nothing enforces it.','The agent runs destructive commands on production (6). Right side: BEFORE and AFTER — 1,206 executives and 1,196 companies down to zero, and the only record is the agent\'s own account, which said rollback was impossible. Restore worked the next day (7). No adversary — the same forensic problem. T1485 data destruction, T1490 inhibit recovery, LLM09 misinformation.']
},
readiness:{
  h:['The chat is the log — <span class="red">written by the suspect</span>','What to switch on <em>now</em> — on the platform, and on Claude / ChatGPT'],
  assume:['Platform checkpoints &amp; rollback','Full chat history','DB backups / point-in-time restore'],
  plat:'DB or 3rd-party control',
  rows:[
    {q:'Exactly which commands ran, in what order?',now:['n','Vendor-held execution traces'],plat:['y','<b>DB audit log / DB proxy</b> records every statement'],ent:['y','Claude Code / Codex: <b>OpenTelemetry</b> tool events + <b>hooks</b> → SIEM']},
    {q:'Did a human approve the destructive step?',now:['n','Approval state not recorded'],plat:['n','No outside view of in-agent approvals'],ent:['y','OTel <b>tool_decision</b> events: accepted / rejected, by config or by user']},
    {q:'Was the freeze still in the agent\'s context?',now:['n','Context at decision time not kept'],plat:['n','No outside view of the agent\'s context'],ent:['p','<b>Compliance API</b> session transcripts — compaction can still drop it']},
    {q:'How much data was lost — really?',now:['p','The agent\'s own count'],plat:['y','Verified backups / PITR + DB audit log as ground truth'],ent:['p','Transcript is still the agent\'s testimony — verify in the DB']},
  ],
  note0:'Best case: you can prove <b>recovery</b> and the <b>instructions</b>. Not the command sequence, the approval, or the agent\'s context.',
  note1:'Readiness = DB-side ground truth (audit log, proxy with a separate agent identity) + agent telemetry from an enterprise-managed coding agent.',
  notes:['With checkpoints and chat history you can prove what was asked and that restore worked. Not the commands, the approvals, or what the agent had in context.','Readiness: the DB audit log or a DB proxy gives the statements, ideally under a separate identity for the agent. If the same workflow used Claude Code or Codex under an enterprise account: OpenTelemetry tool and tool_decision events, hooks, and Compliance API transcripts. The agent\'s own words remain testimony.']
},
score:{who:['n','y'],act:['n','y'],effect:['p','y'],input:['n','p'],why:['n','n']}
});
})();
