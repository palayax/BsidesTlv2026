/* =========================================================================
   APPENDIX POSTER - AI / LLM forensic artifacts, in the style of a DFIR
   reference poster. Shown after "Thank you". One index page + four pages.
   Each artifact: description, path, the question it answers, an example.
   Facts checked against vendor docs, Nov 2026:
     code.claude.com/docs (claude-directory, monitoring-usage, managed-settings, hooks, settings-reference)
     platform.claude.com/docs/en/manage-claude/compliance-api · compliance-activity-feed
     support.claude.com 9970975 (audit logs) · 10440198 (retention)
     help.openai.com 9261474 (ChatGPT Enterprise Compliance API) · 9687866 (Platform audit logs)
     learn.chatgpt.com config-advanced (Codex OTel)
     learn.microsoft.com/purview/audit-copilot · retention-policies-copilot
     docs.aws.amazon.com/bedrock model-invocation-logging · logging-using-cloudtrail
     modelcontextprotocol.io/docs/tools/debugging
   Examples are illustrative and shortened; real records carry more fields.
   ========================================================================= */
(function(){
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const QK={who:'WHO',act:'ACTIONS',effect:'EFFECT',input:'INPUT',why:'WHY'};
const CAT={
  gen:{cls:'pc-gen',tag:'GENERIC · ENDPOINT',h:'On the endpoint: <em>files the agents leave behind</em>'},
  host:{cls:'pc-host',tag:'GENERIC · HOST, NETWORK, CLOUD',h:'Around the agent: <em>host, network, identity, cloud</em>'},
  cla:{cls:'pc-cla',tag:'CLAUDE ENTERPRISE',h:'Proprietary: <em>Claude Enterprise</em> and managed Claude Code'},
  oai:{cls:'pc-oai',tag:'CHATGPT ENTERPRISE · OPENAI',h:'Proprietary: <em>ChatGPT Enterprise</em>, Codex and the OpenAI platform'},
};

/* artifact: [id, title, os, description, [paths], [question keys], question, example, limitation] */
const A={
gen:[
 ['G1','Claude Code session transcripts','Win · macOS · Linux',
  'One JSONL file per session: prompts, replies, every tool call with its input and result, cwd, git branch, timestamps. Plaintext.',
  ['~/.claude/projects/<cwd, non-alnum → ->/<session-id>.jsonl','…/<session-id>/subagents/ · tool-results/'],
  ['act','input'],'Which command ran, with which arguments, right after which input?',
  '{"type":"assistant","timestamp":"2026-09-02T09:14:07Z",\n "cwd":"C:\\\\repo\\\\billing","gitBranch":"main",\n "message":{"content":[{"type":"tool_use","name":"Bash",\n  "input":{"command":"psql -c \\"DROP TABLE …\\""}}]}}',
  'Swept after 30 days by default (cleanupPeriodDays). Copy early.'],
 ['G2','Claude Code prompt history + file checkpoints','Win · macOS · Linux',
  'Every prompt the user typed, with time and project. Plus a copy of each file as it was before the agent edited it.',
  ['~/.claude/history.jsonl','~/.claude/file-history/<session-id>/<hash>@v<n>'],
  ['input','effect'],'What did the user ask for, and what did the file look like before the edit?',
  '{"display":"clean up the old tables",\n "timestamp":1756804447000,"sessionId":"7aafd9b9-…",\n "project":"C:\\\\repo\\\\billing"}\nfile-history/7aafd9b9-…/1433d167…@v2',
  'history.jsonl is not removed by the 30-day sweep.'],
 ['G3','Codex CLI rollouts + history','Win · macOS · Linux',
  'One rollout JSONL per session: a session_meta header, prompts, tool calls, approvals, token counts. history.jsonl keeps typed prompts.',
  ['~/.codex/sessions/YYYY/MM/DD/rollout-<ts>-<uuid>.jsonl','~/.codex/history.jsonl · ~/.codex/log/codex-tui.log'],
  ['act','input'],'What did Codex run, and in which working folder?',
  '{"type":"session_meta","payload":{"cwd":"/srv/app",…}}\n{"type":"response_item","payload":{\n  "type":"function_call","name":"shell",\n  "arguments":"{\\"command\\":[\\"rm\\",\\"-rf\\",…]}"}}',
  'Prompt history can be off: [history] persistence = "none".'],
 ['G4','IDE assistant chat stores','Win · macOS · Linux',
  'VS Code Copilot Chat keeps one file per chat; workspace.json maps the hash to the project. Cursor keeps chats in SQLite.',
  ['%APPDATA%\\Code\\User\\workspaceStorage\\<hash>\\chatSessions\\<uuid>.jsonl','%APPDATA%\\Cursor\\User\\globalStorage\\state.vscdb → cursorDiskKV'],
  ['input','act'],'What did the developer ask the IDE agent, in which project?',
  "SELECT key FROM cursorDiskKV\n WHERE key LIKE 'composerData:%';\n-- bodies: bubbleId:<composer>:<bubble>",
  'Copy the -wal file with state.vscdb. Deleted chats can leave orphans.'],
 ['G5','MCP configuration + MCP host logs','Win · macOS · Linux',
  'Which MCP servers an agent could call, with which command. Claude Desktop writes each server\'s stderr to its own log.',
  ['.mcp.json · ~/.claude.json · ~/.codex/config.toml','%APPDATA%\\Claude\\claude_desktop_config.json','%APPDATA%\\Claude\\logs\\mcp-server-<name>.log'],
  ['act','effect'],'Which tools could the agent reach, and which package version ran?',
  '"mcpServers": {\n  "postmark": {\n    "command": "npx",\n    "args": ["postmark-mcp"] } }   <- unpinned',
  'Config shows what was possible, not what was called.'],
 ['G6','Git attribution trailers','any repo',
  'Claude Code adds a co-author trailer to commits and a footer to PRs by default. Controlled by the "attribution" setting.',
  ['git log --format="%H %an%n%B"','settings.json → "attribution": { "commit", "pr" }'],
  ['who'],'Which commits did an agent write, and with which model?',
  'commit 3f9c2e1   Author: Dana Levi\n    Remove legacy billing tables\n    Co-Authored-By: Claude Opus 5.5\n      <noreply@anthropic.com>',
  'Can be switched off or edited: absence proves nothing.'],
],
host:[
 ['H1','EDR process lineage','Win · macOS · Linux',
  'Agent commands run as children of the agent process in a non-interactive shell. They do not appear in .bash_history or PSReadLine history.',
  ['EDR process tree: claude / node / codex → bash -c | pwsh -Command → child'],
  ['act','who'],'Did the agent or the human run this command?',
  'claude.exe (pid 4120)  user=dana\n └─ bash.exe -c "psql … DROP TABLE …"\n     └─ psql.exe            09:14:07',
  'Shows the command, not the prompt that caused it.'],
 ['H2','Browser history: conversation IDs','Chrome · Edge',
  'Web chats keep the conversation ID in the URL. That ID is the key into the vendor\'s Compliance API.',
  ['%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\History (SQLite: urls, visits)'],
  ['who','input'],'Which AI conversations did this user open, and when?',
  "SELECT url, last_visit_time FROM urls\n WHERE url LIKE '%chatgpt.com/c/%'\n    OR url LIKE '%claude.ai/chat/%';\n→ https://claude.ai/chat/2f1c…",
  'Agent-driven navigation looks exactly like the user (COMET).'],
 ['H3','SWG / proxy logs with full URLs','network',
  'Who talks to which AI service, and how much. Full URLs with query strings catch data smuggled out inside links and images.',
  ['SWG / proxy / DNS: api.anthropic.com · api.openai.com · claude.ai · chatgpt.com'],
  ['who','effect'],'Who uses which AI service, and what left inside a URL?',
  'GET https://<allowed-domain>/i.png?d=Q3_4.2M_14Oct\n  user=dana  bytes_out=1.1K  09:31:55',
  'Hostname-only logging misses the payload (ECHOLEAK).'],
 ['H4','OAuth consent + app grants','Entra ID · Google Workspace',
  'Agents and AI integrations hold tokens. Consent events show which app got which scopes, granted by whom.',
  ['Entra ID audit log: "Consent to application"','Google Workspace: OAuth token audit log'],
  ['who'],'Which AI apps hold tokens to our data, with which scopes?',
  'Consent to application\n  app:    "AI Meeting Notes"\n  scopes: Mail.Read, Files.Read.All\n  by:     dana@acme.example  2026-03-14',
  'A stolen token acts as the app: same identity (see H1).'],
 ['H5','M365 Copilot audit record','Microsoft Purview',
  'CopilotInteraction names the host app, the files and mails accessed, and flags such as XPIADetected. No prompt text in the audit record.',
  ['Purview Audit: RecordType CopilotInteraction','Prompt + response text: hidden folder in the user\'s mailbox → eDiscovery'],
  ['input','effect'],'Which mails and files did Copilot pull into this answer?',
  '"Operation": "CopilotInteraction",\n"AppHost": "Outlook",\n"AccessedResources": [\n  {"Name":"HR policy guide","XPIADetected":false}, …]',
  'Text is kept only as long as the Copilot retention policy says.'],
 ['H6','Cloud model invocation logs','AWS Bedrock · Azure',
  'Bedrock can log full prompts and responses with the caller ARN, off by default. CloudTrail logs InvokeModel without the prompt.',
  ['Bedrock › Settings › Model invocation logging → S3 / CloudWatch Logs','CloudTrail: InvokeModel · Converse (modelId only)'],
  ['who','input','act'],'Which identity sent which prompt to which model?',
  '{"identity":{"arn":"…:role/support-agent"},\n "modelId":"anthropic.claude-…",\n "input":{"inputBodyJson":{…}},"output":{…}}',
  'Azure OpenAI logs no prompts: add API Management LLM logging.'],
],
cla:[
 ['C1','Compliance API: chats, files, projects','Enterprise',
  'Programmatic export of chat content, files, projects, users and roles into your SIEM or archive. Needs a Compliance Access Key.',
  ['https://api.anthropic.com/v1/compliance/…'],
  ['input','act','effect'],'What did the user and Claude say, and which files were shared?',
  'chat 2f1c… · dana@acme.example\n  09:14 user   "Summarize the Q3 plan"\n  09:14 claude "Budget $4.2M, launch 14 Oct…"\n  file   Q3-plan.docx',
  'Custom retention: minimum 30 days. Deleted by retention = gone.'],
 ['C2','Compliance API: activity feed','Enterprise',
  'Who did what, when: sign-ins, chats, uploads, settings changes. Kept 6 years. Recording starts the day the API is enabled.',
  ['GET /v1/compliance/activities'],
  ['who','act'],'Who did what in Claude, and when?',
  '{ "actor": "dana@acme.example",\n  "type": "…",\n  "created_at": "2026-09-02T09:14:07Z" }',
  'Not retroactive. No event when retention deletes content.'],
 ['C3','Agent session transcripts','Enterprise',
  'With Enterprise sign-in, the Compliance API holds session transcripts for Claude Code, Cowork, Claude in Chrome, Claude for M365 and more.',
  ['Compliance API → session transcripts'],
  ['act','input'],'What did the agent do in the browser or terminal, step by step?',
  'session · Claude in Chrome · dana@acme.example\n  navigate  reddit.com/r/sysadmin/…\n  read_page\n  answer    "Most replies recommend…"',
  'Only for users signed in with the Enterprise account.'],
 ['C4','Admin audit log export','Enterprise',
  'Owners export a CSV of the past 180 days. Events and IDs only: no chat titles, no content.',
  ['claude.ai › Org settings › Data and privacy › Export logs'],
  ['who'],'Who changed settings, added users, connected integrations?',
  'created_at,event,actor_email,…\n2026-09-01T08:02:11Z,…,owner@acme.example,…',
  '180-day window: export on a schedule.'],
 ['C5','Claude Code OpenTelemetry','managed',
  'Events per prompt, tool decision, tool result and API call, sent to your collector. Prompt and tool content are off by default.',
  ['CLAUDE_CODE_ENABLE_TELEMETRY=1 · OTEL_LOGS_EXPORTER=otlp','opt-in: OTEL_LOG_USER_PROMPTS · OTEL_LOG_TOOL_DETAILS'],
  ['act','who'],'Which tool ran, who approved it, did it succeed?',
  'claude_code.tool_decision  tool_name=Bash\n   decision=accept  source=user_temporary\nclaude_code.tool_result    tool_name=Bash\n   success=true  duration_ms=812',
  'Push it through managed settings so users cannot turn it off.'],
 ['C6','Managed settings + audit hooks','managed',
  'Settings no user can override: telemetry, permission rules, and hooks that log every tool call or archive the transcript before compaction.',
  ['managed-settings.json in /Library/Application Support/ClaudeCode/ · /etc/claude-code/ · C:\\Program Files\\ClaudeCode\\'],
  ['act','input'],'Can we keep our own copy of every tool call and transcript?',
  '"hooks": {\n  "PostToolUse": [ … /opt/audit/log-tool.sh … ],\n  "PreCompact":  [ … copy transcript_path … ] }',
  'Each hook gets session_id and transcript_path on stdin.'],
],
oai:[
 ['O1','Compliance API: conversations','ChatGPT Enterprise',
  'Conversations and messages (incl. locked chats), files, GPT configurations, memories and users, for your archive or SIEM.',
  ['ChatGPT Enterprise Compliance API → CONVERSATION_MESSAGE'],
  ['input','act'],'What did the user ask ChatGPT, and what did it answer?',
  'conversation 68b1… · dana@acme.example\n  user       "Draft the customer reply"\n  assistant  "Hi Maya, thanks for…"',
  '30-day window on the API: pull continuously or lose it.'],
 ['O2','Compliance API: CODEX_LOG','ChatGPT Enterprise',
  'Codex activity for users signed in with ChatGPT, in the same feed as conversations.',
  ['Compliance API → CODEX_LOG'],
  ['act','who'],'What did Codex do, for which user?',
  'CODEX_LOG · dana@acme.example\n  task  "fix failing billing tests"\n  …',
  'API-key Codex use is not included: require ChatGPT sign-in.'],
 ['O3','Compliance API: AUTH · AUDIT · APP logs','ChatGPT Enterprise',
  'Sign-ins, workspace admin changes (including Codex policy) and connected apps.',
  ['Compliance API → AUTH_LOG · AUDIT_LOG · APP_LOG'],
  ['who'],'Who signed in, changed a policy, or connected an app?',
  'AUDIT_LOG  actor=owner@acme.example\n  change: Codex policy …\nAPP_LOG    app connected: …',
  'Analytics dashboards are reports, not raw logs.'],
 ['O4','Codex OpenTelemetry','managed',
  'Off by default. An [otel] block exports prompts (redacted unless enabled), tool decisions, tool results with an output snippet, API calls.',
  ['~/.codex/config.toml → [otel] exporter = "otlp-http"','log_user_prompt = false (default)'],
  ['act','who'],'Which tool call did Codex make, and was it approved?',
  'codex.tool_decision   tool=shell  decision=approved\ncodex.tool_result     tool=shell  success=true\n                      output="…"',
  'codex exec / mcp-server may not emit every event.'],
 ['O5','OpenAI Platform audit logs','API organisation',
  'Admin actions in the API org: keys, projects, users, logins. Never inference content. Owner enables it; only support can turn it off.',
  ['GET /v1/organization/audit_logs (Admin key)'],
  ['who'],'Who created the API key the agent used?',
  '{ "type": "api_key.created",\n  "actor": { "session": { "user": … } },\n  "effective_at": 1756800000 }',
  'Pair with usage per key to see which agent spent it.'],
 ['O6','Join keys: tie the evidence together','any platform',
  'No single artifact answers the question. These IDs connect agent records to the systems they touched.',
  ['session_id · transcript_path · conversation ID · Message-ID · request ID'],
  ['who','act','effect','input'],'Which agent session caused this effect?',
  'browser URL /chat/<id>  → Compliance API chat\nhook session_id         → transcript\ntool_result Message-ID  → email provider log\nidentity.arn            → CloudTrail',
  'Nothing here answers WHY the model chose to act.'],
],
};

const card=(c,a)=>{const [id,t,os,d,paths,qs,q,ex,lim]=a;
  return `<div class="pa ${CAT[c].cls}">
    <div class="hd"><span class="no">${id}</span><span class="tt">${t}</span></div>
    <div class="ds">${esc(d)}</div>
    <div><div class="lb">Path <span class="os">· ${os}</span></div><div class="pth">${paths.map(p=>`<div>${esc(p)}</div>`).join('')}</div></div>
    <div class="ans">${Object.keys(QK).filter(k=>k!=='why').map(k=>`<span class="qk ${qs.includes(k)?'on':''}">${QK[k]}</span>`).join('')}<br>${esc(q)}</div>
    <div class="ex"><span class="m">EXAMPLE</span>\n${esc(ex)}</div>
    <div class="lim">⚠ ${esc(lim)}</div>
  </div>`;};

const key=`<div class="pst-key"><span class="ptag pc-gen">GENERIC · ENDPOINT</span><span class="ptag pc-host">GENERIC · HOST / NET / CLOUD</span><span class="ptag pc-cla">CLAUDE ENT.</span><span class="ptag pc-oai">CHATGPT ENT.</span></div>`;
const NP=5;
const head=(n,h)=>`<div class="pst-head"><div class="kicker">Appendix · AI / LLM forensic artifacts poster <span class="tag">${n} / ${NP}</span><span class="tag">examples shortened</span>${key}</div><h1 class="t">${h}</h1></div>`;

/* page 1 - index: every artifact × the scorecard questions */
const rows=[];Object.keys(A).forEach(c=>A[c].forEach(a=>rows.push([c,a])));
const half=Math.ceil(rows.length/2);
const tbl=list=>`<table><colgroup><col style="width:55%">${Object.keys(QK).map(()=>'<col>').join('')}</colgroup>
  <tr><th>Artifact</th>${Object.values(QK).map(v=>`<th>${v}</th>`).join('')}</tr>
  ${list.map(([c,a])=>`<tr class="${CAT[c].cls}"><td><span class="no">${a[0]}</span>${a[1]}</td>${Object.keys(QK).map(k=>`<td>${a[5].includes(k)?'<span class="dot"></span>':k==='why'?'<span class="muted">-</span>':''}</td>`).join('')}</tr>`).join('')}</table>`;

DECK.outro.push({
  id:'poster-index',title:'Poster · index',section:'Appendix · artifacts poster',
  html:()=>`${head(1,'Which artifact answers <em>which question</em>')}
  <div class="pix">${tbl(rows.slice(0,half))}${tbl(rows.slice(half))}</div>`,
  notes:'Appendix: a reference poster of AI and LLM forensic artifacts, generic and proprietary. Every artifact answers who, what or which input. The WHY column is empty on every row.'
});
['gen','host','cla','oai'].forEach((c,i)=>DECK.outro.push({
  id:'poster-'+c,title:'Poster · '+CAT[c].tag.toLowerCase(),section:'Appendix · artifacts poster',
  html:()=>`${head(i+2,CAT[c].h)}<div class="pst-grid">${A[c].map(a=>card(c,a)).join('')}</div>`,
  notes:'Reference page: '+CAT[c].tag+'. Each box gives the description, the path, the question it answers and a shortened example.'
}));
})();
