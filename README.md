# The Forensic Gaps in Agentic AI — BSides TLV 2026 · AI Village

Interactive, clicker-driven talk by **Dor Amit (PALAYA)**. Live: https://palayax.github.io/BsidesTlv2026/

## Structure (each click is numbered in the top bar: SCREEN NN · CLICK x/y)
1. Concept + speaker
2. Statistics + the three questions where agentic-AI forensics has a gap (how did it get in / why did it act / can we reproduce it)
3. One comparison table: investigation question → answerable? → generic artifact type → why / limitation
4. The incidents — logos, dates, the forensic gap each case proves, public references

Each incident = 2 screens:
- **Workflow → compromise** (3 clicks): normal business workflow with a realistic example → attacker plants / failure starts → **before / after** side by side, with the difference highlighted and everything off the attack path dimmed. Diagram arrows are numbered in story order (neutral = normal flow, red = attack / exfil); a colour legend sits under the diagram; attack edges get a travelling dot and the leaked line types out. Classification strip: attack type, MITRE ATLAS / ATT&CK, OWASP LLM, CVE, impact.
- **Forensic reach → readiness** (2 clicks): four investigation questions vs what generic forensics answers today (best practice assumed) → two readiness columns: (a) the artifact on the platform where the incident happened, or a third-party control; (b) the equivalent on Claude Enterprise / ChatGPT Enterprise for the same workflow (Compliance API, audit logs, OpenTelemetry, hooks). Investigation artifacts only — no real-time prevention.

After the cases:
- **Scorecard** (2 clicks) — built from the selected cases: the questions from screen 3 × each case, verdict today → with readiness. "Why did the model choose it?" stays ✖ NO → ✖ NO for every case.
- Takeaways · Thank you

| Case | Agent type | Forensic gap it proves | Primary sources |
|---|---|---|---|
| EchoLeak — Microsoft 365 Copilot (Jun 2025) | Enterprise assistant (RAG) | which input steered the agent | MSRC CVE-2025-32711 · Aim Labs |
| Salesloft Drift (Aug 2025) | AI chat-agent integration | human, agent or thief — same identity | Google GTIG advisory |
| postmark-mcp (Sep 2025) | Email assistant via MCP | what the agent requested vs what actually happened | Postmark security alert |
| Replit × SaaStr (Jul 2025) | Coding agent | the agent's own account is the only record | The Register |
| ForcedLeak — Salesforce Agentforce (Sep 2025) · *backup* | CRM agent | untrusted public input in the agent's context | Noma Labs |
| GTG-1002 (Nov 2025) · *backup* | Autonomous attack agent | the evidence sits with the AI vendor | Anthropic report · MITRE C0062 |

Default deck: **EchoLeak → Drift → postmark-mcp → Replit** (15 screens). ForcedLeak and GTG-1002 are backups: press **S** to choose and order cases, or use `?cases=echoleak,forcedleak,drift,replit,postmark,gtg1002`.

## Files
- `js/engine.js` — deck build (intro → agenda → cases → scorecard → outro), reveal steps, rail, presenter view, setup overlay
- `js/components.js` — `UI.diagram` (numbered edges `n`, port offsets `fo`/`tp`, `both`, travelling dots), icons, tiles, chips
- `js/casekit.js` — `KIT.defineCase(id, meta, {scenario, readiness, score})`: the two case screens
- `js/cases/*.js` — one file per incident (facts, examples, readiness rows, scorecard verdicts)
- `js/slides/intro.js`, `js/slides/outro.js` — intro screens + agenda; scorecard, takeaways, thanks, default order
- `css/app.css` (base theme), `css/kit.css` (case kit, intro tables, agenda, scorecard)

## Controls
| Key | Action |
|---|---|
| PgDn / → / Space / click | next click / screen |
| PgUp / ← | previous |
| B or . | black screen |
| F5 / F | fullscreen |
| S | choose & order cases |
| V | presenter view (notes + timer, synced) |

Educational, defensive content only. All incident facts come from public sources cited in the deck; example emails, chats and logs are illustrative and attack instructions are paraphrased.
Brand logos: Simple Icons (CC0); trademarks belong to their owners.
