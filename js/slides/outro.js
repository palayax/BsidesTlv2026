/* =========================================================================
   OUTRO — gap taxonomy, who-sees-what, vendor comparison (Anthropic / OpenAI),
   forensic-readiness blueprint, takeaways, thank-you.
   Sources: code.claude.com/docs, platform.claude.com/docs (Compliance API),
   support.claude.com, learn.chatgpt.com / developers.openai.com (Codex).
   See research/09_artifacts_and_vendor_controls.md. Re-verify before the talk.
   ========================================================================= */
(function(){
const {icon,tile,mitig,matrix,chip,stamp,src}=UI;
DECK.defaultOrder=['postmark','replit','gtg1002'];

DECK.outro.push({
  id:'gaps', title:'The 8 forensic gaps', section:'Synthesis · forensic gaps',
  html:()=>{
    const G=[
      ['G1','Instruction provenance','Which input made it act — the human, a repo instruction file, an issue, a web page, a tool result?','chat'],
      ['G2','Intent &amp; reasoning','Why did it choose that action? Inference runs at the vendor and is not replayable.','brain'],
      ['G3','Ephemeral execution','CI runners, scripted runs, cloud sessions — the transcript dies with the runner.','clock'],
      ['G4','Fragile local transcripts','Local, user-deletable, auto-purged (Claude Code default: 30 days), not encrypted at rest.','file'],
      ['G5','Request ≠ effect','Agent logs show what it <b>asked</b> a tool to do — not what the tool or OS actually did.','layers'],
      ['G6','Tool-layer blind spot','MCP servers and connectors run as code you didn\'t write, outside the agent\'s view.','plug'],
      ['G7','Borrowed identity','The agent acts with the human\'s tokens — logs can\'t tell human from agent.','fingerprint'],
      ['G8','Vendor-held evidence','The richest record sits with the AI vendor — scope, retention and access vary by plan.','cloud'],
    ];
    return `<div class="kicker">Synthesis · across all cases</div>
    <h1 class="t">Eight recurring <em>forensic gaps</em></h1>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:36px">
      ${G.map((g,i)=>`<div class="panel" data-in="${Math.floor(i/2)+1}" style="padding:20px 22px;min-height:290px">
        <div class="row" style="justify-content:space-between;align-items:center"><span class="mono" style="color:var(--red);font-size:20px;font-weight:700">${g[0]}</span><span style="color:var(--cyan)">${icon(g[3],40)}</span></div>
        <div style="font-size:26px;font-weight:800;color:#fff;margin:12px 0 10px;line-height:1.15">${g[1]}</div>
        <div style="font-size:19px;color:var(--text2);line-height:1.4">${g[2]}</div></div>`).join('')}
    </div>`;
  },
  notes:['Two at a time. Provenance and intent — the causal links.','Ephemeral runs and fragile transcripts — evidence that disappears.','Request vs effect, and the tool layer — postmark in one sentence.','Borrowed identity and vendor-held evidence — GTG-1002 and Replit.']
});

DECK.outro.push({
  id:'whosees', title:'Who sees which link', section:'Synthesis · visibility',
  html:()=>`
  <div class="kicker">Synthesis · the evidence chain vs. your telemetry</div>
  <h1 class="t">Which source answers which <em>question</em>?</h1>
  <div style="margin-top:30px">${matrix(['01 Input','02 Context','03 Decision','04 Action','05 Effect'],[
    {q:'EDR / OS telemetry',cells:['n','n','n',['p','process only'],'y'],in:1},
    {q:'Network proxy / DNS',cells:['n','n','n','n',['p','destinations']],in:1},
    {q:'SaaS / cloud audit logs',cells:['n','n','n','n','y'],in:2},
    {q:'Local agent transcript',cells:['y',['p','until compaction'],['p','summaries'],'y',['n','request only']],in:3},
    {q:'Hooks / OTel → SIEM',cells:[['p','if enabled'],'n','n','y',['p','tool result']],in:4},
    {q:'Vendor compliance export',cells:['y',['p','tool results'],['p','responses'],'y',['n','"not what occurred on the device"']],in:5},
  ],{style:'font-size:19px'})}</div>
  <div class="callout abs" style="left:64px;right:64px;bottom:18px" data-in="6">No single source covers the chain. Forensic readiness = <b>joining</b> them on <span class="mono">session_id</span> · <span class="mono">tool_use_id</span> · user · host · time.</div>`,
  notes:['Classic tooling sees effects.','SaaS audit sees effects.','Local transcripts see inputs and actions — if they survive.','Hooks and OTel make the action link durable.','Vendor exports — Anthropic says it plainly: what Claude was asked and returned, not what occurred on the device.','The answer is correlation.']
});

DECK.outro.push({
  id:'vendors', title:'Anthropic vs OpenAI — enterprise controls', section:'Vendor capabilities',
  html:()=>{
    const R=[
      ['Org audit log','<b>Audit log export</b> (Enterprise) — 180 days of admin / auth events, no content','<b>Compliance Logs</b> — admin audit, auth, Codex usage logs (Enterprise / Edu)'],
      ['Session content','<b>Compliance API</b> — Claude Code local session transcripts when signed in with Enterprise; long retention','<b>Compliance API</b> — conversations + <span class="mono">codex_log</span> records'],
      ['Real-time interception','<b>Inference hooks</b> (Enterprise) — transcript sent to your server before inference / tool calls','<b>MCP hooks</b> on the cloud coordinator; local hooks'],
      ['Agent telemetry','<b>Claude Code OpenTelemetry</b> — prompt, tool decision, tool result events','<b>Codex OpenTelemetry</b> — user_prompt, tool_decision, tool_result events'],
      ['Endpoint policy','<b>Managed / server-managed settings</b> — deny rules, disable bypass modes, enforce retention','<b>requirements.toml</b> — allowed sandbox &amp; approval modes, enforce OTel'],
      ['Tool governance','Managed MCP allow / deny lists, managed hooks only, marketplace restrictions','<span class="mono">mcp_servers</span> allow-list, managed hooks only'],
      ['Caveats','Not retroactive · ZDR &amp; cloud sessions excluded · OTel content off by default','"Not a complete record of local actions" · OTel prompts redacted by default'],
    ];
    return `<div class="kicker">Vendor capabilities · enterprise tier</div>
    <h1 class="t">What the vendors give you <em>today</em></h1>
    <div class="vend" style="margin-top:26px;grid-template-columns:270px 1fr 1fr">
      <div></div><div class="vh">${tile('claude',44)} Anthropic · Claude Enterprise</div><div class="vh">${tile('openai',44)} OpenAI · ChatGPT Enterprise / Codex</div>
      ${R.map((r,i)=>`<div class="vr" data-in="${i+1}">${r[0]}</div><div class="vc" data-in="${i+1}"${i===6?' style="border-color:rgba(255,176,32,.5)"':''}>${r[1]}</div><div class="vc" data-in="${i+1}"${i===6?' style="border-color:rgba(255,176,32,.5)"':''}>${r[2]}</div>`).join('')}
    </div>
    <div class="mono muted abs" style="left:64px;bottom:12px;font-size:14px">Sources: platform.claude.com (Compliance API) · code.claude.com (settings, hooks, monitoring) · learn.chatgpt.com / developers.openai.com (Codex governance, config). Feature names change — re-verify.</div>`;
  },
  notes:['Org audit.','Session content — the big one. Enable it before you need it: not retroactive.','Real-time interception.','Telemetry — both off or redacted by default.','Endpoint policy.','Tool governance.','The caveats — read the fine print.']
});

DECK.outro.push({
  id:'blueprint', title:'Forensic readiness blueprint', section:'Mitigation · vendor-agnostic',
  html:()=>`
  <div class="kicker">Mitigation · vendor-agnostic forensic readiness</div>
  <h1 class="t">Make the agent <em>investigable</em> before the incident</h1>
  <div style="margin-top:34px">${mitig([
    {t:'1 · Inventory',st:'know what runs',ic:'search',items:['Which agents, on which hosts, signed in to which account','MCP servers / connectors / skills (AI-BOM)','Force org accounts — no personal logins on corp devices']},
    {t:'2 · Constrain',st:'reduce blast radius',ic:'lock',items:['Central policy: no bypass / auto-approve modes','Sandbox + egress allow-lists','Agents never hold prod credentials; separate identities']},
    {t:'3 · Record',st:'durable evidence',ic:'log',items:['Hooks / OTel → SIEM on every tool call','Ship transcripts off-host; raise retention','Enable vendor compliance exports now']},
    {t:'4 · Correlate',st:'join the chain',ic:'link',items:['Join on session · tool call · user · host · time','Tool request ↔ SaaS / OS effect','IR playbook: agent artifacts to collect first']},
  ])}</div>`,
  notes:['Inventory.','Constrain.','Record.','Correlate.']
});

DECK.outro.push({
  id:'takeaways', title:'Takeaways', section:'Takeaways',
  html:()=>`
  <div class="kicker">Takeaways</div>
  <h1 class="t">Three things to do <em>on Monday</em></h1>
  <div class="row" style="margin-top:50px;gap:28px">
    ${[['01','Treat agent output as testimony','Verify every agent claim against an independent artifact.','eye'],
       ['02','Turn on the evidence before you need it','Compliance exports and telemetry are not retroactive.','history'],
       ['03','Log the request <i>and</i> the effect','Correlate tool calls with OS, cloud and SaaS logs.','link']]
      .map(([n,t,d,ic],i)=>`<div class="panel grow" data-in="${i+1}" style="padding:30px"><div class="row" style="justify-content:space-between"><span class="mono" style="font-size:48px;color:var(--red);font-weight:800">${n}</span><span style="color:var(--cyan)">${icon(ic,52)}</span></div><div style="font-size:34px;font-weight:800;color:#fff;margin:18px 0 12px;line-height:1.15">${t}</div><div style="font-size:23px;color:var(--text2);line-height:1.4">${d}</div></div>`).join('')}
  </div>`,
  notes:['Replit lesson.','GTG and postmark lesson — enable now.','The core gap: request vs effect.']
});

DECK.outro.push({
  id:'thanks', title:'Thank you', section:'Thank you',
  html:()=>`
  <div class="abs" style="left:64px;top:120px;width:1100px">
    <div class="kicker">BSides TLV 2026 <span class="tag">AI VILLAGE</span></div>
    <h1 class="t" style="font-size:110px">Thank you<span class="red">.</span></h1>
    <div class="sub" style="font-size:34px;margin-top:24px">Questions?</div>
    <div style="margin-top:60px;font-size:34px;color:#fff;font-weight:800">${SPEAKER.name}</div>
    <div class="sub" style="font-size:24px;margin-top:6px">${SPEAKER.role}</div>
    <div class="mono cyan" style="margin-top:22px;font-size:22px">${SPEAKER.handle}</div>
    <div class="mono muted" style="margin-top:14px;font-size:20px">Slides &amp; sources: palayax.github.io/BsidesTlv2026</div>
  </div>
  <div class="abs" style="right:110px;top:170px;display:flex;flex-direction:column;align-items:center;gap:28px">
    <div style="width:380px;height:440px;border-radius:24px;border:2px solid var(--line2);background:#0d1828 url('${SPEAKER.photo}') center 20%/cover"></div>
    <img src="${SPEAKER.logo}" alt="PALAYA" style="height:110px">
  </div>`,
  notes:'Thank you. Sources for every case are linked from the app.'
});
})();
