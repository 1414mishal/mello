// Build the Summit Studios brochure as HTML, ready to print to PDF.
import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'C:/Users/1414m/AppData/Local/Temp/claude/C--Users-1414m-OneDrive-Documents-mello/bd5b9709-284a-4df3-8e82-d5c7a65c9dcf/scratchpad';
const LOGO = `data:image/png;base64,${readFileSync(`${DIR}/logo.b64`, 'utf8').trim()}`;

const services = [
  ['01', 'Websites that bring in customers',
    'Fast, mobile-first sites that turn a visitor into a booked appointment or a paying customer.',
    ['Clinic & practice sites', 'Business & brand sites', 'E-commerce stores', 'SEO & Google setup']],
  ['02', 'Web apps & dashboards',
    'Dependable web apps on a clean foundation that will not fall apart as you grow.',
    ['Dashboards & portals', 'Internal tools', 'Marketplaces', 'SaaS products']],
  ['03', 'Custom CRMs & software',
    'Software shaped around how you actually work, not a tool you have to bend to fit.',
    ['Lead & patient management', 'Dashboards & reporting', 'Workflow automation', 'Integrations']],
  ['04', 'iOS & Android apps',
    'Apps that feel quick, taken all the way through to the App Store and Play Store.',
    ['iOS & Android', 'Cross-platform', 'Offline-first', 'App store launch']],
  ['05', 'Backend, maintenance & growth',
    'Secure APIs and databases that carry real traffic, plus ongoing fixes and new features.',
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
  ['Made to be found', 'Proper titles, descriptions, structured data and a sitemap, so Google can read the site and show it properly. Sharing a link puts a real preview card in WhatsApp instead of a bare URL.'],
  ['A clear path to enquiry', 'Booking and click-to-call sit exactly where a reader is ready to act, so interest turns into an actual message rather than a bounce.'],
  ['Fast, and it stays fast', 'Compressed images, no bloated page builders, and hosting on a global CDN. Pages open before someone loses patience.'],
  ['Yours, not rented', 'A custom build on your own domain and hosting. No monthly template fee, no platform lock-in, and nothing to migrate later.'],
];

const beyond = [
  ['One place to run the business', 'Dashboards that pull leads, patients, orders and staff into a single screen, so you stop stitching the picture together from spreadsheets and chat threads.'],
  ['Shaped to how you already work', 'Off-the-shelf tools make you work their way. We build around your process, then automate the repetitive parts that eat the week.'],
  ['Apps that earn their place', 'iOS and Android, taken through to the App Store and Play Store, and built to feel quick on a mid-range phone rather than only a new one.'],
  ['Built to carry real traffic', 'Secure APIs and databases with monitoring in place, so growth becomes a good problem instead of an outage on your busiest day.'],
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
  html, body { background: #12121c; }
  body { font-family: Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

  .page { position: relative; width: 210mm; height: 297mm; padding: 18mm 18mm 30mm;
    background: #12121c; color: #fff; overflow: hidden;
    display: flex; flex-direction: column; page-break-after: always; }
  .page:last-child { page-break-after: auto; }

  /* Brand wash, echoing the site's shader — lifted well clear of black */
  .page::before { content: ""; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(105% 75% at 100% 0%,  rgba(150, 105, 255, 0.62), transparent 64%),
      radial-gradient(90% 65% at 0% 100%,   rgba(72, 118, 255, 0.50), transparent 66%),
      radial-gradient(75% 55% at 15% 12%,   rgba(120, 90, 240, 0.28), transparent 70%); }
  .page > * { position: relative; z-index: 1; }

  .mono { font-family: "JetBrains Mono", ui-monospace, monospace; text-transform: uppercase;
    letter-spacing: 0.22em; font-size: 9pt; color: rgba(255,255,255,0.66); }
  .folio { position: absolute; left: 18mm; right: 18mm; bottom: 12mm; z-index: 1;
    display: flex; justify-content: space-between;
    font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8pt;
    letter-spacing: 0.16em; color: rgba(255,255,255,0.5);
    border-top: 1px solid rgba(255,255,255,0.22); padding-top: 4mm; }

  .brand { display: flex; align-items: center; gap: 4mm; }
  .brand img { width: 12mm; height: 12mm; }
  .brand b { font-size: 17pt; font-weight: 600; letter-spacing: -0.02em; }
  .brand b i { font-weight: 300; font-style: italic; }

  h1 { font-size: 37pt; line-height: 1.07; font-weight: 300; letter-spacing: -0.025em; }
  h1 i { font-style: italic; }
  h2 { font-size: 29pt; line-height: 1.1; font-weight: 300; letter-spacing: -0.02em; }
  .lede { font-size: 13pt; line-height: 1.62; font-weight: 300; color: rgba(255,255,255,0.9); }

  /* Cover */
  .cover { justify-content: flex-start; }
  .cover .spacer { flex: 1; }
  .cover h1 { margin-top: 7mm; max-width: 158mm; }
  .cover .lede { margin-top: 9mm; max-width: 140mm; }
  .cover .pills { margin-top: 12mm; display: flex; flex-wrap: wrap; gap: 2.5mm; max-width: 155mm; }
  .cover .pills span { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8.5pt;
    letter-spacing: 0.1em; text-transform: uppercase; color: #fff;
    border: 1px solid rgba(255,255,255,0.42); border-radius: 20pt; padding: 2.2mm 4.5mm; }

  /* Service list */
  .svc { margin-top: 8mm; display: flex; flex-direction: column; gap: 4.5mm; }
  .svc .row { display: grid; grid-template-columns: 14mm 1fr; gap: 3mm;
    border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4mm; }
  .svc .num { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 9pt;
    color: rgba(255,255,255,0.55); padding-top: 1mm; }
  .svc h3 { font-size: 15pt; font-weight: 500; letter-spacing: -0.01em; }
  .svc p { margin-top: 2.5mm; font-size: 11pt; line-height: 1.55; font-weight: 300;
    color: rgba(255,255,255,0.86); max-width: 152mm; }
  .svc ul { margin-top: 3.5mm; display: flex; flex-wrap: wrap; gap: 2mm; list-style: none; }
  .svc li { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.6pt;
    letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.82);
    border: 1px solid rgba(255,255,255,0.26); background: rgba(255,255,255,0.09);
    border-radius: 20pt; padding: 1.7mm 3.4mm; }

  /* Deep-dive lists */
  .deep { margin-top: 11mm; display: flex; flex-direction: column; gap: 7.5mm; }
  .deep .item { border-left: 2px solid rgba(255,255,255,0.32); padding-left: 6mm; }
  .deep h3 { font-size: 14.5pt; font-weight: 500; letter-spacing: -0.01em; }
  .deep p { margin-top: 2.5mm; font-size: 11.5pt; line-height: 1.6; font-weight: 300;
    color: rgba(255,255,255,0.88); max-width: 155mm; }

  /* Process */
  .steps { margin-top: 12mm; display: flex; flex-direction: column; }
  .steps .st { display: grid; grid-template-columns: 22mm 1fr; gap: 4mm;
    padding: 8mm 0; border-top: 1px solid rgba(255,255,255,0.2); }
  .steps .st:last-child { border-bottom: 1px solid rgba(255,255,255,0.2); }
  .steps .n { font-size: 23pt; font-weight: 200; color: rgba(255,255,255,0.55); line-height: 1; }
  .steps h3 { font-size: 16pt; font-weight: 500; letter-spacing: -0.01em; }
  .steps p { margin-top: 2.5mm; font-size: 11.5pt; line-height: 1.6; font-weight: 300;
    color: rgba(255,255,255,0.88); max-width: 135mm; }

  /* Closing */
  .stats { margin-top: 12mm; display: grid; grid-template-columns: 1fr 1fr; gap: 9mm 6mm; }
  .stats .s dt { font-size: 27pt; font-weight: 200; letter-spacing: -0.02em; }
  .stats .s dd { margin-top: 2mm; font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 8.5pt; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.72); }
  .contact { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.26); padding-top: 7mm; }
  .contact .row { display: grid; grid-template-columns: 28mm 1fr; gap: 4mm; padding: 2.8mm 0; }
  .contact .k { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8.5pt;
    letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.6); padding-top: 1mm; }
  .contact .v { font-size: 13.5pt; font-weight: 300; }
</style></head><body>

${page('01', 'cover', `
  <div class="brand"><img src="${LOGO}" alt="" /><b>summit<i>studios</i></b></div>
  <div class="spacer"></div>
  <div>
    <p class="mono">Websites · Software · Apps</p>
    <h1>We build fast, sharp software that holds up when it actually <i>matters.</i></h1>
    <p class="lede">Summit Studios is a small, senior studio in Mangaluru. We design and build
      websites and custom software for clinics, founders and growing businesses — end to end,
      so you can get on with running the place.</p>
    <div class="pills">
      <span>Websites</span><span>Web apps</span><span>Custom CRMs</span>
      <span>Mobile apps</span><span>Backend &amp; support</span>
    </div>
  </div>`)}

${page('02', '', `
  <p class="mono">What we do</p>
  <h2 style="margin-top:5mm">Two things, done <i>properly.</i></h2>
  <p class="lede" style="margin-top:7mm;max-width:150mm">Websites that bring you customers, and the
    software that runs everything behind them. Both built in-house, by the same people.</p>
  <div class="svc">
    ${services.map(([n, t, d, tags]) => `<div class="row">
      <div class="num">${n}</div>
      <div>
        <h3>${t}</h3>
        <p>${d}</p>
        <ul>${tags.map((x) => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>`).join('')}
  </div>`)}

${page('03', '', `
  <p class="mono">In focus — websites</p>
  <h2 style="margin-top:5mm">What makes a website<br/>actually <i>work.</i></h2>
  <p class="lede" style="margin-top:7mm;max-width:155mm">Most enquiries start here, so it is worth being
    precise. A site is not a brochure that sits there — it is the thing that turns someone searching at
    11pm into a booking in your calendar.</p>
  <div class="deep">
    ${website.map(([t, d]) => `<div class="item"><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>`)}

${page('04', '', `
  <p class="mono">In focus — software</p>
  <h2 style="margin-top:5mm">Beyond the <i>website.</i></h2>
  <p class="lede" style="margin-top:7mm;max-width:155mm">Once the enquiries arrive, something has to
    handle them. That is the second half of what we do: the dashboards, apps and systems that run
    quietly in the background.</p>
  <div class="deep">
    ${beyond.map(([t, d]) => `<div class="item"><h3>${t}</h3><p>${d}</p></div>`).join('')}
  </div>
  <p class="lede" style="margin-top:12mm;max-width:152mm">Most projects start with a website and grow
    into the rest. Because it is all built in-house, the pieces talk to each other instead of being
    stitched together later.</p>`)}

${page('05', '', `
  <p class="mono">How we work</p>
  <h2 style="margin-top:5mm">Four steps, and you see<br/>every one of <i>them.</i></h2>
  <div class="steps">
    ${steps.map(([n, t, d]) => `<div class="st"><div class="n">${n}</div>
      <div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
  </div>
  <p class="lede" style="margin-top:12mm;max-width:148mm">You deal with the people building the thing.
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
  <p class="lede" style="margin-top:11mm;max-width:152mm">Tell us what you are working on. We will tell
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
