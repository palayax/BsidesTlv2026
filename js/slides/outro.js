/* =========================================================================
   OUTRO — scorecard (built from the selected cases) + takeaways + thank-you.
   Default case order lives here.
   All cases: echoleak, drift, postmark, replit (default) · forcedleak, gtg1002 (backups) — press S to choose.
   ========================================================================= */
(function(){
const {icon,tile}=UI;
DECK.defaultOrder=['echoleak','drift','postmark','replit'];

/* scorecard — returns to screen 3's questions; one column per selected case (works for 1–6 cases).
   Verdicts come from each case file: score:{who,act,effect,input,why}: [today, with readiness] */
const SQ=[
  ['who','Who acted — the user, the agent, or someone holding its token?'],
  ['act','Which actions ran, with which arguments?'],
  ['effect','What was touched — and what left?'],
  ['input','Which input steered it?'],
  ['why','Why did the model choose it?'],
];
const SV={y:'✔ YES',p:'◐ PARTIAL',n:'✖ NO',na:'— N/A'};
DECK.scorecard=(order)=>({
  id:'scorecard', title:'Scorecard', section:'Scorecard · back to the questions',
  html:()=>{
    const cases=order.map(id=>DECK.cases[id]);
    const short=c=>c.code.replace('SALESLOFT-','').replace('-SAASTR','').replace('-MCP','');
    return `<div class="kicker">Scorecard · the questions from the start, per incident</div>
    <h1 class="t" style="font-size:46px">Today <span class="muted">→</span> <em>with readiness switched on</em></h1>
    <table class="sc abs" style="left:64px;width:1800px;top:132px">
      <colgroup><col style="width:500px">${cases.map(()=>'<col>').join('')}</colgroup>
      <tr><th>Investigation question</th>${cases.map(c=>`<th>${tile(c.logos[0],44)}${short(c)}</th>`).join('')}</tr>
      ${SQ.map(([k,q])=>`<tr class="${k==='why'?'why':''}"><td class="scq">${q}</td>${cases.map(c=>{const s=(c.score||{})[k]||['na','na'];
        return `<td><span class="now ${s[0]}">${SV[s[0]]}</span><span class="rdy ${s[1]}" data-in="1">→ ${SV[s[1]]}</span></td>`;}).join('')}</tr>`).join('')}
    </table>
    <div class="callout abs" data-in="1" style="left:64px;right:64px;bottom:22px;font-size:24px">Readiness closes most rows. <b>Why the model chose it</b> stays <b class="red">✖ NO → ✖ NO</b> for every case — no vendor exposes the decision path. Preserve inputs and outputs; treat the agent's explanation as testimony.</div>`;
  },
  notes:['Back to the questions from the start, one column per incident we saw. First, what generic forensics answers today.','Now with the readiness artifacts switched on before the incident. Most rows move up. One row does not move for any case: why the model chose it. Nothing we can switch on closes that — so preserve inputs and outputs, and treat what the agent says about itself as testimony.']
});

DECK.outro.push({
  id:'takeaways', title:'Takeaways', section:'Takeaways',
  html:()=>`
  <div class="kicker">Takeaways</div>
  <h1 class="t">Three things to do <em>on Monday</em></h1>
  <div class="row" style="margin-top:50px;gap:28px">
    ${[['01','Inventory agents as identities','Every agent, connector and token is a privileged non-human identity. Know where it lives and what it can reach.','fingerprint'],
       ['02','Turn on the evidence before you need it','Three switches: <b>conversation export</b>, <b>tool-call telemetry</b>, and <b>SaaS audit-log retention of a year or more</b>. None of them is retroactive.','history'],
       ['03','Correlate the request with the effect','Agent logs show what it asked for; SaaS and OS logs show what happened. Join them — and treat agent output as testimony.','link']]
      .map(([n,t,d,ic])=>`<div class="panel grow" style="padding:30px"><div class="row" style="justify-content:space-between"><span class="mono" style="font-size:48px;color:var(--red);font-weight:800">${n}</span><span style="color:var(--cyan)">${icon(ic,52)}</span></div><div style="font-size:34px;font-weight:800;color:#fff;margin:18px 0 12px;line-height:1.15">${t}</div><div style="font-size:24px;color:var(--text2);line-height:1.4">${d}</div></div>`).join('')}
  </div>
  <div class="callout abs" style="left:64px;right:64px;bottom:24px">Forensics can tell you <b>what</b> the agent did. Design so you never have to ask it <b>why</b>.</div>`,
  notes:'Inventory agents as identities. Turn on three switches now — conversation export, tool-call telemetry, and SaaS audit-log retention of a year or more. Correlate request and effect.'
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
  notes:'Thank you. Sources for every case are on the incident slide and in the repo.'
});
})();
