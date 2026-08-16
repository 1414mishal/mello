// Build the Summit Studios brochure as HTML, ready to print to PDF.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'C:/Users/1414m/AppData/Local/Temp/claude/C--Users-1414m-OneDrive-Documents-mello/bd5b9709-284a-4df3-8e82-d5c7a65c9dcf/scratchpad';
const logo = readFileSync(`${DIR}/logo.b64`, 'utf8').trim();
const LOGO = `data:image/png;base64,${logo}`;

const services = [
  ['01', 'Websites that bring in customers',
    'Not just a good-looking site, but one that does a job. Fast, clean, mobile-first sites that turn a visitor into a booked appointment or a paying customer — and that actually show up when people search on Google.',
    ['Clinic & practice sites', 'Business & brand sites', 'E-commerce stores', 'SEO & Google setup']],
  ['02', 'AI receptionists',
    'A smart assistant that answers your phone and chats 24/7. It books appointments, handles the questions you get asked a hundred times a day, captures every lead, and hands off to a real person when it matters.',
    ['24/7 call & chat', 'Appointment booking', 'Lead capture', 'Human handoff']],
  ['03', 'WhatsApp automation',
    'Put WhatsApp to work on the app your customers already use. Reminders that cut no-shows, instant replies to enquiries, broadcasts for offers, order and payment flows, and chatbots that qualify leads before they reach you.',
    ['Appointment reminders', 'Auto-replies & chatbots', 'Broadcasts', 'Order & payment flows']],
  ['04', 'Custom CRMs & software',
    'Software shaped around how you actually work, not an off-the-shelf tool you have to bend to fit. Track leads and patients, automate the repetitive admin, and see everything in one dashboard.',
    ['Lead & patient management', 'Dashboards & reporting', 'Workflow automation', 'Integrations']],
  ['05', 'iOS & Android apps',
    'Mobile apps that feel quick and natural — the kind people keep on their home screen. Taken all the way through to the App Store and Play Store.',
    ['iOS & Android', 'Cross-platform', 'Offline-first', 'App store launch']],
  ['06', 'Web apps & dashboards',
    'Fast, dependable web apps built on a clean foundation that will not fall apart as you grow. We sweat the architecture so you do not have to think about it later.',
    ['Dashboards & portals', 'Internal tools', 'Marketplaces', 'SaaS products']],
  ['07', 'Backend, maintenance & growth',
    'The engine room and the upkeep. Secure APIs and databases that handle real traffic, plus ongoing fixes, tuning and new features. We do not vanish once it is live.',
    ['APIs & databases', 'Cloud & integrations', 'Monitoring', 'Ongoing support']],
];

const steps = [
  ['01', 'Figure it out', 'We dig into what you are really trying to do before anyone writes a line of code.'],
  ['02', 'Design it', 'We sketch, prototype, and get it in front of you early, so there are no surprises.'],
  ['03', 'Build it', 'We ship in small pieces you can see and use, instead of disappearing for months.'],
  ['04', 'Look after it', 'After launch we keep it healthy and help it grow as you learn what works.'],
];

const website = [
  ['Built for the phone first', 'Most of your customers arrive on a phone, often on patchy mobile data. Every site is built and tested that way round, not squeezed down from a desktop layout afterwards.'],
  ['Made to be found', 'Proper page titles, descriptions, structured data and a sitemap, so Google can read the site and show it properly. Sharing a link puts a real preview card in WhatsApp instead of a bare URL.'],
  ['A clear path to enquiry', 'Booking, WhatsApp and click-to-call sit where a reader is ready to act, so interest turns into an actual message rather than a bounce.'],
  ['Fast, and it stays fast', 'Compressed images, no bloated page builders, and hosting on a global CDN. Pages open before someone loses patience.'],
  ['Yours, not rented', 'A custom build on your own domain and hosting. No monthly template fee, no platform lock-in, and nothing to migrate later.'],
];

const page = (n, cls, inner) => `<section class="page ${cls}">
  ${inner}
  <div class="folio"><span>summitxstudio.com</span><span>${n}</span></div>
</section>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Summit Studios — Brochure</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #060608; }
  body { font-family: Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

  .page { position: relative; width: 210mm; height: 297mm; padding: 18mm 18mm 30mm;
    background: #060608; color: #fff; overflow: hidden;
    display: flex; flex-direction: column; page-break-after: always; }
  .page:last-child { page-break-after: auto; }

  /* Brand wash, echoing the site's shader */
  .page::before { content: ""; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(90% 60% at 100% 0%,   rgba(124, 77, 255, 0.30), transparent 60%),
      radial-gradient(70% 50% at 0% 100%,   rgba(56, 92, 214, 0.22), transparent 62%); }
  .page > * { position: relative; z-index: 1; }

  .mono { font-family: "JetBrains Mono", ui-monospace, monospace; text-transform: uppercase;
    letter-spacing: 0.22em; font-size: 8pt; color: rgba(255,255,255,0.42); }
  .folio { position: absolute; left: 18mm; right: 18mm; bottom: 12mm; z-index: 1;
    display: flex; justify-content: space-between;
    font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.5pt;
    letter-spacing: 0.16em; color: rgba(255,255,255,0.3);
    border-top: 1px solid rgba(255,255,255,0.10); padding-top: 4mm; }

  .brand { display: flex; align-items: center; gap: 4mm; }
  .brand img { width: 11mm; height: 11mm; }
  .brand b { font-size: 15pt; font-weight: 600; letter-spacing: -0.02em; }
  .brand b i { font-weight: 300; font-style: italic; }

  h1 { font-size: 33pt; line-height: 1.06; font-weight: 300; letter-spacing: -0.025em; }
  h1 i { font-style: italic; }
  h2 { font-size: 25pt; line-height: 1.1; font-weight: 300; letter-spacing: -0.02em; }
  .lede { font-size: 11.5pt; line-height: 1.65; font-weight: 300; color: rgba(255,255,255,0.78); }

  /* Cover */
  .cover { justify-content: flex-start; }
  .cover .spacer { flex: 1; }
  .cover .kicker { margin-top: 0; }
  .cover h1 { margin-top: 6mm; max-width: 150mm; }
  .cover .lede { margin-top: 9mm; max-width: 128mm; }
  .cover .pills { margin-top: 12mm; display: flex; flex-wrap: wrap; gap: 2.5mm; max-width: 150mm; }
  .cover .pills span { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.5pt;
    letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.72);
    border: 1px solid rgba(255,255,255,0.2); border-radius: 20pt; padding: 2mm 4mm; }

  /* Service list */
  .svc { margin-top: 9mm; display: flex; flex-direction: column; gap: 6.5mm; }
  .svc .row { display: grid; grid-template-columns: 13mm 1fr; gap: 3mm;
    border-top: 1px solid rgba(255,255,255,0.10); padding-top: 4.5mm; }
  .svc .num { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8pt;
    color: rgba(255,255,255,0.32); padding-top: 1mm; }
  .svc h3 { font-size: 13pt; font-weight: 500; letter-spacing: -0.01em; }
  .svc p { margin-top: 2mm; font-size: 9.5pt; line-height: 1.55; font-weight: 300;
    color: rgba(255,255,255,0.7); max-width: 148mm; }
  .svc ul { margin-top: 3mm; display: flex; flex-wrap: wrap; gap: 2mm; list-style: none; }
  .svc li { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 6.8pt;
    letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6);
    border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.04);
    border-radius: 20pt; padding: 1.4mm 3mm; }

  /* Website deep-dive */
  .deep { margin-top: 10mm; display: flex; flex-direction: column; gap: 7mm; }
  .deep .item { border-left: 1px solid rgba(255,255,255,0.16); padding-left: 6mm; }
  .deep h3 { font-size: 12.5pt; font-weight: 500; letter-spacing: -0.01em; }
  .deep p { margin-top: 2.5mm; font-size: 10pt; line-height: 1.6; font-weight: 300;
    color: rgba(255,255,255,0.72); max-width: 150mm; }

  /* Process */
  .steps { margin-top: 12mm; display: flex; flex-direction: column; gap: 0; }
  .steps .st { display: grid; grid-template-columns: 20mm 1fr; gap: 4mm;
    padding: 7mm 0; border-top: 1px solid rgba(255,255,255,0.10); }
  .steps .st:last-child { border-bottom: 1px solid rgba(255,255,255,0.10); }
  .steps .n { font-size: 20pt; font-weight: 200; color: rgba(255,255,255,0.3); line-height: 1; }
  .steps h3 { font-size: 14pt; font-weight: 500; letter-spacing: -0.01em; }
  .steps p { margin-top: 2mm; font-size: 10pt; line-height: 1.6; font-weight: 300;
    color: rgba(255,255,255,0.72); max-width: 130mm; }

  /* Closing */
  .stats { margin-top: 11mm; display: grid; grid-template-columns: 1fr 1fr; gap: 8mm 6mm; }
  .stats .s dt { font-size: 24pt; font-weight: 200; letter-spacing: -0.02em; }
  .stats .s dd { margin-top: 1.5mm; font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 7.5pt; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
  .contact { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.14); padding-top: 7mm; }
  .contact .row { display: grid; grid-template-columns: 26mm 1fr; gap: 4mm; padding: 2.6mm 0; }
  .contact .k { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.5pt;
    letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.4); padding-top: 1mm; }
  .contact .v { font-size: 12pt; font-weight: 300; }
</style></head><body>

${page('01', 'cover', `
  <div class="brand"><img src="${LOGO}" alt="" /><b>summit<i>studios</i></b></div>
  <div class="spacer"></div>
  <div>
    <p class="mono kicker">Web · Apps · AI · Automation</p>
    <h1>We build fast, sharp software that holds up when it actually <i>matters.</i></h1>
    <p class="lede">Summit Studios is a small, senior studio in Mangaluru. We design and build
      websites, apps and internal software for clinics, founders and growing businesses —
      end to end, so you can get on with running the place.</p>
    <div class="pills">
      <span>Websites</span><span>AI receptionists</span><span>WhatsApp automation</span>
      <span>Custom CRMs</span><span>Mobile apps</span><span>Web apps</span>
    </div>
  </div>`)}

${page('02', '', `
  <p class="mono">What we do</p>
  <h2 style="margin-top:5mm">Seven things, done <i style="font-style:italic">properly.</i></h2>
  <div class="svc">
    ${services.slice(0, 4).map(([n, t, d, tags]) => `<div class="row">
      <div class="num">${n}</div>
      <div>
        <h3>${t}</h3>
        <p>${d}</p>
        <ul>${tags.map((x) => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>`).join('')}
  </div>`)}

${page('03', '', `
  <p class="mono">What we do — continued</p>
  <h2 style="margin-top:5mm">Beyond the <i>website.</i></h2>
  <div class="svc">
    ${services.slice(4).map(([n, t, d, tags]) => `<div class="row">
      <div class="num">${n}</div>
      <div>
        <h3>${t}</h3>
        <p>${d}</p>
        <ul>${tags.map((x) => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>`).join('')}
  </div>
  <p class="lede" style="margin-top:14mm;max-width:150mm">Most projects start with one of these and grow
    into the others. Because it is all built in-house, the pieces talk to each other instead of being
    stitched together later.</p>`)}

${page('04', '', `
  <p class="mono">In focus</p>
  <h2 style="margin-top:5mm">What makes a website<br/>actually <i>work.</i></h2>
  <p class="lede" style="margin-top:7mm;max-width:150mm">Most enquiries start here, so it is worth
    being precise about what you get. A site is not a brochure that sits there — it is the thing that
    turns someone searching at 11pm into a booking in your calendar.</p>
  <div class="deep">
    ${website.map(([t, d]) => `<div class="item"><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>`)}

${page('05', '', `
  <p class="mono">How we work</p>
  <h2 style="margin-top:5mm">Four steps, and you see<br/>every one of <i>them.</i></h2>
  <div class="steps">
    ${steps.map(([n, t, d]) => `<div class="st"><div class="n">${n}</div>
      <div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
  </div>
  <p class="lede" style="margin-top:12mm;max-width:145mm">You deal with the people building the thing.
    No account managers, no handovers to a junior team, and no month-long silences.</p>`)}

${page('06', '', `
  <p class="mono">Why us</p>
  <h2 style="margin-top:5mm">A small team is the <i>point.</i></h2>
  <div class="stats">
    <div class="s"><dt>1:1</dt><dd>Senior team, no juniors</dd></div>
    <div class="s"><dt>&lt;24h</dt><dd>Average reply time</dd></div>
    <div class="s"><dt>100%</dt><dd>Custom build, no templates</dd></div>
    <div class="s"><dt>A → Z</dt><dd>Idea to launch, in-house</dd></div>
  </div>
  <p class="lede" style="margin-top:11mm;max-width:150mm">Tell us what you are working on. We will tell
    you honestly whether we are the right people for it, roughly what it takes, and what we would do
    first. No obligation, and no sales call.</p>
  <div class="contact">
    <div class="brand" style="margin-bottom:6mm"><img src="${LOGO}" alt="" /><b>summit<i>studios</i></b></div>
    <div class="row"><div class="k">WhatsApp</div><div class="v">+91 98441 70575</div></div>
    <div class="row"><div class="k">Email</div><div class="v">summitstud@gmail.com</div></div>
    <div class="row"><div class="k">Website</div><div class="v">summitxstudio.com</div></div>
    <div class="row"><div class="k">Based in</div><div class="v">Mangaluru, India — working worldwide</div></div>
  </div>`)}

</body></html>`;

writeFileSync(`${DIR}/brochure.html`, html);
console.log('wrote brochure.html (6 pages)');
