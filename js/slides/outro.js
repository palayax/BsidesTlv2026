/* =========================================================================
   OUTRO — takeaways + thank-you. Default case order lives here.
   All cases: echoleak, forcedleak, drift, replit, postmark, gtg1002 (press S to choose).
   ========================================================================= */
(function(){
const {icon}=UI;
DECK.defaultOrder=['echoleak','forcedleak','drift','replit'];

DECK.outro.push({
  id:'takeaways', title:'Takeaways', section:'Takeaways',
  html:()=>`
  <div class="kicker">Takeaways</div>
  <h1 class="t">Three things to do <em>on Monday</em></h1>
  <div class="row" style="margin-top:50px;gap:28px">
    ${[['01','Inventory agents as identities','Every agent, connector and token is a privileged non-human identity. Know where it lives and what it can reach.','fingerprint'],
       ['02','Turn on the evidence before you need it','Audit logs, compliance exports and tool-call telemetry are not retroactive. Retention is set before the incident.','history'],
       ['03','Correlate the request with the effect','Agent logs show what it asked for; SaaS and OS logs show what happened. Join them — and treat agent output as testimony.','link']]
      .map(([n,t,d,ic])=>`<div class="panel grow" style="padding:30px"><div class="row" style="justify-content:space-between"><span class="mono" style="font-size:48px;color:var(--red);font-weight:800">${n}</span><span style="color:var(--cyan)">${icon(ic,52)}</span></div><div style="font-size:34px;font-weight:800;color:#fff;margin:18px 0 12px;line-height:1.15">${t}</div><div style="font-size:23px;color:var(--text2);line-height:1.4">${d}</div></div>`).join('')}
  </div>
  <div class="callout abs" style="left:64px;right:64px;bottom:24px">Forensics can tell you <b>what</b> the agent did. Design so you never have to ask it <b>why</b>.</div>`,
  notes:'Inventory. Enable evidence now. Correlate request and effect.'
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
