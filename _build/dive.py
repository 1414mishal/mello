"""The 'Why Summit' fly-through: eight sheets a Summit site is made of (kept from v1)."""
from content import WHY

# "Why Summit" fly-through: the eight sheets a Summit site is made of, two per reason.
DIVE_LAYERS = ['Grid', 'Structure', 'Type', 'Design', 'Build', 'Direct line', 'Live', 'After launch']
WHY_SHORT = ['Custom', 'Premium, faster', 'Direct line', 'After launch']
# Markup on the Build sheet. <b> tag names, <i> attribute names, <u> values (coloured by CSS, no semantics).
DIVE_CODE = [
    '&lt;<b>header</b> <i>class</i>=<u>"nav"</u>&gt;',
    '  &lt;<b>a</b> <i>class</i>=<u>"mark"</u> <i>href</i>=<u>"/"</u>&gt;Yourbrand&lt;/<b>a</b>&gt;',
    '  &lt;<b>nav</b>&gt;Work &middot; Services &middot; Contact&lt;/<b>nav</b>&gt;',
    '  &lt;<b>a</b> <i>class</i>=<u>"btn"</u> <i>href</i>=<u>"<span class="hl">/quote</span>"</u>&gt;Get a quote&lt;/<b>a</b>&gt;',
    '&lt;/<b>header</b>&gt;',
    '&lt;<b>main</b>&gt;',
    '  &lt;<b>section</b> <i>class</i>=<u>"hero"</u>&gt;',
    '    &lt;<b>h1</b>&gt;Work that speaks for itself.&lt;/<b>h1</b>&gt;',
    '    &lt;<b>p</b>&gt;Now your site does too.&lt;/<b>p</b>&gt;',
    '  &lt;/<b>section</b>&gt;',
    '  &lt;<b>form</b> <i>action</i>=<u>"<span class="hl">/enquire</span>"</u> <i>method</i>=<u>"post"</u>&gt;',
]
# (position %, label, note, marker colour token)
DIVE_AFTER = [(0, 'Launch', '', 'mint'), (22, 'Month 1', 'speed tune', 'orange'), (46, 'Month 3', 'new service page', 'teal'),
              (72, 'Month 6', 'booking integration', 'rust'), (100, 'Year 1', 'refresh', 'mint')]
DIVE_PALETTE = [('Cream', 'cream'), ('Sand', 'paper-2'), ('Taupe', 'taupe'), ('Plum', 'plum'), ('Deep plum', 'plum-deep'), ('Ink', 'ink')]


def dive_sheets():
    lab = lambda i: f'<p class="dive__lab mono"><span>{i + 1:02d}</span>{DIVE_LAYERS[i]}</p>'
    cols = ''.join(f'<line x1="{100 * k / 12:.3f}" y1="0" x2="{100 * k / 12:.3f}" y2="100" pathLength="1" data-draw/>' for k in range(1, 12))
    rows = ''.join(f'<line x1="0" y1="{12.5 * k}" x2="100" y2="{12.5 * k}" pathLength="1" data-draw/>' for k in range(1, 8))
    grid = f'''<div class="dive__layer dv-grid" data-layer="01 &mdash; Grid">{lab(0)}
        <svg class="dv-grid__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect class="dv-grid__cell" x="41.667" y="37.5" width="25" height="25" data-cell/>{cols}{rows}</svg>
        <p class="dv-grid__note mono" data-note>12 columns &middot; 8px baseline &middot; drawn for you, not downloaded</p>
      </div>'''
    wire = f'''<div class="dive__layer dv-wire" data-layer="02 &mdash; Structure">{lab(1)}
        <div class="dv-wire__grid">
          <div class="dv-wf dv-wf--nav" data-wf><span class="mono">nav</span></div>
          <div class="dv-wf dv-wf--hero" data-wf><span class="mono">hero &middot; 7 of 12</span></div>
          <div class="dv-wf dv-wf--side" data-wf><span class="mono">proof</span></div>
          <div class="dv-wf dv-wf--card" data-wf><span class="mono">service</span></div>
          <div class="dv-wf dv-wf--card" data-wf><span class="mono">service</span></div>
          <div class="dv-wf dv-wf--card" data-wf><span class="mono">service</span></div>
          <div class="dv-wf dv-wf--foot" data-wf><span class="mono">contact</span></div>
        </div>
      </div>'''
    type_ = f'''<div class="dive__layer dv-type" data-layer="03 &mdash; Type">{lab(2)}
        <h4 class="dv-type__h"><span class="dv-line"><span data-line>Your brand.</span></span><span class="dv-line"><span data-line><em class="dv-serif">Not</em> a template.</span></span></h4>
        <p class="dv-type__spec mono" data-spec>Bodoni Moda for display &middot; Pinyon Script for emphasis &middot; Geist for text</p>
        <ul class="dv-palette" aria-hidden="true">{''.join(f'<li data-chip style="--c:var(--{c})">{n}</li>' for n, c in DIVE_PALETTE)}</ul>
      </div>'''
    contours = ''.join(f'<path d="{d}" pathLength="1" data-draw/>' for d in [
        'M0 96 C30 70 70 112 120 86 S210 40 300 70', 'M0 128 C40 96 80 150 130 118 S220 70 300 104',
        'M0 158 C50 130 90 180 150 150 S240 110 300 140', 'M40 200 C70 170 120 184 150 164 S230 152 300 172'])
    design = f'''<div class="dive__layer dv-design" data-layer="04 &mdash; Design">{lab(3)}
        <div class="dv-page">
          <div class="dv-page__nav" data-ui><span class="dv-page__mark">Yourbrand</span><span class="dv-page__links"><i></i><i></i><i></i></span><span class="dv-page__btn">Get a quote</span></div>
          <div class="dv-page__hero">
            <div class="dv-page__copy" data-ui>
              <p class="dv-page__h">Work that speaks for itself. Now your site does too.</p>
              <p class="dv-page__cta"><span class="dv-page__btn dv-page__btn--mint" data-cta>Get a quote &rarr;</span></p>
            </div>
            <div class="dv-page__img" data-ui><svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">{contours}</svg></div>
          </div>
          <div class="dv-page__cards"><div class="dv-page__card" data-ui><i></i><i></i></div><div class="dv-page__card" data-ui><i></i><i></i></div><div class="dv-page__card" data-ui><i></i><i></i></div></div>
        </div>
        <p class="dv-design__tag mono" data-tag>Design &middot; weeks 1&ndash;2</p>
      </div>'''
    code_lines = ''.join(f'<span class="dv-code__l" data-cl>{l}</span>' for l in DIVE_CODE)
    build = f'''<div class="dive__layer dv-code" data-layer="05 &mdash; Build" data-far=".28">{lab(4)}
        <pre class="dv-code__pre mono" aria-hidden="true">{code_lines}</pre>
        <div class="dv-ruler" data-ruler>
          <span class="dv-ruler__fill" data-rfill></span>
          <span class="dv-ruler__tick mono" data-tick style="left:0">Week 1</span>
          <span class="dv-ruler__tick mono" data-tick style="left:33.3%">Week 2</span>
          <span class="dv-ruler__tick mono" data-tick style="left:66.6%">Week 3</span>
          <span class="dv-ruler__tick dv-ruler__tick--end mono" data-tick style="right:0"><b class="dv-live" data-live>Launch</b></span>
        </div>
      </div>'''
    team = f'''<div class="dive__layer dv-team" data-layer="06 &mdash; Direct line">{lab(5)}
        <div class="dv-team__box">
          <svg class="dv-team__svg" viewBox="0 0 240 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M12 50 C108 50 132 25 228 25" pathLength="1" data-wire/>
            <path d="M12 50 C108 50 132 75 228 75" pathLength="1" data-wire/>
          </svg>
          <div class="dv-team__pos" style="left:5%;top:50%"><span class="dv-node dv-node--you" data-node>You</span></div>
          <div class="dv-team__pos" style="left:95%;top:25%"><span class="dv-node dv-node--des" data-node>Designer</span></div>
          <div class="dv-team__pos" style="left:95%;top:75%"><span class="dv-node dv-node--dev" data-node>Developer</span></div>
          <div class="dv-team__pos" style="left:50%;top:50%"><span class="dv-node dv-node--am" data-am>Account manager<i class="dv-node__strike" data-strike></i></span></div>
        </div>
        <p class="dv-team__note mono" data-note>Same people from the first call to launch</p>
      </div>'''
    live = f'''<div class="dive__layer dv-livesheet" data-layer="07 &mdash; Live">{lab(6)}
        <div class="dv-frame" data-frame>
          <div class="dv-frame__bar"><span class="dv-frame__lights"><i></i><i></i><i></i></span><span class="dv-frame__url mono">yourbrand.com</span><span class="dv-live" data-tag>Live</span></div>
          <svg class="dv-pulse" viewBox="0 0 320 60" preserveAspectRatio="none" aria-hidden="true"><path data-pulse pathLength="1" d="M0 30H70l6 0 6-18 6 36 6-18h90l6 0 6-12 6 24 6-12h60l6 0 6-18 6 36 6-18H320"/></svg>
          <ul class="dv-stats mono"><li data-stat>Monitoring <b>on</b></li><li data-stat>Backups <b>nightly</b></li><li data-stat>Security <b>patched</b></li><li data-stat>Certificate <b>valid</b></li></ul>
        </div>
      </div>'''
    ticks = ''.join(f'<span class="dv-ruler__tick{" dv-ruler__tick--end" if x == 100 else ""} mono" data-tick style="{"right:0" if x == 100 else f"left:{x}%"};--c:var(--{c})">{a}{f"<small>{b}</small>" if b else ""}</span>'
                    for x, a, b, c in DIVE_AFTER)
    after = f'''<div class="dive__layer dv-after" data-layer="08 &mdash; After launch">{lab(7)}
        <h4 class="dv-type__h dv-after__h"><span class="dv-line"><span data-line>Launch is</span></span><span class="dv-line"><span data-line>the <em class="dv-serif">start.</em></span></span></h4>
        <div class="dv-ruler dv-ruler--after" data-ruler><span class="dv-ruler__fill" data-rfill></span>{ticks}</div>
      </div>'''
    return grid + wire + type_ + design + build + team + live + after


def scene(video=None, poster=None):
    """Pinned 'Why Summit' scene: the visitor flies through the eight sheets a Summit site is
    made of while the four reasons enter from alternate sides (see buildDive() in motion.js)."""
    panels = ''.join(f"""<article class="dive__panel{' is-active' if i == 0 else ''}" data-panel data-side="{'left' if i % 2 == 0 else 'right'}">
          <p class="dive__num mono">{i + 1:02d} &nbsp;/&nbsp; 0{len(WHY)}</p>
          <h3 class="dive__t">{t}</h3>
          <p class="dive__p">{p}</p>
        </article>""" for i, (t, s, p) in enumerate(WHY))
    dots = ''.join(f'<button class="dive__dot{" is-active" if i == 0 else ""}" type="button" data-dot aria-current="{"true" if i == 0 else "false"}"><span>{i + 1:02d}</span>{WHY_SHORT[i]}</button>'
                   for i in range(len(WHY)))
    steps = ''.join(f'<li><span>{i + 1:02d}</span>{n}</li>' for i, n in enumerate(DIVE_LAYERS))
    stack = ''.join(f"""<div class="dive__row" data-reveal>
        <p class="dive__num mono">{i + 1:02d} &mdash; {s}</p>
        <h3 class="dive__t">{t}</h3>
        <p class="dive__p">{p}</p>
      </div>""" for i, (t, s, p) in enumerate(WHY))
    stage = (f'''<div class="dive__cam dive__cam--video" data-scene-stage aria-hidden="true">
      <div class="dive__frame"><video class="dive__video" data-scene-video data-src="{video}" poster="{poster}" muted playsinline preload="none"></video></div>
    </div>''' if video else f'''<div class="dive__cam" data-scene-stage aria-hidden="true">
      <div class="dive__world" data-dive-world>
        {dive_sheets()}
      </div>
    </div>''')
    return f"""<section class="dive{' dive--video' if video else ''}" id="why" aria-labelledby="why-t" data-scene{'' if video else ' data-dive'} data-length="440" data-rail="Why Summit">
  <div class="dive__pin">
    {stage}
    <div class="dive__hud">
      <p class="sec__eyebrow mono">Why Summit</p>
      <h2 class="dive__title" id="why-t">Why businesses pick us, and stay.</h2>
    </div>
    {'' if video else '<p class="dive__depth mono" aria-hidden="true"><span data-dive-layer>01 &mdash; Grid</span></p>'}
    <div class="dive__panels">
      {panels}
    </div>
    <div class="dive__dots" aria-label="Reasons">{dots}</div>
  </div>
  <div class="dive__stack">
    <p class="sec__eyebrow mono" data-reveal>Why Summit</p>
    <h2 class="dive__title" data-reveal>Why businesses pick us, and stay.</h2>
    <ol class="dive__steps mono" data-reveal aria-label="What a Summit site is made of">{steps}</ol>
    {stack}
  </div>
</section>"""


FAQ_ALL = [
    ('What does Summit Studios do?',
     'We design and build premium websites, then make them work harder: AI receptionists that answer calls and chats, WhatsApp automation for reminders and enquiries, and custom CRMs, web apps and dashboards. One team, end to end.'),
    ('Who do you work with?',
     'Established businesses worldwide: industrial and engineering firms, healthcare clinics, and trades, property and professional services.'),
    ('How much does a website cost?',
     "It depends on what the site has to do. Pricing guidance is on the way for each type of project. In the meantime, book a free 15-minute call and we'll give you a straight answer and a clear quote."),
    ('How long does it take?',
     "Faster than most agencies, because we design and build in-house with no hand-offs. You'll get a delivery date in the proposal, and we keep to it."),
    ('Can I update the site myself after launch?',
     "Yes. We either set you up to edit content yourself, or handle updates for you under a care plan. Either way, you're never stuck waiting on a developer to change a line of text."),
    ('Do you only build websites?',
     "No. Websites are where most clients start, but the biggest gains often come after: an AI receptionist that stops missed calls, WhatsApp reminders that cut no-shows, or a CRM built around how you actually work."),
    ('Can you work with us remotely?',
     "Yes. We work with clients worldwide and run every project remotely: calls at a time that suits you, clear written updates, and reviews at every stage."),
]


def faq(items):
    rows = ''.join(f'<details data-reveal><summary>{q}</summary><div class="faq__a"><p>{a}</p></div></details>' for q, a in items)
    return f'<div class="faq">{rows}</div>'


def blk(lines, sub, href='get-started.html', label='Book a free 15-minute call', top=False):
    """lines: list of lists of (word, 'ink'|'paper'). Arrow goes at the end of the last line."""
    out = ''
    for li, line in enumerate(lines):
        words = ''.join(f'<span class="blk__w blk__w--{k}">{w}</span>' for w, k in line)
        go = f'<a class="blk__go" href="{href}" aria-label="{label}"><span class="ar">&rarr;</span></a>' if li == len(lines) - 1 else ''
        out += f'<span class="blk__line">{words}{go}</span>'
    style = ' style="border-top:0"' if top else ''
    return f'''<section class="blk" aria-labelledby="blk-t"{style}>
    <video class="blk__video" muted loop playsinline preload="none" data-src="assets/video/halftone.mp4" aria-hidden="true"></video>
    <div class="blk__screen" aria-hidden="true"></div>
    {MARK.replace('class="mark"', 'class="blk__mark"')}
    <h2 class="blk__t" id="blk-t">{out}</h2>
    <div class="blk__sub" data-reveal>
      <p>{sub}</p>
      <a class="btn btn--solid" href="{href}">{label} <span class="ar">&rarr;</span></a>
    </div>
  </section>'''


def review_band(id_='review'):
    return f'''<section class="review" id="{id_}">
    <div class="review__grid">
      <div>
        <p class="mono" data-reveal>Not ready for a call?</p>
        <h2 class="review__t" style="margin-top:20px" data-split>Get a free review of your current website.</h2>
        <p class="review__p" data-reveal>Send us the link. We'll reply with a short video or written note on what we'd change and why. No pitch, no obligation.</p>
      </div>
      <form class="form" data-demo data-reveal novalidate>
        <div class="field"><label class="mono" for="rv-url">Your website</label><input id="rv-url" name="url" type="url" placeholder="https://" required inputmode="url"></div>
        <div class="field"><label class="mono" for="rv-email">Where to send it</label><input id="rv-email" name="email" type="email" placeholder="you@company.com" required></div>
        <div class="form__actions">
          <button class="btn btn--solid" type="submit">Send me the review <span class="ar">&rarr;</span></button>
          <span class="form__hint">Usually within two working days.</span>
        </div>
        <div class="form__ok" role="status"><p class="mono">Received</p><p style="margin-top:8px">Thanks. We'll take a look and send your review to that address.</p></div>
      </form>
    </div>
  </section>'''


# "Our solutions": (anchor on services.html, list label, headline, one-line description)
SOLUTIONS = [
    ('websites', 'Web design &amp; development', 'Web Design &amp; Development',
     'Distinctive, high-performance websites designed to elevate your brand and convert visitors into customers.'),
    ('ai-receptionists', 'AI receptionists', 'AI Receptionists',
     'A smart assistant that answers your phone and chat around the clock, books appointments and captures every lead.'),
    ('whatsapp', 'WhatsApp automation', 'WhatsApp Automation',
     'Reminders that cut no-shows, instant replies and chatbots that qualify leads, on the app your customers already use.'),
    ('crm', 'Custom CRM &amp; software', 'Custom CRM &amp; Software',
     'Software shaped around how you actually work: leads, patients, admin and reporting in one place.'),
    ('web-apps', 'Web apps &amp; dashboards', 'Web Apps &amp; Dashboards',
     "Fast, dependable portals, dashboards and internal tools, built on a foundation that won't fall apart as you grow."),
    ('backend', 'Backend &amp; maintenance', 'Backend &amp; Maintenance',
     "Secure APIs, integrations, monitoring and ongoing support. We don't vanish once it's live."),
]
SOL_POSTER = 'assets/img/solutions.jpg'


def sol_title(h):
    """Service title with its last word set in the italic serif accent, e.g. 'Backend &amp; <em>Maintenance</em>'."""
    head, _, last = h.rpartition(' ')
    return f'{head} <em class="sol__em">{last}</em>' if head else f'<em class="sol__em">{h}</em>'


