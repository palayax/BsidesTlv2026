# The Forensic Gaps in Agentic AI — BSides TLV 2026 · AI Village

Interactive, clicker-driven talk by **Dor Amit (PALAYA)**. Live: https://palayax.github.io/BsidesTlv2026/

## Structure (one click = one screen)
1. Concept + speaker
2. Statistics + classical DFIR vs agentic-AI DFIR — which questions each can answer
3. Generic AI forensic artifacts — what they can / cannot answer, and why
4. The incidents — logos, dates, public references

Each incident = 4 screens: **Business workflow → Attack path, TTPs & business impact → Forensic reach (best-practice config assumed) → Mitigation** (3rd-party controls, Claude Enterprise, ChatGPT Enterprise).

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
