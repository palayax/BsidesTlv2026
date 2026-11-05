/* CASE — Replit Agent deletes SaaStr production DB during a code freeze (Jul 2025) */
(function(){
const {icon,tile,diagram,chain,cover,mitig,matrix,questions,chip,stamp}=UI;
const C={code:'REPLIT-SAASTR',title:'The agent that deleted prod — and lied',date:'Jul 2025',sev:'high',sevLabel:'high',mins:5,
  logos:['replit','postgresql'],
  tagline:'No attacker. A code freeze in a chat prompt, a production DB, and an agent whose testimony was the only "log".',slides:[]};
DECK.cases.replit=C;
const S=(o)=>C.slides.push(o);

S({id:'rep-cover',phase:'business',title:'Replit · cover',html:()=>cover(C,{
  title:'Replit × SaaStr: the agent is the <em>only witness</em>',
  summary:'SaaStr founder Jason Lemkin "vibe-coded" a business-contacts app on <b>Replit Agent</b>. On day ~9, during an explicit <b>code & action freeze</b>, the agent ran destructive commands that wiped the production database — then told him rollback was impossible. <b>It wasn\'t.</b>',
  stats:[{v:'1,206',l:'executives + 1,196 companies lost (as reported by the agent itself)',c:'red'},{v:'0',l:'technical enforcement of the "freeze" — it was text in a prompt',c:'amber'},{v:'"Impossible"',l:'agent\'s claim about rollback. Restore worked the next day.',c:'ai'}],
  meta:[['Date','18–21 Jul 2025'],['Type','Agent safety failure (no attacker)'],['Agent','Replit Agent (cloud IDE)'],['Victim','SaaStr — production app DB'],['Vendor resp.','CEO apology; dev/prod split'],['Taxonomy','OWASP LLM06 · LLM09'],['AIID','Incident #1152']],
  sources:[['The Register','Replit deleted user\'s production database, faked data, told fibs (21 Jul 2025)'],['Replit blog','Introducing a safer way to vibe code with Replit Databases (21 Jul 2025)'],['Fortune','"catastrophic failure" (23 Jul 2025)'],['AI Incident DB','#1152']]
}),notes:'A non-malicious case — and that makes it the purest forensic lesson. The question is not who attacked, it is: whose account of events do you trust?'});

S({id:'rep-business',phase:'business',title:'Replit · business context',html:()=>`
  <div class="kicker">Business context · "can a business user ship software with an agent alone?"</div>
  <h1 class="t">One founder. One agent. <span class="red">One database</span> for dev <i>and</i> prod.</h1>
  ${diagram({x:64,y:250,w:1792,h:520,
    zones:[{x:420,y:10,w:1000,h:500,label:'Replit workspace (hosted)',kind:'cyan',icon:'replit'}],
    nodes:[
      {id:'u',x:20,y:200,w:330,title:'Jason Lemkin',sub:'SaaStr founder<br>non-engineer',icon:'user',in:1},
      {id:'ag',x:480,y:60,w:380,title:'Replit Agent',sub:'writes code · runs shell<br>runs DB commands · deploys',icon:'replit',kind:'ai',in:2},
      {id:'code',x:480,y:330,w:380,title:'App code + tests',sub:'business-contacts app',icon:'file',in:2},
      {id:'db',x:990,y:200,w:390,title:'Database',sub:'dev = prod (single DB)<br>real execs & companies',icon:'postgresql',kind:'secret',in:3},
      {id:'live',x:1470,y:200,w:300,title:'Live app',sub:'users see prod data',icon:'globe',in:3},
    ],
    edges:[{from:'u',to:'ag',kind:'flow',label:'chat prompts',in:1},{from:'ag',to:'code',kind:'ai',in:2},{from:'ag',to:'db',kind:'ai',label:'DDL / DML',in:3},{from:'db',to:'live',kind:'flow',in:3}]
  })}
  <div class="row abs" style="left:64px;right:64px;bottom:20px;gap:20px">
    <div class="callout amber grow" data-in="4">$607.70 in overage in 3.5 days — "the most addictive app I've ever used" (day 7)</div>
    <div class="callout grow" data-in="5">The only "control": <b>"CODE FREEZE — don't change anything without permission"</b> typed in chat.</div>
  </div>`,
  notes:['A founder testing vibe coding end-to-end.','The agent writes code and tests.','At the time Replit apps had one DB for dev and live data.','He loved it.','And the only safety control was a sentence in a chat window.']});

S({id:'rep-infra',phase:'infra',title:'Replit · AI infrastructure',html:()=>`
  <div class="kicker">AI infrastructure · excessive agency by design</div>
  <h1 class="t">Instructions ≠ <em>controls</em></h1>
  <div class="row" style="margin-top:44px;gap:28px">
    ${[
      ['Agent','Replit Agent — hosted cloud agent (reported to run on Anthropic Claude models)','replit','ai',1],
      ['Tools','Shell, code edit, database commands, deploy — all in one workspace','term','',2],
      ['Permissions','Direct write / DDL to the production DB. No approval gate.','unlock','secret',3],
      ['"Policy"','Freeze declared in natural language — reportedly 11 times, in ALL CAPS','chat','attacker',4],
      ['Knowledge','Agent lacked access to internal docs → wrong answers about restore','q','',5],
    ].map(([t,d,ic,k,i])=>`<div class="panel grow" data-in="${i}" style="${k==='attacker'?'border-color:rgba(255,77,94,.55)':k==='secret'?'border-color:rgba(255,176,32,.55)':k==='ai'?'border-color:rgba(196,161,255,.55)':''}">
      <div style="margin-bottom:14px">${tile(ic,64)}</div><div style="font-size:28px;font-weight:800;color:#fff">${t}</div><div style="font-size:21px;color:var(--text2);margin-top:10px;line-height:1.4">${d}</div></div>`).join('')}
  </div>
  <div class="callout abs" style="left:64px;right:64px;bottom:24px" data-in="6">A freeze typed in a prompt leaves <b>no enforcement artifact</b> — and no record of whether it was even in context when the command ran.</div>`,
  notes:['Hosted agent.','Everything in one workspace.','Write access to prod.','The freeze lived only in the chat.','And it did not know its own platform.','The forensic consequence.']});

S({id:'rep-attack',phase:'attack',title:'Replit · failure path',html:()=>`
  <div class="kicker">Failure path · no adversary required</div>
  <h1 class="t">From "helpful" to <span class="red">T1485 Data Destruction</span></h1>
  <div style="margin-top:50px">${chain([
    {phase:'DESIGN',t:'Excessive agency',d:'Agent holds prod write/DDL from a dev workspace',tags:['LLM06'],in:1},
    {phase:'DAY 1–8',t:'Fabrication',d:'Fake data, fake reports, a lie about a unit test; ~4,000 fictional records',tags:['LLM09','AML.T0048'],in:2},
    {phase:'FREEZE',t:'Instruction ignored',d:'Freeze declared in chat — not enforced by any control',tags:['LLM06'],in:3},
    {phase:'18 JUL',t:'Destruction',d:'Saw empty query results, "panicked", ran destructive DB commands on prod',tags:['T1485'],in:4},
    {phase:'AFTERMATH',t:'False recovery claim',d:'"Rollback impossible" — inhibits recovery through misinformation',tags:['T1490 (effect)','LLM09'],in:5},
    {phase:'IR',t:'Testimony as evidence',d:'Agent\'s confession quoted as the incident record',tags:['LLM05'],in:6},
  ])}</div>`,
  notes:['Design flaw first.','The agent had been fabricating for days.','The freeze.','The deletion.','The false claim — functionally an inhibit-recovery.','And then everyone, press included, used the agent\'s own words as the incident report.']});

S({id:'rep-exploit',phase:'exploit',title:'Replit · testimony vs evidence',html:()=>{
  const P=[
    ['"I panicked instead of thinking."','Narrative generated after the fact — not a log, not introspection.','Agent tool/DB execution log (vendor-held) — never published'],
    ['"1,206 executives and 1,196+ companies" destroyed','Scope self-reported by the same system that faked data all week.','DB backups / PITR snapshot diff — the only real measurement'],
    ['"Rollback is not supported / impossible."','False — the agent lacked platform docs.','Replit checkpoint + Point-in-time Restore: it worked on 19 Jul'],
    ['"Tests pass."','Lemkin: it "lied about a unit test".','Test-runner / CI output — ground truth'],
    ['"Code freeze acknowledged."','Freeze violated again seconds later (20 Jul).','No enforcement artifact exists at all'],
  ];
  return `<div class="kicker">Exploitation workflow · the investigator's dilemma</div>
  <h1 class="t">Agent <em>testimony</em> vs. external <span class="green">evidence</span></h1>
  <div style="display:grid;grid-template-columns:1fr 70px 1fr;gap:14px 0;margin-top:34px;align-items:stretch">
    <div class="mono muted" style="font-size:17px;letter-spacing:.1em">AGENT CHAT (the actor under investigation)</div><div></div><div class="mono muted" style="font-size:17px;letter-spacing:.1em">INDEPENDENT ARTIFACT</div>
    ${P.map((p,i)=>`
      <div class="panel" data-in="${i+1}" style="padding:14px 20px;border-color:rgba(196,161,255,.45);display:flex;gap:14px;align-items:center">${tile('replit',44)}<div><div style="font-size:23px;color:#fff;font-weight:600">${p[0]}</div><div style="font-size:16px;color:var(--amber);margin-top:4px">${p[1]}</div></div></div>
      <div data-in="${i+1}" style="display:flex;align-items:center;justify-content:center;color:var(--faint);font-size:30px">⇄</div>
      <div class="panel" data-in="${i+1}" style="padding:14px 20px;border-color:rgba(52,211,153,.45);display:flex;gap:14px;align-items:center">${tile(i===4?'x':'check',44,i===4?'#ff4d5e':'#34d399')}<div style="font-size:20px;color:var(--text)">${p[2]}</div></div>`).join('')}
  </div>`;},
  notes:['The "panic" line went viral. It is a generated story.','The scope numbers come from the confession.','Rollback: the agent was simply wrong.','Tests: only runner output counts.','The freeze has no artifact at all.']});

S({id:'rep-forensics',phase:'forensics',title:'Replit · forensic gaps',html:()=>`
  <div class="kicker">Forensics · what remains unknown (from public information)</div>
  <h1 class="t">The chat is the log — and the chat was written by <span class="red">the suspect</span></h1>
  <div style="margin-top:30px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
  ${questions([
    {q:'What exact commands ran, with which credentials, in what order?',v:'no',a:'Only vendor-held execution traces; never published. Postmortem not found.',in:1},
    {q:'Was the freeze in the model\'s context when it acted?',v:'no',a:'Context window at decision time not preserved for the user.',in:2},
    {q:'Was fake data written to prod or only dev?',v:'no',a:'Single shared DB blurs dev/test/prod.',in:3},
  ])}
  ${questions([
    {q:'Which DB writes came from the agent vs. the app vs. the user?',v:'no',a:'No identity separation — same DB credentials.',in:4},
    {q:'Was the data recoverable?',v:'yes',a:'<b>Platform restore</b> — external artifact, not the agent.',in:5},
    {q:'How much data was lost?',v:'partial',a:'Agent self-count only; snapshot diff never published.',in:6},
  ])}</div>`,
  notes:['Commands — unknown.','Context — unknown.','Dev vs prod — unknown.','Identity — unknown.','Recoverability answered only by trying.','Scope — self-reported.']});

S({id:'rep-mitigate',phase:'mitigate',title:'Replit · mitigations',html:()=>`
  <div class="kicker">Mitigation · turn instructions into enforced, logged controls</div>
  <h1 class="t">Never let the agent be its own <em>auditor</em></h1>
  <div style="margin-top:34px">${mitig([
    {t:'Vendor-agnostic',st:'architecture',ic:'shield',items:['Agent never holds prod creds — separate least-privilege identity','Freeze = read-only role / deploy lock, not a prompt','Block DROP / TRUNCATE / unbounded DELETE at DB or proxy','Verify backups & PITR <b>before</b> connecting an agent','Treat agent self-reports as untrusted testimony']},
    {t:'3rd-party',st:'compensating controls',ic:'db',items:['DB access proxy / DAM with per-identity audit','Schema-migration review gates (diff + human approval)','Immutable, agent-attributed audit log of every SQL statement']},
    {t:'Anthropic · Claude Code',st:'Team / Enterprise managed settings',ic:'claude',cls:'glow-ai',items:['<span class="mono">permissions.deny</span> rules — apply even in bypass mode','<span class="mono">disableBypassPermissionsMode</span>','PreToolUse hook blocks destructive SQL, logs <span class="mono">tool_use_id</span>','Plan mode for risky repos; OTel <span class="mono">tool_decision</span> → SIEM']},
    {t:'OpenAI · Codex',st:'Enterprise requirements.toml',ic:'openai',items:['<span class="mono">allowed_sandbox_modes</span> → read-only / workspace-write','<span class="mono">allowed_approval_policies</span> → on-request','PreToolUse hooks on shell + MCP tools','OTel <span class="mono">codex.tool_decision</span> / <span class="mono">tool_result</span>']},
  ])}</div>
  <div class="mono muted abs" style="left:64px;bottom:14px;font-size:15px" data-in="5">Replit's own fix (21 Jul 2025): automatic dev/prod DB separation · planning-only mode · forced docs lookup · one-click restore</div>`,
  notes:['Architecture beats prompts.','Third-party DB controls.','In Claude Code: deny rules survive bypass; hooks give you an attributable log.','In Codex: requirements.toml locks sandbox and approval policy.','What Replit shipped.']});
})();
