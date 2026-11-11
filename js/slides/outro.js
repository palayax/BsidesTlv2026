/* =========================================================================
   OUTRO - takeaways + thank-you (the artifacts poster is inserted before thank-you by poster.js).
   Default case order lives here.
   All cases: echoleak, comet, postmark, replit (default) · forcedleak, gtg1002 (backups) - press S to choose.
   ========================================================================= */
(function(){
const {icon,tile}=UI;
DECK.defaultOrder=['echoleak','comet','postmark','replit'];

DECK.outro.push({
  id:'takeaways', title:'Takeaways', section:'Takeaways',
  html:()=>`
  <div class="kicker">Takeaways</div>
  <h1 class="t">Three things to do <em>on Monday</em></h1>
  <div class="row" style="margin-top:50px;gap:28px">
    ${[['01','Inventory agents as identities','Every agent, connector and token is a privileged non-human identity. Know where it lives and what it can reach.','fingerprint'],
       ['02','Turn on the evidence before you need it','Three switches: <b>conversation export</b>, <b>tool-call telemetry</b>, and <b>SaaS audit-log retention of a year or more</b>. None of them is retroactive.','history'],
       ['03','Correlate the request with the effect','Agent logs show what it asked for; SaaS and OS logs show what happened. Join them, and treat agent output as testimony.','link']]
      .map(([n,t,d,ic])=>`<div class="panel grow" style="padding:30px"><div class="row" style="justify-content:space-between"><span class="mono" style="font-size:48px;color:var(--red);font-weight:800">${n}</span><span style="color:var(--cyan)">${icon(ic,52)}</span></div><div style="font-size:34px;font-weight:800;color:#fff;margin:18px 0 12px;line-height:1.15">${t}</div><div style="font-size:24px;color:var(--text2);line-height:1.4">${d}</div></div>`).join('')}
  </div>
  <div class="callout abs" style="left:64px;right:64px;bottom:24px">Forensics can tell you <b>what</b> the agent did. Design so you never have to ask it <b>why</b>.</div>`,
  notes:'Inventory agents as identities. Turn on three switches now: conversation export, tool-call telemetry, and SaaS audit-log retention of a year or more. Correlate request and effect.'
});

DECK.outro.push({
  id:'thanks', title:'Thank you', section:'Thank you',
  html:()=>`
  <div class="abs" style="left:64px;top:70px;width:740px">
    <div class="kicker">BSides TLV 2026 <span class="tag">AI VILLAGE</span></div>
    <h1 class="t" style="font-size:110px">Thank you<span class="red">.</span></h1>
    <div class="sub" style="font-size:34px;margin-top:24px">Questions?</div>
    <div style="margin-top:70px;font-size:34px;color:#fff;font-weight:800">${SPEAKER.name}</div>
    <div class="sub" style="font-size:24px;margin-top:6px">${SPEAKER.role}</div>
    <div class="mono cyan" style="margin-top:22px;font-size:22px">${SPEAKER.handle}</div>
    <img src="${SPEAKER.logo}" alt="PALAYA" style="height:120px;margin-top:40px">
  </div>
  <div class="abs" style="left:850px;top:40px;width:580px;display:flex;flex-direction:column;align-items:center;gap:18px">
    <div style="width:580px;height:580px;padding:14px;border-radius:24px;background:#fff;box-shadow:0 0 0 2px var(--line2),0 20px 60px rgba(0,0,0,.5)"><img src="assets/img/qr-deck.svg" alt="QR code: palayax.github.io/BsidesTlv2026" style="width:100%;height:100%;display:block"></div>
    <div style="font-size:26px;color:#fff;font-weight:700;text-align:center;line-height:1.3">Scan for the slides, every source<br>and the forensic artifacts poster</div>
    <div class="mono cyan" style="font-size:24px">palayax.github.io/BsidesTlv2026</div>
  </div>
  <div class="abs" style="right:64px;top:120px">
    <div style="width:380px;height:460px;border-radius:24px;border:2px solid var(--line2);background:#0d1828 url('${SPEAKER.photo}') center 20%/cover"></div>
  </div>`,
  notes:'Thank you. Scan the code for the slides, every source and the forensic artifacts poster.'
});
})();
