# The Forensic Gaps in Agentic AI — BSides TLV 2026 · AI Village

Interactive, clicker-driven talk by **Dor Amit (PALAYA)**. Live: https://palayax.github.io/BsidesTlv2026/

## Structure (each click is numbered in the top bar: SCREEN NN · CLICK x/y)
1. Concept + speaker
2. Statistics + classical DFIR vs agentic-AI DFIR — which questions each can answer
3. One comparison table: investigation question → answerable? → generic artifact type → why / limitation
4. The incidents — logos, dates, public references

Each incident = 2 screens:
- **Workflow → compromise** (3 clicks): normal business workflow with a realistic example → attacker plants / failure starts → compromise outcome with attack type, MITRE ATLAS / ATT&CK, OWASP LLM, CVE and impact.
- **Forensic reach → readiness** (2 clicks): business questions vs what generic forensics answers today (best practice assumed) → the forensic-readiness artifact that makes each answerable (3rd-party, or Claude / ChatGPT Enterprise: Compliance API, audit logs, OpenTelemetry, hooks).

| Case | Agent type | Primary sources |
|---|---|---|
| EchoLeak — Microsoft 365 Copilot (Jun 2025) | Enterprise assistant (RAG) | MSRC CVE-2025-32711 · Aim Labs |
| ForcedLeak — Salesforce Agentforce (Sep 2025) | CRM agent | Noma Labs |
| Salesloft Drift (Aug 2025) | AI chat-agent integration | Google GTIG advisory |
| Replit × SaaStr (Jul 2025) | Coding agent | The Register |
| postmark-mcp (Sep 2025) | Email assistant via MCP | Postmark security alert |
| GTG-1002 (Nov 2025) | Autonomous attack agent | Anthropic report · MITRE C0062 |

Default deck shows the first four; press **S** to choose and order cases.

## Controls
| Key | Action |
|---|---|
| PgDn / → / Space / click | next screen |
| PgUp / ← | previous screen |
| B or . | black screen |
| F5 / F | fullscreen |
| S | choose & order cases |
| V | presenter view (notes + timer, synced) |

Educational, defensive content only. All incident facts come from public sources cited in the deck.
Brand logos: Simple Icons (CC0); trademarks belong to their owners.
