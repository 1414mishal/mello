// Generates every Summit Studios brochure as HTML, ready for html-to-pdf.mjs.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { HERE, LOGO, page, cover, contactBlock, doc } from './kit.mjs';

const shot = (name) => {
  const p = join(HERE, 'shots', `${name}.jpg`);
  if (!existsSync(p)) throw new Error('missing screenshot: ' + name);
  return `data:image/jpeg;base64,${readFileSync(p).toString('base64')}`;
};
const favicon = (name) =>
  `data:image/png;base64,${readFileSync(join(HERE, '..', '..', 'images', 'favicons', `${name}.png`)).toString('base64')}`;

const out = {};

/* ─────────────────────────  01 · Company  ───────────────────────── */
{
  const services = [
    ['01', 'Websites that bring in customers', 'Fast, mobile-first sites that turn a visitor into a booked appointment or a paying customer.',
      ['Clinic & practice sites', 'Business & brand sites', 'E-commerce stores', 'SEO & Google setup']],
    ['02', 'Web apps & dashboards', 'Dependable web apps on a clean foundation that will not fall apart as you grow.',
      ['Dashboards & portals', 'Internal tools', 'Marketplaces', 'SaaS products']],
    ['03', 'Custom CRMs & software', 'Software shaped around how you actually work, not a tool you have to bend to fit.',
      ['Lead & patient management', 'Reporting', 'Workflow automation', 'Integrations']],
    ['04', 'iOS & Android apps', 'Apps that feel quick, taken all the way through to the App Store and Play Store.',
      ['iOS & Android', 'Cross-platform', 'Offline-first', 'App store launch']],
    ['05', 'Backend, maintenance & growth', 'Secure APIs and databases that carry real traffic, plus ongoing fixes and new features.',
      ['APIs & databases', 'Cloud & integrations', 'Monitoring', 'Ongoing support']],
  ];
  const why = [
    ['You talk to the people building it', 'No account manager in the middle, no handover to a junior team once the contract is signed. The person who understands your project is the person writing the code.'],
    ['We tell you when to spend less', 'If a smaller build gets you the same result, we will say so. Talking someone into work they do not need is a bad way to earn a second project.'],
    ['Nothing is a template', 'Every build starts from your business, not from a theme with your logo dropped in. That is why none of our sites look like each other.'],
    ['We are still there after launch', 'Launch is the halfway point. We keep things patched, quick and improving as you learn what your customers actually do.'],
  ];
  out['Summit-Studios-Company-Brochure'] = doc('Summit Studios — Company Brochure', [
    cover('Websites · Software · Apps',
      'We build fast, sharp software that holds up when it actually <i>matters.</i>',
      'Summit Studios is a small, senior studio in Mangaluru. We design and build websites and custom software for clinics, founders and growing businesses — end to end, so you can get on with running the place.',
      ['Websites', 'Web apps', 'Custom CRMs', 'Mobile apps', 'Backend & support']),

    page('02', '', `
      <p class="mono">Who we are</p>
      <h2 style="margin-top:5mm">Small on purpose.</h2>
      <p class="lede" style="margin-top:8mm;max-width:152mm">Summit Studios is a senior team working out of
        Mangaluru with clients across India and beyond. We have shipped sites and systems for surgeons,
        clinics, an enterprise software firm, a spice brand, a design studio and a pre-university college —
        which sounds scattered until you notice the common thread: each one needed something built properly
        and looked after afterwards.</p>
      <p class="lede" style="margin-top:6mm;max-width:152mm">We stay small deliberately. It means the person
        who takes your call is the person who builds the thing, and it means we can say no to work we are
        not right for instead of filling a bench.</p>
      <div class="stats">
        <div><dt>1:1</dt><dd>Senior team, no juniors</dd></div>
        <div><dt>&lt;24h</dt><dd>Average reply time</dd></div>
        <div><dt>100%</dt><dd>Custom build, no templates</dd></div>
        <div><dt>A → Z</dt><dd>Idea to launch, in-house</dd></div>
      </div>`),

    page('03', '', `
      <p class="mono">What we do</p>
      <h2 style="margin-top:5mm">Two things, done <i>properly.</i></h2>
      <p class="lede" style="margin-top:7mm;max-width:150mm">Websites that bring you customers, and the
        software that runs everything behind them. Both built in-house, by the same people.</p>
      <div class="svc">
        ${services.map(([n, t, d, tags]) => `<div class="row"><div class="num">${n}</div>
          <div><h3>${t}</h3><p>${d}</p>
          <ul>${tags.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>`).join('')}
      </div>`),

    page('04', '', `
      <p class="mono">Our approach</p>
      <h2 style="margin-top:5mm">Understand it first.<br/>Build it <i>second.</i></h2>
      <div class="steps">
        ${[['01', 'Figure it out', 'We dig into what you are really trying to do before anyone writes a line of code. Often the brief you arrive with is not the problem worth solving.'],
           ['02', 'Design it', 'We sketch, prototype and get it in front of you early, so there are no surprises at the end and no six-week reveal that misses.'],
           ['03', 'Build it', 'We ship in small pieces you can see and use, instead of disappearing for months and hoping it lands.'],
           ['04', 'Look after it', 'After launch we keep it healthy and help it grow as you learn what your customers actually respond to.']]
          .map(([n, t, d]) => `<div class="st"><div class="n">${n}</div><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
      </div>
      <p class="lede" style="margin-top:10mm;max-width:150mm">You see the thing taking shape the whole way
        through. Nothing is revealed at the end for the first time.</p>`),

    page('05', '', `
      <p class="mono">Why businesses work with us</p>
      <h2 style="margin-top:5mm">The reasons clients<br/>actually <i>give.</i></h2>
      <div class="deep">
        ${why.map(([t, d]) => `<div class="item"><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>`),

    page('06', '', `
      <p class="mono">Start a conversation</p>
      <h2 style="margin-top:5mm">Tell us what you are<br/>working <i>on.</i></h2>
      <p class="lede" style="margin-top:9mm;max-width:152mm">We will tell you honestly whether we are the
        right people for it, roughly what it takes, and what we would do first. No obligation, and no
        sales call.</p>
      ${contactBlock()}`),
  ]);
}

/* ─────────────────────────  02 · Portfolio  ───────────────────────── */
{
  const projects = [
    ['prasannatechnologies', 'Enterprise software · 4 countries', 'Prasanna Technologies', 'prasannatechnologies.com',
      'A corporate site for a firm selling into government and utility procurement, where a multi-year contract can hinge on how established you look. Capabilities, product portfolio, certifications and careers, in light and dark modes.'],
    ['semnox', 'Entertainment technology · Worldwide', 'Semnox', 'semnoxrevamp.vercel.app',
      'A platform revamp for technology running theme parks, family entertainment centres and F&B venues globally. Organised around three product suites and the venue types they serve, so each operator finds their own path fast.'],
    ['drvivianortho', 'Orthopaedic surgery · Mangaluru', "Dr. Vivian R D'Almeida", 'drvivianortho.com',
      'For the surgeon behind coastal Karnataka’s first robotic hip replacement. Built around the conditions patients actually search for, with a patient-journey section that sets expectations before the first visit.'],
    ['drmariamanjumifthikar', 'Gynaecologic oncology · Mangaluru', 'Dr. Mariam Anjum Ifthikar', 'drmariamanjumifthikar.com',
      'Professor and Head of Gynaec-Oncology, with two decades in cancer care. A cancer diagnosis is the hardest moment to design for, so the site carries a serious academic record and genuine warmth at once.'],
    ['creativeconcepts', 'Interior design studio · Mumbai', 'Creative Concepts', 'Interior & exterior design',
      'In design the portfolio is the pitch. Full-bleed project photography and an editorial type treatment make fifteen years of work feel aspirational before a word is read.'],
    ['ahanaher', 'Home healthcare · Mangaluru', 'Ahana Her', 'ahanaher.com',
      'At-home physiotherapy, psychology and child development. Arranging care for a family member is a trust decision made under stress, so the site is built around a clear three-step path from enquiry to care.'],
    ['drkarthikaithal', 'Plastic & reconstructive surgery', 'Dr. Karthik Aithal', 'drkarthikaithal.com',
      'A microsurgery-trained reconstructive surgeon. Reconstructive work carries real emotional weight, so the site leads on the outcome — reconstruct, refine, restore confidence — and keeps the surgical record close behind.'],
    ['niksmasala', 'Spice brand · Mangalore', "Nik's Masala", 'niksmasala.com',
      'A local spice brand moving to direct-to-consumer and wholesale. Food sells on appetite and provenance, so the range leads, recipe videos show the blends in use, and a separate route handles retailers and gifting.'],
    ['jnanachetana', 'Education · Udupi district', 'Hindu PU College, Shirva', 'hjcshirva.com',
      'A pre-university college judged in admissions season by parents comparing options. Course combinations, competitive exam coaching, faculty, facilities and notices all reachable in a click.'],
  ];
  const card = ([img, kicker, name, url, desc]) => `<div class="p">
    <img src="${shot(img)}" alt="" />
    <div><p class="k">${kicker}</p><h3>${name}</h3><p>${desc}</p><p class="url">${url}</p></div>
  </div>`;

  const pages = [
    cover('Selected work',
      'Work we put our <i>name on.</i>',
      'A selection from the sites we have designed and built. Every one is live, so you can open any of them and judge for yourself rather than take our word for it.',
      ['Healthcare', 'Enterprise', 'Retail & brand', 'Education', 'Design']),
  ];
  for (let i = 0; i < projects.length; i += 3) {
    const n = String(pages.length + 1).padStart(2, '0');
    pages.push(page(n, '', `
      ${i === 0 ? '<p class="mono">Selected work</p><h2 style="margin-top:5mm">Live sites, real <i>businesses.</i></h2>' : '<p class="mono">Selected work — continued</p>'}
      <div class="proj">${projects.slice(i, i + 3).map(card).join('')}</div>`));
  }
  pages.push(page(String(pages.length + 1).padStart(2, '0'), '', `
    <p class="mono">And the rest</p>
    <h2 style="margin-top:5mm">Dozens more, all <i>live.</i></h2>
    <p class="lede" style="margin-top:8mm;max-width:152mm">Beyond the ten on these pages we have shipped
      dozens of sites across clinics, dental practices, speciality hospitals, retail brands and
      professional services — most of them in and around Mangaluru.</p>
    <p class="lede" style="margin-top:6mm;max-width:152mm">The full portfolio, with a breakdown of what
      each site does and how it was built, lives at ${'summitxstudio.com'}. Ask us for the link.</p>
    ${contactBlock()}`));
  out['Summit-Studios-Website-Portfolio'] = doc('Summit Studios — Website Portfolio', pages);
}

/* ─────────────────────────  03 · Capabilities  ───────────────────────── */
{
  const groups = [
    ['01', 'Design', 'Every site is drawn from scratch around your business. No themes, no page builders, and no two of our sites looking like cousins.',
      ['Custom design', 'Brand-led type & colour', 'Light & dark modes', 'Photography direction', 'Editorial layouts']],
    ['02', 'Mobile & responsive', 'Built phone-first and tested that way round, because that is where most of your customers actually arrive.',
      ['Phone-first build', 'Tablet & desktop', 'Touch-friendly targets', 'Tested on real devices']],
    ['03', 'Booking & enquiry', 'The point of the site. Whatever route your customer prefers, it should take one tap.',
      ['Appointment booking', 'Enquiry forms', 'WhatsApp handoff', 'Click-to-call', 'Callback requests']],
    ['04', 'Forms & data', 'Forms that validate properly, land in your inbox reliably, and do not lose an enquiry when someone fat-fingers a field.',
      ['Multi-step forms', 'Validation', 'File uploads', 'Email routing', 'Spam protection']],
    ['05', 'Integrations', 'Your site should talk to the tools you already use rather than become another island.',
      ['Google Maps', 'Analytics', 'Payment gateways', 'Calendars', 'CRM & sheets', 'Review platforms']],
    ['06', 'Motion & interaction', 'Movement used to guide attention, never for its own sake, and never at the cost of speed.',
      ['Scroll animations', 'Canvas & shader motion', 'Carousels', 'Video backgrounds', 'Micro-interactions']],
    ['07', 'CMS & admin panels', 'Edit your own content without calling us, on a panel built for the way you actually update things.',
      ['Content editing', 'Media library', 'Role-based access', 'Notices & blog', 'Custom dashboards']],
    ['08', 'SEO foundations', 'The groundwork that decides whether Google can read your site properly and whether a shared link looks like anything.',
      ['Titles & descriptions', 'Structured data', 'Sitemap & robots', 'Social preview cards', 'Speed & Core Web Vitals']],
  ];
  out['Summit-Studios-Website-Capabilities'] = doc('Summit Studios — Website Capabilities', [
    cover('Capabilities',
      'Everything we can build<br/>into a <i>website.</i>',
      'A plain list of what is on the table, so you can point at the parts you need instead of guessing what is possible. Most sites use some of this. None of it is an add-on we invented to pad an invoice.',
      ['Design', 'Booking', 'Forms', 'Integrations', 'Motion', 'CMS', 'SEO']),
    ...[0, 4].map((i, idx) => page(String(idx + 2).padStart(2, '0'), '', `
      <p class="mono">${idx === 0 ? 'What we can build' : 'What we can build — continued'}</p>
      ${idx === 0 ? '<h2 style="margin-top:5mm">The full <i>toolkit.</i></h2>' : ''}
      <div class="svc">
        ${groups.slice(i, i + 4).map(([n, t, d, tags]) => `<div class="row"><div class="num">${n}</div>
          <div><h3>${t}</h3><p>${d}</p><ul>${tags.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>`).join('')}
      </div>`)),
    page('04', '', `
      <p class="mono">How it comes together</p>
      <h2 style="margin-top:5mm">You do not need<br/>all of <i>it.</i></h2>
      <p class="lede" style="margin-top:9mm;max-width:152mm">A single-doctor clinic usually needs a clean
        site, booking, a map and solid SEO. A multi-branch practice needs a CMS and role-based access. A
        retail brand needs payments and a product catalogue.</p>
      <p class="lede" style="margin-top:6mm;max-width:152mm">We will tell you which of these actually
        moves the needle for your situation, and which ones would just be us charging you for work you
        do not need yet.</p>
      ${contactBlock()}`),
  ]);
}

/* ─────────────────────────  04 · Process  ───────────────────────── */
{
  const steps = [
    ['01', 'Consultation', 'A conversation, not a pitch. What the business does, who you are trying to reach, what is not working now, and what a good outcome looks like in six months.'],
    ['02', 'Strategy', 'We agree what the site is actually for — bookings, credibility, sales — and what belongs on it. This is where we cut the pages nobody will read.'],
    ['03', 'Design', 'Layouts and visual direction, shown early and in the browser rather than as a flat picture, so you can see how it really behaves.'],
    ['04', 'Development', 'The build, shipped in pieces you can open and click through as they land. No disappearing for six weeks.'],
    ['05', 'Review', 'You go through it properly on your own phone and laptop. We fix, adjust and refine until it is right, and we expect revisions.'],
    ['06', 'Launch', 'Domain, hosting, SSL, analytics, Google setup and the social preview cards. We handle the technical side so nothing breaks on day one.'],
    ['07', 'Support', 'Ongoing fixes, tuning, content updates and new features as you learn what your customers respond to. The people who built it are the people who look after it.'],
  ];
  out['Summit-Studios-Website-Process'] = doc('Summit Studios — Website Process', [
    cover('How a website gets built',
      'Seven steps, and you<br/>see every <i>one.</i>',
      'Most people have been burned by a web project that went quiet for a month and came back wrong. This is exactly how ours run, so you know what happens next at every stage.',
      ['Consultation', 'Strategy', 'Design', 'Development', 'Review', 'Launch', 'Support']),
    page('02', '', `
      <p class="mono">The process</p>
      <h2 style="margin-top:5mm">Start to <i>finish.</i></h2>
      <div class="steps">
        ${steps.map(([n, t, d]) => `<div class="st"><div class="n">${n}</div>
          <div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
      </div>`),
    page('03', '', `
      <p class="mono">What we need from you</p>
      <h2 style="margin-top:5mm">Not much, <i>honestly.</i></h2>
      <div class="deep">
        <div class="item"><h3>An hour at the start</h3><p>One proper conversation about the business is worth more than twenty emails later. Everything else we can work around.</p></div>
        <div class="item"><h3>Your content, or a steer</h3><p>Text, photos, logos and credentials if you have them. If you do not, we will draft and you correct — that is usually faster anyway.</p></div>
        <div class="item"><h3>Honest feedback at review</h3><p>Tell us what is wrong plainly. Revisions are part of the job, not an inconvenience, and a polite nod at review costs everyone more later.</p></div>
        <div class="item"><h3>Someone who can decide</h3><p>Projects stall when nobody can approve. One decision-maker keeps it moving.</p></div>
      </div>
      ${contactBlock()}`),
  ]);
}

/* ─────────────────────────  05 · Why your website matters  ───────────────────────── */
{
  const points = [
    ['Trust is decided in seconds', 'Someone lands on your site and forms a judgement before reading a word. For a clinic or a professional practice, an outdated site quietly suggests everything else is outdated too — and that impression is difficult to argue your way out of afterwards.'],
    ['Enquiries depend on the path', 'Most sites lose people not because the design is poor but because the next step is unclear. If booking, WhatsApp or a phone number is not exactly where the reader is ready to act, interest dies at the point it was strongest.'],
    ['Google reads structure, not intent', 'Search engines cannot see how good you are. They read titles, descriptions, structured data and speed. Without those, a genuinely better practice loses the search to a worse one that got the basics right.'],
    ['Speed is a conversion issue', 'On patchy mobile data, every extra second costs you people who never see the page at all. They do not complain — they simply go back and tap the next result.'],
    ['Perception carries a premium', 'How your brand looks changes what people expect to pay and who they compare you to. A serious site puts you in a different comparison set than a template with your logo dropped in.'],
  ];
  out['Summit-Studios-Why-Your-Website-Matters'] = doc('Summit Studios — Why Your Website Matters', [
    cover('The case for doing it properly',
      'What a website<br/>actually <i>changes.</i>',
      'Not the usual talk about online presence. Five specific ways a website affects whether people trust you, find you and get in touch — and what goes wrong when it is left as it is.',
      ['Trust', 'Enquiries', 'Google visibility', 'Conversion', 'Brand perception']),
    page('02', '', `
      <p class="mono">Why it matters</p>
      <h2 style="margin-top:5mm">Five things it<br/>quietly <i>decides.</i></h2>
      <div class="deep">
        ${points.slice(0, 3).map(([t, d]) => `<div class="item"><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>`),
    page('03', '', `
      <p class="mono">Why it matters — continued</p>
      <div class="deep" style="margin-top:6mm">
        ${points.slice(3).map(([t, d]) => `<div class="item"><h3>${t}</h3><p>${d}</p></div>`).join('')}
      </div>
      <p class="lede" style="margin-top:12mm;max-width:152mm">None of this argues that everyone needs an
        expensive website. It argues that if people are searching for what you do, the site is doing a job
        whether you designed it to or not — and it is worth knowing which way it is going.</p>
      ${contactBlock()}`),
  ]);
}

/* ─────────────────────────  06 · Website audit  ───────────────────────── */
{
  const checks = [
    ['Mobile experience', 'Does it work properly on a phone — readable type, tappable buttons, nothing overflowing sideways? This is where most of your visitors are.'],
    ['Loading speed', 'Uncompressed images and heavy page builders cost seconds. People leave before the page appears and you never know they came.'],
    ['A clear next step', 'Is booking, WhatsApp or a phone number visible without scrolling and hunting? Interest fades fast when the path is unclear.'],
    ['Current design', 'Does it look like it was built this decade? Fair or not, an outdated site suggests an outdated practice.'],
    ['Structure & navigation', 'Can someone find what they came for in two clicks, or is everything buried under a vague menu?'],
    ['Trust signals', 'Credentials, reviews, real photographs, clear location and contact details. Their absence is felt even when it is not noticed.'],
    ['Google foundations', 'Titles, descriptions, structured data and a sitemap. Without them, Google struggles to show you properly.'],
    ['Link previews', 'When the link is shared on WhatsApp, does a proper card appear or just a bare URL? It affects whether anyone taps it.'],
  ];
  out['Summit-Studios-Website-Audit'] = doc('Summit Studios — Website Audit', [
    cover('Website audit',
      'Eight things that<br/>cost you <i>enquiries.</i>',
      'A short review of an existing website against the eight issues we see most often. Each one is something a visitor reacts to without ever telling you about it.',
      ['Mobile', 'Speed', 'Structure', 'Trust', 'SEO']),
    page('02', '', `
      <p class="mono">Prepared for</p>
      <div style="margin-top:5mm;display:grid;grid-template-columns:1fr 1fr;gap:6mm 8mm;max-width:150mm">
        <div><p class="mono" style="font-size:8pt">Business</p>
          <div style="margin-top:3mm;border-bottom:1px solid rgba(255,255,255,0.3);height:9mm"></div></div>
        <div><p class="mono" style="font-size:8pt">Website</p>
          <div style="margin-top:3mm;border-bottom:1px solid rgba(255,255,255,0.3);height:9mm"></div></div>
        <div><p class="mono" style="font-size:8pt">Reviewed on</p>
          <div style="margin-top:3mm;border-bottom:1px solid rgba(255,255,255,0.3);height:9mm"></div></div>
        <div><p class="mono" style="font-size:8pt">Reviewed by</p>
          <div style="margin-top:3mm;border-bottom:1px solid rgba(255,255,255,0.3);height:9mm"></div></div>
      </div>
      <h2 style="margin-top:12mm">What we <i>checked.</i></h2>
      <div class="audit">
        ${checks.slice(0, 5).map(([t, d]) => `<div class="a"><div class="box"></div>
          <div><h3>${t}</h3><p>${d}</p></div>
          <div class="score">Ok / Needs work</div></div>`).join('')}
      </div>`),
    page('03', '', `
      <p class="mono">What we checked — continued</p>
      <div class="audit" style="margin-top:6mm">
        ${checks.slice(5).map(([t, d]) => `<div class="a"><div class="box"></div>
          <div><h3>${t}</h3><p>${d}</p></div>
          <div class="score">Ok / Needs work</div></div>`).join('')}
      </div>
      <h2 style="margin-top:13mm">What we would fix <i>first.</i></h2>
      <div style="margin-top:7mm">
        ${[1, 2, 3].map((n) => `<div style="margin-bottom:7mm">
          <p class="mono" style="font-size:8pt">Priority ${n}</p>
          <div style="margin-top:4mm;border-bottom:1px solid rgba(255,255,255,0.22);height:7mm"></div>
        </div>`).join('')}
      </div>`),
    page('04', '', `
      <p class="mono">Notes</p>
      <h2 style="margin-top:5mm">Anything <i>else.</i></h2>
      <div style="margin-top:9mm">
        ${[1, 2, 3, 4].map(() => `<div style="margin-top:4mm;border-bottom:1px solid rgba(255,255,255,0.22);height:9mm"></div>`).join('')}
      </div>
      <p class="note" style="margin-top:10mm;max-width:150mm">This audit is a starting point for a
        conversation, not a sales quote. Plenty of sites need one or two fixes rather than a rebuild, and
        we will say so when that is the case.</p>
      ${contactBlock()}`),
  ]);
}

/* ─────────────────────────  07 · Testimonials  ───────────────────────── */
{
  const quotes = [
    ['Really appreciate the effort and patience your team showed, especially with all the revisions. Professional throughout.', 'Dr. Shravan Shetty', 'Orthodontist', 'drshravanshetty'],
    ['Thank you for your meticulous work. Genuinely nice having you do the job.', 'Dr. Shannon Fernandes', 'Gynaecologist', 'drshannonfernandes'],
    ['They understood what we needed without much back and forth. Clean, professional, and our patients find it easy to use.', 'Dr. Dheeraj', 'Founder, Rivelin Aligners', 'rivelinaligners'],
    ['Got exactly what I asked for, no unnecessary complications. Easy to work with and delivered on time.', "Dr. Joylene D'Almeida", 'Obstetrician & Gynaecologist', 'drjoylenegynaec'],
    ['Quick, reliable, and they did not make me chase them for updates. The final result looked better than I expected.', 'Dr. Mariam Anjum Ifthikar', 'Gynaec-Oncologist & Robotic Surgeon', 'drmariamanjumifthikar'],
    ['Clean work, fast turnaround. They kept things simple and the end result speaks for itself.', "Dr. Vivian R D'Almeida", 'Orthopaedic Surgeon', 'drvivianortho'],
    ['We needed a team that could keep up with our pace and actually deliver. They did, no drama.', 'Prasanna Technologies', 'Software Firm', 'prasannatechnologies'],
  ];
  const q = ([text, name, role, icon]) => `<div class="q">
    <blockquote>“${text}”</blockquote>
    <div class="who"><img src="${favicon(icon)}" alt="" /><b>${name}</b><span>${role}</span></div>
  </div>`;
  out['Summit-Studios-Client-Testimonials'] = doc('Summit Studios — Client Testimonials', [
    cover('In their words',
      'What clients say<br/>when we are not <i>listening.</i>',
      'Surgeons, clinics and companies we have built for, in their own words. Every one of these people will take a call if you want to check with them directly.',
      ['Healthcare', 'Enterprise', 'Dental', 'Speciality clinics']),
    page('02', '', `
      <p class="mono">Client feedback</p>
      <h2 style="margin-top:5mm">From the people<br/>we built <i>for.</i></h2>
      <div class="quotes">${quotes.slice(0, 4).map(q).join('')}</div>`),
    page('03', '', `
      <p class="mono">Client feedback — continued</p>
      <div class="quotes" style="margin-top:6mm">${quotes.slice(4).map(q).join('')}</div>
      <p class="lede" style="margin-top:11mm;max-width:152mm">Happy to put you in touch with any of them.
        We would rather you heard it from a client than from us.</p>
      ${contactBlock()}`),
  ]);
}

for (const [name, html] of Object.entries(out)) {
  writeFileSync(join(HERE, `${name}.html`), html);
  console.log('wrote', name + '.html');
}
