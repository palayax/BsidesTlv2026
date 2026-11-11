# The Forensic Gaps in Agentic AI - BSides TLV 2026 · AI Village

Interactive, clicker-driven talk by **Dor Amit (PALAYA)**. Live: https://palayax.github.io/BsidesTlv2026/

## Structure (each click is numbered in the top bar: SCREEN NN · CLICK x/y)
1. Concept + speaker
2. AI breach statistics (IBM Cost of a Data Breach 2026, Gartner)
3. Digital forensics 101: seven investigation questions (when / who / how / what / impact / why / replay), the classical artifact type that answers each, and a real artifact example
4. The same seven questions for agentic AI: generic AI artifact, what it shows, and the gap explained
5. The incidents - logos, dates, the forensic gap each case proves, public references

Each incident = 2 screens:
- **Workflow → compromise** (3 clicks): normal business workflow with a realistic example → attacker plants / failure starts → **before / after** side by side, with the difference highlighted and everything off the attack path dimmed. Diagram arrows are numbered in story order (neutral = normal flow, red = attack / exfil); a colour legend sits under the diagram; attack edges get a travelling dot and the leaked line types out. Classification strip: attack type, MITRE ATLAS / ATT&CK, OWASP LLM, CVE, impact.
- **Forensic gaps → readiness** (1 screen, no extra click): only the AI-related investigation questions that generic forensics answers partly or not at all, phrased like the generic questions on the intro screens (WHO / HOW / WHAT / IMPACT / WHY), with today's verdict and why → one readiness column naming the artifact that answers each question, tagged **ENTERPRISE** (a capability of an enterprise licence: Claude Enterprise / ChatGPT Enterprise Compliance API, OpenTelemetry, managed hooks, or the platform's own enterprise tier) or **EXTERNAL CONTROL** (a non-generic control you add: SWG, DSPM, DB proxy, canaries, AI inventory). Investigation artifacts only, no real-time prevention.

After the cases:
- **Scorecard** (2 clicks) - built from the selected cases: the investigation questions × each case, verdict today → with readiness, using the same generic questions. "Why did it act?" stays ✖ NO → ✖ NO for every case.
- Takeaways
- **Appendix: AI / LLM forensic artifacts poster** (5 screens): an index of every artifact against the scorecard questions, then four reference pages (endpoint files, host/network/identity/cloud, Claude Enterprise, ChatGPT Enterprise / OpenAI). Each artifact has a description, path, the question it answers and a shortened example.
- Thank you (last screen)

| Case | Agent type | Forensic gap it proves | Primary sources |
|---|---|---|---|
| EchoLeak - Microsoft 365 Copilot (Jun 2025) | Enterprise assistant (RAG) | which input steered the agent | MSRC CVE-2025-32711 · Aim Labs |
| Perplexity Comet (Aug 2025) | Agentic browser | human or agent: same session, same identity | Brave security research |
| postmark-mcp (Sep 2025) | Email assistant via MCP | what the agent requested vs what actually happened | Postmark security alert |
| Replit × SaaStr (Jul 2025) | Coding agent | the agent's own account is the only record | The Register |
| ForcedLeak - Salesforce Agentforce (Sep 2025) · *backup* | CRM agent | untrusted public input in the agent's context | Noma Labs |
| GTG-1002 (Nov 2025) · *backup* | Autonomous attack agent | the evidence sits with the AI vendor | Anthropic report · MITRE C0062 |

Default deck: **EchoLeak → Comet → postmark-mcp → Replit** (21 screens incl. the 5-screen poster). ForcedLeak and GTG-1002 are backups: press **S** to choose and order cases, or use `?cases=echoleak,forcedleak,comet,replit,postmark,gtg1002`.

## Files
- `js/engine.js` - deck build (intro → agenda → cases → scorecard → outro), reveal steps, rail, presenter view, setup overlay
- `js/components.js` - `UI.diagram` (numbered edges `n`, port offsets `fo`/`tp`, `both`, travelling dots), icons, tiles, chips
- `js/casekit.js` - `KIT.defineCase(id, meta, {scenario, readiness, score})`: the two case screens
- `js/cases/*.js` - one file per incident (facts, examples, readiness rows, scorecard verdicts)
- `js/slides/intro.js`, `js/slides/outro.js` - intro screens + agenda; scorecard, takeaways, thanks, default order
- `js/slides/poster.js`, `css/poster.css` - the artifacts poster appendix (sources listed at the top of the file)
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
