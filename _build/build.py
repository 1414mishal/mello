#!/usr/bin/env python3
"""Generates the Summit Studios pages into the site folder.  Run:  python3 _build/build.py

v3 (October 2026): modelled on Shopify Editions Winter '26. A fixed left sidebar carries the
edition wordmark and a chapter list with roman numerals; each chapter opens on a full-screen
Renaissance-style painting with a giant one-word headline and a serif lead with a swash
initial, then its content scrolls over the painting as it fades to the greige page.
Copy lives in content.py, the "Why Summit" fly-through in dive.py, layout here. Every local
asset link gets a ?v=<hash> fingerprint because vercel.json caches /assets for a year.
"""
import hashlib
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from content import PROJECTS, SERVICES, INDUSTRIES, WHY, FAQ_ALL, VOICES   # noqa: E402
from dive import scene as why_scene                                # noqa: E402

OUT = pathlib.Path(__file__).resolve().parent.parent
SITE = 'https://www.summitxstudio.com/'
ASSET_RE = re.compile(r'assets/[A-Za-z0-9_./-]+\.(?:css|js|svg|jpg|jpeg|png|webp|mp4)')
ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']


PAGE_HREF = re.compile(r'href="([a-z-]+)\.html(#[^"]*)?"')


def clean_urls(html):
    """Internal links point at the clean addresses Vercel serves (studio.html -> /studio),
    so a click never goes through a redirect."""
    return PAGE_HREF.sub(lambda m: f'href="/{"" if m.group(1) == "index" else m.group(1)}{m.group(2) or ""}"', html)


def fingerprint(html):
    def sub(m):
        p = OUT / m.group(0)
        h = hashlib.sha1(p.read_bytes()).hexdigest()[:8] if p.exists() else 'missing'
        return f'{m.group(0)}?v={h}'
    return ASSET_RE.sub(sub, html)


# ---------- small pieces ----------

def swash(text):
    """Serif narrative with a flourished first letter, as on the reference."""
    return f'<span class="swash">{text[0]}</span>{text[1:]}'


def chip(label, href, external=False):
    ext = ' target="_blank" rel="noopener"' if external else ''
    return f'<a class="chip" href="{href}"{ext}>{label}<span class="chip__ar">&nearr;</span></a>'


IHB_ARROW = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def ihb(label, href, cls='', aria='', external=False):
    """The user's InteractiveHoverButton, in the site's colours: a paper pill with an ink dot by the word;
    on hover the dot floods the pill, the word slides out and 'label ->' slides in. cls: ihb--auto (sizes
    to a longer label), ihb--big (the main call to action), ihb--screen (on the Why us laptop screen)."""
    ext = ' target="_blank" rel="noopener"' if external else ''
    lab = f' aria-label="{aria}"' if aria else ''
    return (f'<a class="ihb{(" " + cls) if cls else ""}" href="{href}"{ext}{lab}>'
            f'<span class="ihb__t">{label}</span><span class="ihb__in" aria-hidden="true"><span>{label}</span>{IHB_ARROW}</span><span class="ihb__dot" aria-hidden="true"></span></a>')


def pill(label, href, cls=''):
    return f'<a class="pill {cls}" href="{href}">{label}</a>'


def feat_grid(items, cls=''):
    """Two-column feature grid: bold label, bold muted description. Label-only lists get three columns.
    An item may carry a third element: decorative art drawn behind that card."""
    def cell(it):
        t, p, art = (list(it) + [''])[:3]
        return (f'<div class="fg__item fg__item--art" data-grow>{art}<h4 class="fg__t">{t}</h4><p class="fg__p">{p}</p></div>' if art
                else f'<div class="fg__item"><h4 class="fg__t">{t}</h4><p class="fg__p">{p}</p></div>')
    cells = ''.join(cell(it) for it in items)
    if not cls and all(not it[1] for it in items): cls = 'fg--labels'
    return f'<div class="fg {cls}" data-reveal>{cells}</div>'


def spot(label, narrative, link_label=None, href=None, external=False):
    """A feature spotlight: bold label, serif narrative, chip."""
    c = chip(link_label, href, external) if link_label else ''
    return f'<div class="spot" data-reveal><p class="spot__t">{label}</p><p class="n2">{narrative}</p>{c}</div>'


def media(src, alt, cls='', w=1344, h=752):
    return f'<figure class="media {cls}" data-reveal><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async"></figure>'


DAVINCI = '''<svg class="dv" viewBox="0 0 340 464" aria-hidden="true">
  <circle cx="170" cy="232" r="150" pathLength="1"/><circle cx="170" cy="232" r="100" pathLength="1"/><circle cx="170" cy="232" r="46" pathLength="1"/>
  <line x1="170" y1="4" x2="170" y2="460" pathLength="1"/><line x1="4" y1="232" x2="336" y2="232" pathLength="1"/>
  <line x1="4" y1="4" x2="336" y2="460" pathLength="1"/><line x1="336" y1="4" x2="4" y2="460" pathLength="1"/>
  <rect x="20" y="82" width="300" height="300" pathLength="1"/>
  <path d="M20 232 A150 150 0 0 1 320 232" pathLength="1"/><path d="M64 126 A150 150 0 0 0 64 338" pathLength="1"/>
  <circle cx="170" cy="232" r="2" pathLength="1"/>
</svg>'''


# ---------- shell ----------

NAV = [('industries.html', 'Industries'), ('projects.html', 'Projects'), ('studio.html', 'Studio')]   # Contact is the button at the right of the header


def header(file=''):
    cur = ' aria-current="page"'
    links = ''.join(f'<a class="hdr__link" href="{h}"{cur if h == file else ""}>{t}</a>' for h, t in NAV)
    return f'''<header class="hdr" data-hdr>
  <a class="hdr__brand" href="index.html"><svg class="hdr__mark" viewBox="0 0 48 48" aria-hidden="true"><path d="M4 38 18 10l6 12 5-8 15 24z" fill="currentColor"/><path d="M4 43h40" stroke="currentColor" stroke-width="2"/></svg>Summit Studios</a>
  <nav class="hdr__nav" id="nav" aria-label="Main">{links}</nav>
  <div class="hdr__right">
    <a class="pill pill--hdr pill--go" href="contact.html"{cur if file == 'contact.html' else ''}><span class="pill__t">Contact</span><span class="pill__ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 17 17 7M7 7h10v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>
    <button class="hdr__menu" type="button" data-menu aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span></button>
  </div>
</header>'''


def sidebar(chapters, mark, sub):
    """Fixed left column: wordmark, chapter list with numerals, legal. The list starts centred
    inside the hero's drafting box and docks to the sidebar on scroll (motion.js)."""
    items = ''.join(f'<li><a href="#{cid}" data-ch-link="{cid}"><span class="sb__name">{name}</span><span class="sb__lead"></span><span class="sb__num">{ROMAN[i]}</span></a></li>'
                    for i, (cid, name) in enumerate(chapters))
    return f'''<aside class="sb" id="chapters-index" data-sb>
  <nav class="sb__box" data-sb-box aria-label="Chapters">
    {DAVINCI}
    <a class="sb__mark h4" href="#top">{mark}</a>
    <p class="sb__sub n3">{sub}</p>
    <ol class="sb__list">{items}</ol>
  </nav>
  <div class="sb__legal">
    <p class="sb__copy">&copy; Summit Studios</p>
    <p class="sb__tiny"><a href="contact.html">Contact</a></p>
    <p class="sb__tiny"><span data-clock>--:--</span> local time</p>
  </div>
</aside>
<button class="sb__toggle" type="button" data-sb-toggle aria-expanded="false" aria-controls="chapters-index">
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <span class="sr">Show the chapter index</span>
</button>'''


FONTS = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Pinyon+Script&display=swap'

JSONLD = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"ProfessionalService","name":"Summit Studios","url":"https://www.summitxstudio.com/","email":"team@summitxstudio.com","description":"Premium web design, AI receptionists, WhatsApp automation and custom software for engineering firms, clinics and trades worldwide.","areaServed":"Worldwide"}</script>'''

# shared SVG filter: ragged painted edges (bar chart, the AI search tile)
def paper_defs():
    """SVG patterns for the torn edges, built from the same texture images as --paper-tex in
    style.css (read from it), laid in the same order and tile sizes, so an edge and the page
    beside it render identically. One 720px tile: mottle, then 180px and 240px grain repeats."""
    css = (OUT / 'assets/css/style.css').read_text()
    grab = lambda name: re.findall(r'url\("(data:image/svg\+xml,[^"]+)"\)', re.search(rf'--{name}:(.*?);\n', css, re.S).group(1))
    g1, g2 = grab('tex-paper')
    mottle = grab('tex-mottle')[0]
    imgs = (f'<image id="pt-m" href="{mottle}" width="720" height="720" preserveAspectRatio="none"/>'
            f'<image id="pt-g2" href="{g2}" width="180" height="180" preserveAspectRatio="none"/>'
            f'<image id="pt-g1" href="{g1}" width="240" height="240" preserveAspectRatio="none"/>')
    tiles = ''.join(f'<use href="#pt-g2" x="{x}" y="{y}"/>' for y in range(0, 720, 180) for x in range(0, 720, 180)) + \
            ''.join(f'<use href="#pt-g1" x="{x}" y="{y}"/>' for y in range(0, 720, 240) for x in range(0, 720, 240))
    grain = '<use href="#pt-m"/>' + tiles
    pats = ''.join(f'<pattern id="grain-{n}" patternUnits="userSpaceOnUse" width="720" height="720"><rect width="720" height="720" fill="{col}"/>{tex}</pattern>'
                   for n, col, tex in (('bg', '#DCDCD0', grain), ('parch', '#ECE3CD', grain), ('wall', '#F1EFE9', '')))   # the Contact wall is plain
    return f'<defs>{imgs}</defs>{pats}'


PAPER_DEFS = paper_defs()

ROUGH_DEFS = ('<svg class="sr" width="0" height="0" aria-hidden="true" focusable="false"><filter id="bar-rough" x="-3%" y="-3%" width="106%" height="106%">'
              '<feTurbulence type="fractalNoise" baseFrequency=".035 .06" numOctaves="3" seed="7" result="t"/>'
              '<feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>'
              # paper for the torn edges: the very same images as --paper-tex on the page (style.css)
              + PAPER_DEFS + '</svg>')

SCRIPTS = '''<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js" defer></script>
<script src="assets/js/main.js" defer></script>
<script src="assets/js/motion.js" defer></script>'''


def page(file, title, desc, body, chapters, mark, sub, jsonld=False):
    canon = '' if file == 'index.html' else file[:-5]
    # The chapter index (drafting box over the hero, docked sidebar, arrow) is a home-page
    # feature only (user: 'i only want the index thingy on the homepage').
    if file != 'index.html':
        chapters = []
        body = body.replace('>Back to navigation<', '>Back to top<')
    html = f'''<!doctype html>
<html lang="en" data-ui="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}{canon}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}{canon}">
<meta property="og:image" content="{SITE}assets/img/paint/hero.jpg">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/motion.css">
<script>try{{if('scrollRestoration' in history)history.scrollRestoration='manual';}}catch(e){{}}</script>
{JSONLD if jsonld else ''}
</head>
<body{'' if chapters else ' class="no-index"'}>
{header(file)}
{sidebar(chapters, mark, sub) if chapters else ''}
<main id="main" class="main">
{body}
</main>
{footer('parchment' if file in ('index.html', '404.html') else 'wall' if file == 'contact.html' else 'bg')}
{ROUGH_DEFS}
{SCRIPTS}
</body>
</html>
'''
    html = clean_urls(fingerprint(html))
    if file == '404.html':   # served at any missing path, so its assets must be root-relative
        html = re.sub(r'(src|href)="assets/', r'\1="/assets/', html)
    (OUT / file).write_text(html)
    print('wrote', file)


# ---------- chapter builders ----------

def hero(painting, alt, kicker):
    """Page opener: the painting fills the screen; the chapter list sits in its drafting box
    (rendered by the sidebar and positioned over the hero by motion.js)."""
    return f'''<section class="hero" id="top" aria-label="Introduction" data-hero>
  <div class="hero__bg"><img class="paint" src="assets/img/paint/{painting}.jpg" alt="{alt}" width="1344" height="752" fetchpriority="high"></div>
  <p class="hero__kicker label" data-reveal>{kicker}</p>
</section>'''


def hero_portal(painting, alt, headline, lead, spark='.6146,.1955'):
    """Home opener: the painting with the headline. motion.js pins it and, on scroll, opens a
    portal from the spark at the pointing hand into the first chapter (see portal())."""
    return f'''<section class="hero hero--portal" id="top" aria-labelledby="hero-t" data-hero data-portal="{spark}">
  <div class="hero__pin">
    <div class="hero__bg"><img class="paint" src="assets/img/paint/{painting}.jpg" alt="{alt}" width="1344" height="752" fetchpriority="high"></div>
    <canvas class="portal" data-portal-canvas aria-hidden="true"></canvas>
    <span class="hero__shade" aria-hidden="true"></span>
    <div class="hero__copy" data-portal-copy>
      <h1 class="hero__h" id="hero-t">{headline}</h1>
      <p class="n2 hero__p">{lead}</p>
    </div>
  </div>
</section>'''


def torn_edge(cid, seed=7):
    """A ripped paper edge (inline SVG) for the top of a chapter body: a ragged white fibre band
    over the painting, then the greige paper. Deterministic, so builds are stable."""
    import math, random
    rnd = random.Random(seed)
    W, H = 2400, 220
    ph1, ph2, ph3 = rnd.uniform(0, 6.28), rnd.uniform(0, 6.28), rnd.uniform(0, 6.28)
    pts, x = [], 0.0
    while x <= W:
        y = 132 + 38 * math.sin(x / 300 + ph1) + 17 * math.sin(x / 113 + ph2) + 7 * math.sin(x / 41 + ph3) + rnd.uniform(-3.5, 3.5)
        pts.append((x, y)); x += rnd.uniform(3, 11)
    fibre = ' '.join(f'L{px:.1f},{py - 9 - rnd.uniform(0, 9):.1f}' for px, py in pts)
    paper = ' '.join(f'L{px:.1f},{py + rnd.uniform(0, 5):.1f}' for px, py in pts)
    return f'''<svg class="tear" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs><filter id="fray-{cid}" x="-2%" y="-20%" width="104%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="1.1 .55" numOctaves="2" seed="{seed}"/><feDisplacementMap in="SourceGraphic" scale="9" result="torn"/><feDropShadow in="torn" dx="0" dy="-2" stdDeviation="3" flood-color="#14140A" flood-opacity=".32"/></filter></defs>
      <path class="tear__fibre" filter="url(#fray-{cid})" d="M0,{H} L0,{pts[0][1] - 12:.1f} {fibre} L{W},{H} Z"/>
      <path class="tear__paper" d="M0,{H} L0,{pts[0][1]:.1f} {paper} L{W},{H} Z"/>
    </svg>'''


def chapter(cid, word, painting, alt, lead, body, line=False, paper=False, corner=None, deco='', cut=False, tear=True):
    """One chapter: sticky painting, giant word and serif lead over it, then the body."""
    corner_html = (f'<div class="corner" data-corner><div class="corner__stage"><div class="corner__page">{corner.replace(" data-reveal", "")}</div></div></div>'
                   if corner else '')
    return f'''<section class="ch{' ch--paper' if paper else ''}{' ch--corner' if corner else ''}{'' if painting else ' ch--plain'}{' ch--cut' if cut else ''}" id="{cid}" data-ch aria-labelledby="{cid}-t">
  {f'<div class="ch__bg" data-ch-bg><img class="paint" src="assets/img/paint/{painting}.jpg" alt="{alt}" width="1344" height="752" loading="lazy" decoding="async"></div>' if painting else (torn_edge(cid + '-top', seed=11) if tear else '')}
  <div class="ch__open">
    <h2 class="h1 ch__word{' ch__word--line' if line else ''}" id="{cid}-t" data-word>{word}</h2>
    <p class="n1 ch__lead{' ch__lead--wide' if line else ''}"{'' if cut else ' data-reveal'}>{swash(lead)}</p>
  </div>
  {corner_html}
  {deco}
  <div class="ch__body" data-ch-body>
    {torn_edge(cid) if paper else ''}
    {body}
    <div class="ch__end"><span class="rule"></span><a class="back" href="#top">Back to navigation</a></div>
  </div>
</section>'''


def sub_head(text):
    return f'<h3 class="n1 sub" data-reveal>{swash(text)}</h3>'


# ---------- content per chapter ----------

SERVICE_FEATURES = {
    'websites': [('Clinic & practice sites', 'Trust, speed and a booking button on every screen.'),
                 ('Business & brand sites', 'The premium end of your market, built for your buyers.'),
                 ('E-commerce stores', 'Catalogue, checkout and fulfilment wired up end to end.'),
                 ('SEO & Google setup', 'Found for the searches that bring work, not vanity terms.')],
    'ai-receptionists': [('24/7 call & chat answering', 'Every call picked up, every chat answered, day and night.'),
                         ('Appointment booking', 'Books straight into your calendar without a human in the loop.'),
                         ('Answers to common questions', 'Opening hours, prices, directions, handled instantly.'),
                         ('Lead capture', 'Name, number and need recorded before the caller hangs up.'),
                         ('Human handoff', 'Passes to a real person the moment it matters.'),
                         ('Trained on your business', 'Your services, prices, hours and policies, in your tone of voice.'),
                         ('Speaks their language', 'Greets callers and replies in the language they use.'),
                         ('A summary after every call', 'Who called, what they wanted and what was booked, sent to your phone.'),
                         ('Works with your tools', 'Writes to your calendar and CRM, and follows up on WhatsApp.')],
    'whatsapp': [('Appointment reminders', 'Automatic reminders that cut no-shows.'),
                 ('Auto-replies & chatbots', 'Instant answers and lead qualification on the app they already use.'),
                 ('Broadcasts & campaigns', 'Offers and updates to the customers who want them.'),
                 ('Order & payment flows', 'From enquiry to paid order inside one conversation.')],
    'software': [('Custom CRMs', 'Leads, patients and admin shaped around how you actually work.'),
                 ('Dashboards & reporting', 'Everything in one place, updated as it happens.'),
                 ('Web apps & portals', 'Dependable tools on a foundation that grows with you.'),
                 ('Backend, APIs & integrations', 'Secure, monitored and connected to the tools you use.'),
                 ('Ongoing maintenance', "Fixes, tuning and new features. We don't vanish once it's live.")],
}

def svc(sid):
    return next(s for s in SERVICES if s['id'] == sid)


def proj(key):
    return next(p for p in PROJECTS if p.get('key') == key)


def fan_cards(shot='hero'):
    w, h = (1920, 1200) if shot == 'hero' else (960, 600)
    cards = ''.join(
        f'<a class="fan__card" href="{proj(k)["url"]}" target="_blank" rel="noopener" style="--r:{r}deg;--x:{x}%;--y:{y}%" aria-label="Open the {proj(k)["name"]} website">'
        f'<span class="browser"><span class="browser__bar"><i></i><i></i><i></i></span><img src="assets/img/work/{k}-{shot}.jpg" alt="{proj(k)["name"]} website" width="{w}" height="{h}" loading="lazy" decoding="async"></span></a>'
        for k, r, x, y in [('eagle', -7, 0, 6), ('doctor', 1, 26, 0), ('pranava', 6, 52, 5)])
    return f'<div class="fan" data-fan>{cards}</div>'


MARK = 'The<br>Sum<em>mit</em><br>Edition'
SUB = 'Websites that win work. 30+ sites shipped, every one custom.'


def index_block():
    """Home: the chapter index as a drafting box at the top of chapter I's parchment
    (user: the index should start on this page, not over the hero, with the content below it)."""
    items = ''.join(f'<li><a href="#{cid}"><span class="idx__name">{name}</span><span class="idx__lead"></span><span class="idx__num">{ROMAN[i]}</span></a></li>'
                    for i, (cid, name) in enumerate(HOME_CHAPTERS))
    return f'''<nav class="idx" aria-label="Chapters" data-idx>
      {DAVINCI}
      <p class="idx__mark h4">{MARK}</p>
      <p class="idx__sub n3">{SUB}</p>
      <ol class="idx__list">{items}</ol>
    </nav>'''


def chapter_websites():
    s = svc('websites')
    body = f'''
    {index_block()}
    {sub_head('Designs, refined')}
    {spot('Fast, clean, mobile-first', 'We build sites that turn a visitor into a booked appointment or a paying customer, and that actually show up when people search on Google.', 'See the work', 'projects.html')}
    {feat_grid(SERVICE_FEATURES['websites'])}
    {sub_head('Shown on real screens')}
    {fan_cards()}'''
    return chapter('websites', 'Ordinary Isn&rsquo;t Our Thing.', 'websites', 'A Renaissance painter at an easel painting a modern website layout',
                   'We turn ambitious ideas into extraordinary digital experiences.', body, line=True, paper=True)


CALL = [('Caller', 'Hi, are you open on Saturday? I&rsquo;d like to book a check-up.', True),
        ('Concierge', 'We are, from 9 until 1. I have 10:30 or 11:15 free. Which suits you?', False),
        ('Caller', '10:30, please. It&rsquo;s my first visit.', True),
        ('Concierge', 'Lovely. You&rsquo;re booked for Saturday at 10:30, and I&rsquo;ve sent the details and directions to your phone.', False)]

CONCIERGE_TOP = [('Answers 24/7', 'Every call picked up and every chat answered, day and night.'),
                 ('Books appointments', 'Straight into your calendar, with no one lifting a finger.'),
                 ('Captures every lead', 'Name, number and need recorded before the caller hangs up.'),
                 ('Hands off to a human', 'Passes to a real person the moment it matters.')]

CONCIERGE_STEPS = [('We learn your business', 'Your services, prices, hours and the questions you get asked every day.'),
                   ('We set the voice and the rules', 'How it greets people, what it can book, and when it hands over to you.'),
                   ('It goes live on your number and site', 'Every call and chat answered from day one, with a summary after each.')]

CONCIERGE_FIT = [('Clinics &amp; practices', 'New patients booked while the front desk is with someone else.'),
                 ('Trades &amp; home services', 'Jobs captured while you&rsquo;re up a ladder or on the road.'),
                 ('Engineering &amp; industrial', 'Enquiries qualified before they reach your sales team.'),
                 ('After hours, every day', 'The calls that used to go to voicemail become bookings.')]


def call_card():
    lines = ''.join(f'''<li class="call__l{' call__l--in' if inbound else ''}" data-call-line><span class="call__who label">{who}</span><p class="call__say">{say}</p></li>'''
                    for who, say, inbound in CALL)
    return f'''<figure class="call" aria-label="An example call answered by the AI concierge">
      <figcaption class="call__head"><span class="call__dot" aria-hidden="true"></span><span class="label">Example call, 21:47</span><span class="call__tag label">Answered by your AI concierge</span></figcaption>
      <ol class="call__lines">{lines}</ol>
      <p class="call__done label" data-call-line><span class="call__ok">Booked</span>Saturday 10:30 &middot; Lead saved &middot; Summary sent to you</p>
    </figure>'''


def steps(items, cls=''):
    cells = ''.join(f'<li class="step"><span class="step__n">{i + 1}</span><div class="step__x"><h4 class="step__t">{t}</h4><p class="step__p">{p}</p></div></li>' for i, (t, p) in enumerate(items))
    return f'<ol class="steps {cls}" data-reveal>{cells}</ol>'


def chart_steps(items, title=None):
    """Steps as a bar chart: bars on a shared baseline that grow with the scroll (motion.js
    chartSteps()); the number rides on each bar, the step reads underneath like a label."""
    cells = ''.join(f'<li class="bar"><div class="bar__col"><span class="bar__n">{i + 1}</span><span class="bar__fill" data-bar></span></div>'
                    f'<div class="bar__x"><h4 class="step__t">{t}</h4><p class="step__p">{p}</p></div></li>' for i, (t, p) in enumerate(items))
    chart = f'<ol class="chart" data-chart>{cells}</ol>'
    return f'<div class="chart-wrap" data-chart-wrap>{sub_head(title)}{chart}</div>' if title else chart


def chat_features(items):
    """Features as a WhatsApp-style thread: alternating bubbles with a time and read ticks."""
    times = ['09:02', '09:02', '09:03', '09:05', '09:06', '09:06']
    cells = ''.join(f'''<li class="bub{' bub--out' if i % 2 else ''}"><p class="bub__t">{t}</p><p class="bub__p">{p}</p><span class="bub__m">{times[i % len(times)]}{' <span class="bub__ticks" aria-hidden="true">&#10003;&#10003;</span>' if i % 2 else ''}</span></li>'''
                    for i, (t, p) in enumerate(items))
    return f'<ol class="chat" data-reveal aria-label="What WhatsApp automation covers">{cells}</ol>'


PROCESS = [('The brief', 'You fill in a short document about your business: what you do, who you serve, the pages you need and the sites you admire.'),
           ('The moodboard', 'We set the visual direction together: colour, type, imagery and references, agreed before a single screen is drawn.'),
           ('UI &amp; UX', 'Sitemap, user journeys and wireframes, so every page has a job and a clear path to a call or a booking.'),
           ('Visual design', 'Finished designs for desktop and phone, refined with you until they feel exactly right.'),
           ('Development', 'Hand-built, fast and mobile-first, with motion, accessibility and search baked in from the start.'),
           ('Testing', 'Every page checked on phones, tablets and browsers, with speed, forms and bookings tested end to end.'),
           ('Launch &amp; care', 'We go live, connect Google and analytics, and stay on for updates and new pages.')]


def process_section():
    """After chapter I: the brush-spin clip stays put full screen while the build process
    slides in from the right along the bottom (motion.js process())."""
    steps_html = ''.join(f'''<li class="proc__step"><span class="proc__n">{i + 1}</span><h3 class="proc__t">{t}</h3><p class="proc__p">{p}</p></li>'''
                         for i, (t, p) in enumerate(PROCESS))
    return f'''<section class="proc" id="process" aria-labelledby="process-t" data-process>
  <div class="proc__stage">
    <video class="proc__video" src="assets/video/brush-spin.mp4" poster="assets/video/brush-spin-poster.jpg" muted loop playsinline autoplay preload="metadata" aria-hidden="true"></video>
    <span class="proc__shade" aria-hidden="true"></span>
    <div class="proc__head">
      <p class="label proc__eyebrow">How we build it</p>
      <h2 class="n1 proc__h" id="process-t">{swash('From a blank page to a site that wins work.')}</h2>
    </div>
    <div class="proc__rail">
      <div class="proc__clip"><ol class="proc__track" data-process-track>{steps_html}</ol></div>
      <p class="label proc__count" aria-hidden="true"><span data-process-now>1</span> / {len(PROCESS)}</p>
    </div>
  </div>
</section>'''


def _stars(pts, base=0.0):
    return ''.join(f'<circle class="tw" cx="{x}" cy="{y}" r="{r}" style="--d:{base + i * .37:.2f}s"/>' for i, (x, y, r) in enumerate(pts))


# A magnifying glass drawn as a constellation, with the AI sparkle in the lens (AI search tile)
AI_STARS = ('''<svg class="fg__art" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
  <defs><filter id="ink-rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>
  <g class="art__lines" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <path pathLength="1" d="M190 58 L242 79 L262 130 L242 181 L190 202 L138 181 L118 130 L138 79 Z"/>
    <path pathLength="1" d="M242 181 L284 223 L322 262"/>
    <path pathLength="1" class="art__faint" d="M262 130 L318 92 L352 104 M138 79 L96 52"/>
  </g>
  <g class="art__stars" fill="currentColor">'''
    + _stars([(190, 58, 2.6), (242, 79, 2.2), (262, 130, 2.8), (242, 181, 2.4), (190, 202, 2.2), (138, 181, 2.6), (118, 130, 2.2), (138, 79, 2.4),
              (284, 223, 2.4), (322, 262, 3), (318, 92, 1.8), (352, 104, 2.2), (96, 52, 1.8)])
    + _stars([(60, 120, 1.2), (82, 236, 1.4), (300, 34, 1.3), (366, 186, 1.2), (214, 262, 1.1), (30, 40, 1), (380, 60, 1.1), (150, 250, 1)], base=.2)
    + '''</g>
  <path class="art__spark" fill="currentColor" d="M190 98 C192 121 198 128 222 130 C198 132 192 139 190 162 C188 139 182 132 158 130 C182 128 188 121 190 98 Z"/>
  <path class="art__spark art__spark--sm" fill="currentColor" d="M300 160 C301 169 303 171 312 172 C303 173 301 175 300 184 C299 175 297 173 288 172 C297 171 299 169 300 160 Z"/>
</svg>''')


GROWTH_FEATURES = [('SEO foundations', 'Fast pages, clean structure and the markup search engines read first.'),
                   ('Local search &amp; Maps', 'Your Google Business profile, reviews and map listing working for searches near you.'),
                   ('AI search visibility', 'Clear, quotable answers so ChatGPT, Gemini, Perplexity and Google&rsquo;s AI Overviews mention you.', AI_STARS),
                   ('Content that ranks', 'Pages and articles written around what your customers actually search for.'),
                   ('Reviews &amp; reputation', 'A steady flow of genuine reviews, each one answered properly.'),
                   ('Tracking &amp; reporting', 'Calls, forms and bookings traced back to where they came from, every month.')]

GROWTH_STEPS = [('We see where you stand', 'Where you show up today on Google, in Maps and in AI answers, and who is showing up instead.'),
                ('We fix and build', 'Technical fixes, local listings, structured answers and the pages that are missing.'),
                ('We measure and compound', 'A plain monthly report on calls, bookings and rankings, and the next moves.')]


def ai_answer():
    """An example AI search result on frosted glass, over a blurred painting."""
    tabs = ''.join(f'<span class="srp__tab{" is-on" if t == "AI Overview" else ""}">{t}</span>' for t in ['All', 'AI Overview', 'Maps', 'Images', 'Reviews'])
    q = 'best family dentist near me'
    return f'''<figure class="srp" data-grow aria-label="Example: an AI search overview recommending your practice">
      <img class="srp__bg" src="assets/img/paint/clinics.jpg" alt="" width="1344" height="752" loading="lazy" decoding="async">
      <div class="srp__glass">
        <div class="srp__bar"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m13 13 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span class="srp__q" style="--n:{len(q)}">{q}</span></div>
        <div class="srp__tabs" aria-hidden="true">{tabs}</div>
        <div class="srp__ov">
          <div class="srp__ovtext">
            <p class="srp__ovh"><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M10 1c.7 5.2 2.6 7.6 8 9-5.4 1.4-7.3 3.8-8 9-.7-5.2-2.6-7.6-8-9 5.4-1.4 7.3-3.8 8-9Z"/></svg>AI Overview</p>
            <p class="srp__ovp">A well-reviewed option is <strong>your practice</strong>, known for open Saturday morning appointments, online booking and a patient-first approach, making it a convenient choice for families.</p>
          </div>
          <img class="srp__thumb" src="assets/img/paint/clinics.jpg" alt="" width="1344" height="752" loading="lazy" decoding="async">
        </div>
      </div>
      <figcaption class="sr">Example only: how an AI search answer can recommend your business.</figcaption>
    </figure>'''


SWALLOW = ('''<symbol id="swallow" viewBox="0 0 100 70">
  <path class="sw__wing sw__wing--back" d="M60 37 C53 23 39 9 16 1 C25 10 32 19 36 27 C40 33 46 38 53 41 Z"/>
  <path class="sw__body" d="M88 31 L97 30 L89 34 C84 39 74 42 64 43 C54 44 44 45 36 46 L5 59 L30 48 L11 68 L38 49 C46 47 54 43 60 39 C66 34 74 30 82 29 C85 29 87 30 88 31 Z"/>
  <path class="sw__belly" d="M84 34 C78 39 70 41 60 42 C66 38 74 35 84 34 Z"/>
  <path class="sw__wing sw__wing--front" d="M65 35 C68 21 77 9 95 1 C88 10 83 19 79 27 C76 32 72 37 67 41 Z"/>
  <circle cx="85" cy="31" r="1" fill="#F4ECD9"/>
</symbol>''')

# (left %, top %, width px, flap delay s, rise speed)
FLOCK = [(66, 8, 112, 0, 1.0), (60, 11.5, 76, .18, 1.0)]   # a pair, flying together


FLOCK_START = [(73, 12, 72, 0, .5), (84, 21, 46, .18, .5)]   # rise at half speed so they stay in view   # Start: two swallows in the open sky above 'Start' (% of the picture)


def flock(items=None):
    """Realistic swallows behind a chapter: two wing poses swap to flap, and the flock
    rises up and to the right as you scroll (motion.js birds())."""
    b = ''.join(f'''<span class="bird" style="left:{x}%;top:{y}%;width:{round(w * 1.5)}px;--fd:{d}s" data-bird="{v}"><img class="bird__up" src="assets/img/birds/swallow-up.png" alt="" width="420" height="420" loading="lazy" decoding="async"><img class="bird__down" src="assets/img/birds/swallow-down.png" alt="" width="420" height="420" loading="lazy" decoding="async"></span>'''
                for x, y, w, d, v in (items or FLOCK))
    return f'<div class="flock" aria-hidden="true">{b}</div>'


def chapter_growth():
    body = f'''
    {sub_head('Found, first')}
    <div class="split" data-reveal>
      {spot('Seen where people look', 'The right customers find you at the top of Google, in Maps, and in the answers AI assistants give when someone asks who to call.', 'Talk to us about growth', 'get-started.html')}
      {ai_answer()}
    </div>
    {sub_head('What we work on')}
    {feat_grid(GROWTH_FEATURES, 'fg--bento')}
    {chart_steps(GROWTH_STEPS, 'How it grows')}'''
    return chapter('growth', 'Growth Marketing', None, '',
                   'SEO and AI search that put you in front of the people already looking for what you do.', body, deco=flock())


def concierge_service():
    """Services page: the AI Concierge in full (moved here from the home page)."""
    s = svc('ai-receptionists')
    body = f'''
    {spot('AI Concierge', s['desc'], 'Talk to us about this', 'get-started.html')}
    {sub_head('What it handles')}
    {feat_grid(CONCIERGE_TOP, 'fg--panel')}
    {sub_head('How it works')}
    {steps(CONCIERGE_STEPS, 'steps--list')}
    {sub_head('Where it earns its keep')}
    {feat_grid(CONCIERGE_FIT, 'fg--editorial')}
    {sub_head('Everything it can do')}
    {feat_grid(SERVICE_FEATURES['ai-receptionists'])}'''
    return chapter('ai-receptionists', 'AI Concierge', 'reception', 'A Renaissance angel at a marble desk answering a modern telephone',
                   s['tag'] + ' ' + s['desc'].split('. ')[0] + '.', body)


def chapter_receptionists():
    body = f'''
    <div class="calls" data-calls>
      <figure class="calls__hand" aria-hidden="true">
        <img src="assets/img/paint/hand-phone.jpg" alt="" width="800" height="1200" loading="lazy" decoding="async">

      </figure>
      <div class="calls__text">
        <h3 class="calls__h">{swash('Calls, answered')}</h3>
        <div class="spot"><p class="spot__t">Never on hold</p><p class="n2">It books appointments, answers the questions you get asked a hundred times a day, captures every lead, and hands off to a real person when it matters.</p>
          <a class="btn-line" href="contact.html">Ask about AI Concierge <span aria-hidden="true">&#8599;</span></a></div>
      </div>
      <div class="calls__card" data-reveal>{call_card()}</div>
      <svg class="calls__cord" aria-hidden="true" focusable="false"><path data-cord d=""/></svg>
    </div>
    '''
    return chapter('receptionists', 'AI Concierge', 'reception-cut', 'A Renaissance angel at a marble desk answering a modern telephone',
                   'A smart assistant that answers your phone and chats around the clock, books appointments and captures every lead.', body, cut=True)


def chapter_whatsapp():
    s = svc('whatsapp')
    body = f'''
    {media('assets/img/photo/whatsapp.jpg', 'A phone showing a chat conversation', 'media--wide')}
    {sub_head('Messages, automated')}
    {spot('On the app they already use', s['desc'], 'Ask about WhatsApp automation', 'contact.html')}'''
    return chapter('whatsapp', 'WhatsApp Automation', 'whatsapp', 'A Renaissance winged messenger flying over a valley holding a glowing phone with a trail of speech bubbles',
                   'Reminders that cut no-shows, instant replies and chatbots that qualify leads before they ever reach you.', body)


def chapter_software():
    crm, apps, back = svc('crm'), svc('web-apps'), svc('backend')
    body = f'''
    {media('assets/img/device/monitor-pranava.jpg', 'A studio monitor showing the Pranava Builders website', 'media--wide')}
    {sub_head('Tools, tailored')}
    {spot('Shaped around how you work', crm['desc'], 'Ask about custom software', 'contact.html')}'''
    return chapter('software', 'Software', 'software', 'A Renaissance scholar in a library studying charts on a modern monitor',
                   'Custom CRMs, web apps, dashboards and the backend that keeps them fast, secure and growing.', body)


def duo_card(painting, crumb, chips, prompt, title, text, link, href):
    chip_html = ''.join(f'<span class="duo__chip">{c}</span>' for c in chips)
    return f'''<article class="duo__card" data-reveal>
      <div class="duo__art">
        <img class="duo__bg" src="assets/img/paint/{painting}.jpg" alt="" width="1344" height="752" loading="lazy" decoding="async">
        <div class="duo__win" aria-hidden="true">
          <div class="duo__bar"><span class="duo__crumb"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 2h5l3 3v9H4z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg> &rsaquo; {crumb}</span></div>
          <div class="duo__chips">{chip_html}</div>
          <div class="duo__body"></div>
          <div class="duo__prompt"><span class="duo__mark"><svg viewBox="0 0 20 20" width="16" height="16"><path fill="currentColor" d="M10 1c.7 5.2 2.6 7.6 8 9-5.4 1.4-7.3 3.8-8 9-.7-5.2-2.6-7.6-8-9 5.4-1.4 7.3-3.8 8-9Z"/></svg></span><span class="duo__q">{prompt}</span><span class="duo__send"><svg viewBox="0 0 20 20" width="16" height="16"><path d="M10 16V4M5 9l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
        </div>
      </div>
      <h3 class="duo__t">{title}</h3>
      <p class="duo__p">{text}</p>
      {chip(link, href)}
    </article>'''


def duo_section():
    """Home: WhatsApp automation and custom software as two cards."""
    return f'''<section class="duo" id="more" aria-label="WhatsApp automation and custom software" data-ink>
  {duo_card('whatsapp', 'Automations', ['Reminders', 'Replies', 'Broadcasts'], 'Remind tomorrow&rsquo;s patients and ask them to confirm',
            'WhatsApp automation', 'Reminders that cut no-shows, instant replies and chatbots that qualify leads, on the app your customers already use.',
            'Ask about WhatsApp automation', 'contact.html')}
  {duo_card('software', 'New report', ['Last 30 days', 'All sources', 'Leads'], 'Show me last month&rsquo;s leads by source, and which ones booked',
            'Custom software', 'CRMs, dashboards and web apps shaped around how you work, connected to the tools you already use.',
            'Ask about custom software', 'contact.html')}
</section>'''


def work_cards(projects):
    """Industries: our sites in this industry, as framed screenshots with a Visit button.
    A single project gets a wide card (screenshot beside its text)."""
    def card(p):
        host = p['url'].split('//', 1)[-1].strip('/').removeprefix('www.')
        return f'''<article class="iw__card">
        <a class="iw__shot" href="{p['url']}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><span class="browser"><span class="browser__bar"><i></i><i></i><i></i></span><img src="assets/img/work/{p['key']}-1.jpg" alt="" width="960" height="600" loading="lazy" decoding="async"></span></a>
        <div class="iw__info"><h4 class="iw__name">{p['name']}</h4><p class="label iw__type">{p['type']}</p><p class="n3 iw__line">{p['line']}</p>{visit_button(p['url'], p['name'], host)}</div>
      </article>'''
    solo = ' iw--solo' if len(projects) == 1 else ''
    return f'<div class="iw{solo}" data-reveal>{"".join(card(p) for p in projects)}</div>'


def before_after(old, new):
    """Industries: "the rebirth" -- where most sites in the industry are, next to what we rebuild it into."""
    o = ''.join(f'<li>{x}</li>' for x in old)
    n = ''.join(f'<li>{x}</li>' for x in new)
    return f'''<div class="ba" data-reveal>
      <div class="ba__col ba__col--old"><p class="label ba__lab">Where most sites are</p><ul class="ba__list">{o}</ul></div>
      <span class="ba__arrow" aria-hidden="true"><svg viewBox="0 0 20 20" width="22" height="22"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <div class="ba__col ba__col--new"><p class="label ba__lab">What we build instead</p><ul class="ba__list">{n}</ul></div>
    </div>'''


def chapter_box(cid, word, painting, alt, lead, body):
    """A chapter that opens on a large picture set into the page (under the header, inset from the
    edges) with its word and lead inside it. Static: it scrolls with the page like any block -- no
    sticky background, no fade, no word animation (user: 'this big with the text inside and also static')."""
    return f'''<section class="ch ch--box" id="{cid}" data-ch aria-labelledby="{cid}-t" data-ink>
  <div class="ch__box">
    <img class="paint" src="assets/img/paint/{painting}.jpg" alt="{alt}" width="1344" height="752" loading="lazy" decoding="async">
    <div class="ch__boxtext">
      <h2 class="h1 ch__word" id="{cid}-t">{word}</h2>
      <p class="n1 ch__lead">{swash(lead)}</p>
    </div>
  </div>
  <div class="ch__body" data-ch-body>
    {body}
    <div class="ch__end"><span class="rule"></span><a class="back" href="#top">Back to navigation</a></div>
  </div>
</section>'''


def industries_lead():
    """Industries: room to breathe between the opening painting and the first industry, with a lead-in
    that says what each industry section covers."""
    return f'''<section class="ind-lead" aria-labelledby="ind-lead-t" data-ink>
  <p class="label ind-lead__eyebrow">Industry by industry</p>
  <h2 class="ind-lead__h" id="ind-lead-t">{swash('Every industry buys differently.')}</h2>
  <p class="n3 ind-lead__p">Why the business needs a website, what its old site usually gets wrong, and what we turn it into.</p>
</section>'''


def chapter_industry(d):
    """Industries: one chapter per industry we have built for: why the business needs a website, the
    rebirth (old site -> what we make of it), our work in it, and what we build for it."""
    work = [p for p in PROJECTS if p.get('url') and p['slug'] == d['slug']]
    body = f'''
    {sub_head('Why you need a website')}
    {feat_grid(d['why'])}
    {sub_head('What we change')}
    {before_after(d['old'], d['new'])}
    {sub_head('Our work here' if len(work) == 1 else f'Our work here, {len(work)} sites')}
    {work_cards(work)}
    {sub_head('What we build')}
    {feat_grid([(x, '') for x in d['build']], 'fg--tags')}
    <p data-reveal>{ihb('Start a conversation', 'contact.html', 'ihb--auto')}</p>'''
    return chapter_box('ind-' + d['id'], d['word'], d['paint'][0], d['paint'][1], d['pitch'], body)


def hero_rebirth():
    """Industries opener: the palace gallery of framed websites fills the first screen, and the idea sits
    on it -- renaissance means rebirth -- with every industry we've built for (and how many of our sites
    are in each) on a frosted panel. Cream type with a soft shadow; no tint over the painting."""
    count = lambda d: sum(1 for p in PROJECTS if p.get('url') and p['slug'] == d['slug'])
    items = ''.join(f'''<li><a href="#ind-{d['id']}"><span class="rb__name">{d['name']}</span><span class="rb__lead" aria-hidden="true"></span><span class="label rb__n">{count(d)} {'site' if count(d) == 1 else 'sites'}</span></a></li>'''
                    for d in INDUSTRIES)
    return f'''<section class="hero hero--rb" id="top" aria-labelledby="rebirth-t" data-hero>
  <div class="hero__bg"><img class="paint" src="assets/img/paint/projects-gallery.jpg" alt="A Renaissance palace gallery where visitors admire websites hung in gilt frames" width="1344" height="752" fetchpriority="high"></div>
  <div class="hrb">
    <div class="hrb__text">
      <p class="label hrb__eyebrow">Industries</p>
      <h1 class="hrb__h" id="rebirth-t">{swash('Renaissance means rebirth.')}</h1>
      <p class="n2 hrb__p">Most businesses we meet already have a website. It is just a tired template from years ago, slow on a phone, and saying nothing about what makes them different. We don&rsquo;t patch it up. We rethink it, redesign it and rebuild it into something unique and modern that brings in work.</p>
    </div>
    <nav class="hrb__panel" aria-label="Industries"><p class="label rb__idxh">Industries we&rsquo;ve built for</p><ol class="rb__list">{items}</ol></nav>
  </div>
</section>'''




def visit_button(url, name, host):
    """Projects: "Visit" as an interactive pill (from the user's InteractiveHoverButton): a dot by the word
    floods the pill on hover while the word slides out and "Visit ->" slides in."""
    return ihb('Visit', url, aria=f'Visit {name}, {host} (opens in a new tab)', external=True)


def work_row(i, p):
    if not p.get('url'):
        return f'''<article class="row row--soon" data-sector="{p['slug']}" data-reveal>
      <div class="row__info"><p class="row__n">{i:02d}</p><h4 class="h4 row__name">{p['name']}</h4><p class="label row__meta">{p['sector']} &middot; {p['type']}</p><p class="n3 row__line">{p['line']}</p></div>
      <div class="row__strip row__strip--soon"><span class="label">Coming soon</span></div>
    </article>'''
    host = p['url'].split('//', 1)[-1].strip('/').removeprefix('www.')
    side = 'r' if i % 2 else 'l'   # alternate: screenshot right, then left
    return f'''<article class="row row--{side}" data-sector="{p['slug']}" data-reveal>
      <a class="row__art" href="{p['url']}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="assets/img/work/{p['key']}-wide.jpg" alt="" width="1440" height="900" loading="lazy" decoding="async"></a>
      <div class="row__info">
        <p class="row__n">{i:02d}</p>
        <h4 class="h4 row__name">{p['name']}</h4>
        <p class="label row__meta">{p['sector']} &middot; {p['type']}</p>
        <p class="n3 row__line">{p['line']}</p>
        {visit_button(p['url'], p['name'], host)}
      </div>
    </article>'''


def chapter_work():
    live = [p for p in PROJECTS if p.get('url')]
    body = f'''
    {sub_head('Built to win work')}
    <p class="label index" data-reveal><span>Index &middot; {len(live):02d} live projects</span><span>30+ shipped</span></p>
    <div class="rows">{''.join(work_row(i + 1, p) for i, p in enumerate(live))}</div>
    <p data-reveal>{chip('All projects', 'projects.html')}</p>'''
    return chapter('work', 'Work', 'workshop', 'A Renaissance workshop where apprentices work on modern laptops',
                   'Thirty-plus websites for clinics, engineering firms, property, architecture and technology. Every one custom, every one live.', body)


# A torn paper edge that ripples like a wave (drawn and animated by main.js)
# A torn paper edge that rips up the screen as you scroll (drawn by main.js)
WAVE_TEAR = ('<div class="tear-down" aria-hidden="true" data-rip><svg class="wave-tear" focusable="false">'
             '<defs><filter id="wave-fray" x="-2%" y="-10%" width="104%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".9 .5" numOctaves="2" seed="5"/>'
             '<feDisplacementMap in="SourceGraphic" scale="7" result="t"/><feDropShadow in="t" dx="0" dy="4" stdDeviation="4" flood-color="#0E0A06" flood-opacity=".45"/></filter></defs>'
             '<path class="wave-tear__foam" filter="url(#wave-fray)" data-wave="fibre"/><path class="wave-tear__specks" data-wave="specks"/><path class="wave-tear__paper" data-wave="paper"/></svg></div>')


def orbit_walk():
    """Home, Why us: the camera walks down the painted loggia, from midway along the table, and
    ends inside the laptop (the why-orbit clip: 5.4 s to the end of the 4 Nov walk, upscaled to 4K, scrubbed by scroll
    in orbit() in motion.js). Nothing else shows during the walk. Desktop only; phones keep the
    still and the stacked reasons."""
    return '''<div class="orbit" data-orbit data-length="315" aria-hidden="true">
      <div class="orbit__pin"></div>
    </div>'''


def screen_reasons():
    """Home, Why us: the scroll length over which the reasons take turns on the laptop's screen
    (screen() in motion.js). The text itself is screen_quad(), in the chapter's sticky background."""
    return '''<div class="screen" data-screen data-length="170" aria-hidden="true"><div class="screen__pin"></div></div>'''


def screen_quad():
    """The text layer mapped onto the laptop's screen (orbit() in motion.js): the four reasons and
    the call to action, one at a time. Phones get the grid instead."""
    panels = ''.join(f'''<article class="screen__panel" data-panel>
          <p class="screen__num label">{i + 1:02d} &nbsp;/&nbsp; 0{len(WHY)}</p>
          <h3 class="screen__t">{t}</h3>
          <p class="screen__p">{p}</p>
        </article>''' for i, (t, s, p) in enumerate(WHY))
    end = f'''<article class="screen__panel screen__panel--end" data-panel>
          <div class="screen__cta">{ihb('Start a conversation', 'contact.html', 'ihb--auto ihb--screen')}</div>
        </article>'''
    return f'<div class="screen__quad" data-screen-quad><div class="screen__face">{panels}{end}</div></div>'


CREST = '<img class="frame-crest" src="assets/img/frame-crest.png" alt="" width="359" height="198">'   # the gilt frame's crest (Contact page, Why us)


def chapter_why(tear=False):
    scene = why_scene()
    if tear:
        body = f'''
    {orbit_walk()}
    {screen_reasons()}
    <div class="why-fallback">
    {sub_head('Four reasons, one studio')}
    {feat_grid([(t, p) for t, s, p in WHY])}
    </div>'''
    else:
        body = f'''
    {sub_head('Four reasons, one studio')}
    {feat_grid([(t, p) for t, s, p in WHY])}
    {scene}'''
    paint = ('why-orbit-poster', 'A sunlit Renaissance loggia with a long marble table, a modern laptop open on it a few steps ahead and Tuscan hills beyond the arches') if tear else \
            ('studio-review', 'A Renaissance noblewoman and a young designer reviewing printed website layouts together')
    html = chapter('why', 'Why us', paint[0], paint[1],
                   'No templates, no account managers, no vanishing at launch. Premium work from the people who actually build it.', body)
    if tear:   # home: the walk (no torn-paper entrance any more: the user didn't want the tear over the framed wall)
        html = html.replace('class="ch"', 'class="ch ch--rip"', 1)
        # the clip sits over the still; orbit() shows it once the walk begins (the still is its first frame)
        html = html.replace('</div>\n  <div class="ch__open">', '<video class="paint paint--orbit" data-orbit-video data-src="assets/video/why-orbit.mp4" poster="assets/img/paint/why-orbit-poster.jpg" muted playsinline preload="none"></video>' + screen_quad() + '</div>' + CREST + '</div>\n  <div class="ch__open">', 1)
        # on desktop the picture hangs in the Contact page's gilt frame: .ch__pic clips the picture, the crest sits on the frame
        html = html.replace('<div class="ch__bg" data-ch-bg>', '<div class="ch__bg" data-ch-bg><div class="ch__pic">', 1)
    return html


STEPS = [('You write', 'Tell us what your site needs to do: more quotes, more bookings, fewer missed calls. A few lines is plenty.'),
         ('We look', 'We study your current site: where it loses people and what the premium end of your market is doing.'),
         ('We answer', 'Within one working day, a straight answer on fit and rough cost, in writing. A full proposal follows if you want one.')]


def chapter_start():
    body = f'''
    {sub_head('No pitch, no pressure')}
    {feat_grid(STEPS)}
    <div class="cta" data-reveal>
      {ihb('Start a conversation', 'contact.html', 'ihb--auto ihb--big')}
      {chip('Get a free website review', 'get-started.html#review')}
      {chip('Email us', 'mailto:team@summitxstudio.com')}
    </div>
'''   # no 'Questions, answered' here (user removed it from Industries and Projects; the home page keeps its FAQ)
    # the lady with the laptop, her rock and the swallows, cut out onto the page's paper (like the AI Concierge)
    return chapter('start', 'Start', 'summit-cut', 'A Renaissance woman in a gold-trimmed cloak working on a laptop on a rock ledge, swallows flying above',
                   "Tell us what you need. We'll look at your current site, tell you what we'd change, and say honestly whether we're the right fit.", body, cut=True
                   ).replace(' id="start" data-ch ', ' id="start" data-ch data-ink ', 1  # all on paper: ink header throughout
                   ).replace('<h2 class="h1 ch__word" id="start-t" data-word>Start</h2>', '<h2 class="ch__word sr" id="start-t">Start</h2>', 1  # no giant word: the line is the headline (user)
                   ).replace('decoding="async"></div>\n  <div class="ch__open">', 'decoding="async">' + flock(FLOCK_START) + '</div>\n  <div class="ch__open">', 1)   # the two swallows fly over the picture


UP_ARROW = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M7 17 17 7M7 7h10v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def voices_section():
    """Home: client reviews as tall cards in one row, the next one peeking in at the right edge. On desktop
    the section holds still and the row slides left as you scroll (voices() in motion.js); phones swipe it.
    Each card: a cover of the client's own site, who they are, the quote, and a "View site" link. The card
    runs from light under the cover to dark at its foot. A client without a site gets a monogram cover."""
    def card(q, name, role, url, cover):
        host = re.sub(r'^www\.', '', url.split('//')[-1].split('/')[0]) if url else ''
        if cover:
            top = f'<img src="assets/img/voices/{cover}.jpg" alt="The home page of {host}" width="1200" height="750" loading="lazy" decoding="async">'
        else:
            initials = ''.join(w[0] for w in re.sub(r'^Dr\.\s*', '', name).split()[:2])
            top = f'<span class="voice__mono" aria-hidden="true">{initials}</span>'
        site = (f'<a class="pill pill--go voice__site" href="{url}" target="_blank" rel="noopener" aria-label="View {name}&rsquo;s website, {host} (opens in a new tab)">'
                f'<span class="pill__t">View site</span><span class="pill__ic" aria-hidden="true">{UP_ARROW}</span></a>') if url else ''
        return f'''<article class="voice" data-reveal>
      <div class="voice__cover">{top}</div>
      <div class="voice__body">
        <p class="voice__by"><span class="voice__name">{name}</span><span class="voice__role">{role}</span></p>
        <blockquote class="voice__q">&ldquo;{q}&rdquo;</blockquote>
        {site}
      </div>
    </article>'''
    cards = ''.join(card(*v) for v in VOICES)
    return f'''<section class="voices" id="voices" aria-labelledby="voices-t" data-ink data-voices>
  <div class="voices__pin">
    <p class="label voices__eyebrow">Client voices</p>
    <h2 class="voices__h" id="voices-t">{swash('In their words.')}</h2>
    <div class="voices__track" data-voices-track><div class="voices__row">{cards}</div></div>
  </div>
</section>'''


def faq_section():
    """Home: every question as a quiet accordion."""
    items = ''.join(f'''<details class="faq__item"><summary class="faq__q"><span>{q}</span><span class="faq__plus" aria-hidden="true"></span></summary><p class="faq__a">{a}</p></details>'''
                    for q, a in FAQ_ALL)
    return f'''<section class="faq" id="faq" aria-labelledby="faq-t" data-ink>
  <div class="faq__head">
    <p class="label voices__eyebrow">FAQ</p>
    <h2 class="voices__h" id="faq-t">{swash('Questions, answered.')}</h2>
    <p class="faq__more">Something else on your mind? <a href="contact.html">Ask us directly</a>.</p>
  </div>
  <div class="faq__list" data-reveal>{items}</div>
</section>'''


def footer(above='bg'):
    """Site footer. The page above tears away into it; `above` is that page's paper colour."""
    return f'''<footer class="ftr" data-ftr data-above="{above}">
  <div class="ftr__tear" aria-hidden="true">{torn_edge('ftr', seed=3)}</div>
  <div class="ftr__cta">
    <h2 class="ftr__h">{swash('Let&rsquo;s build something worth finding.')}</h2>
    <div class="ftr__btns">{ihb('Start a conversation', 'contact.html', 'ihb--auto ihb--big')}{chip('Get a free website review', 'get-started.html#review')}</div>
  </div>
  <nav class="ftr__cols" aria-label="Footer">
    <div><p class="ftr__t">Services</p><a href="index.html#websites">Websites</a><a href="index.html#growth">Growth Marketing</a><a href="index.html#receptionists">AI Concierge</a><a href="index.html#more">WhatsApp Automation</a><a href="index.html#more">Custom Software</a></div>
    <div><p class="ftr__t">Studio</p><a href="industries.html">Industries</a><a href="projects.html">Projects</a><a href="studio.html">About</a><a href="contact.html">Get a quote</a></div>
    <div><p class="ftr__t">Talk to us</p><a href="get-started.html">Get started</a><a href="contact.html">Contact</a><a href="mailto:team@summitxstudio.com">team@summitxstudio.com</a></div>
    <div><p class="ftr__t">Worldwide</p><p class="ftr__note">Working with clients across time zones. Local time <span data-clock>--:--</span>.</p></div>
  </nav>
  <div class="ftr__base">
    <div class="ftr__mark" data-halftone><p class="ftr__word" aria-hidden="true">Summit Studios</p><canvas class="ftr__dots" aria-hidden="true"></canvas></div>
    <div class="ftr__legal"><span>&copy; 2026 Summit Studios</span><a href="#top">Back to top &uarr;</a></div>
  </div>
</footer>'''


HOME_CHAPTERS = [('websites', 'Websites'), ('growth', 'Growth Marketing'), ('receptionists', 'AI Concierge'), ('more', 'WhatsApp &amp; Software'), ('why', 'Why us'), ('voices', 'Client voices'), ('faq', 'FAQ')]

HOME = f'''
{hero_portal('hero', 'A Renaissance painting of craftspeople on a terrace unrolling a scroll that shows a modern website, a mountain summit beyond', 'The Internet Has Enough Boring Websites.', 'We design and develop digital experiences that break conventions, capture attention, and refuse to blend in.')}
{chapter_websites()}
{process_section()}
{chapter_growth()}
{chapter_receptionists()}
{duo_section()}
{chapter_why(tear=True)}
{voices_section()}
{faq_section()}
'''


# ---------- other pages (same system) ----------

def simple_page(hero_paint, hero_alt, kicker, chapters_html):
    return f'''
{hero(hero_paint, hero_alt, kicker)}
{chapters_html}
'''


FILTERS = [('all', 'All'), ('healthcare', 'Healthcare'), ('industrial', 'Industrial'), ('technology', 'Technology'), ('property', 'Property'),
           ('interiors', 'Interiors'), ('food', 'Food'), ('hospitality', 'Hospitality')]
PROJECTS_CH = []   # no chapter index on this page (user: 'i dont want this index in this page')
def tunnel():
    """Projects opener: the work flies out of the distance past you as you scroll (tunnel() in
    motion.js), around a title that grows and fades. Screenshots are decorative here; the list
    below carries their names and links."""
    shots = [(p['key'], 1, p['name']) for p in PROJECTS if p.get('url')] + [('semnox', 2, 'Semnox'), ('cc', 2, 'Creative Concepts'), ('niks', 2, 'Niks Masala')]
    cards = ''.join(f'''<figure class="tun__card" data-tun-card><span class="browser"><span class="browser__bar"><i></i><i></i><i></i></span><img src="assets/img/work/{k}-{n}.jpg" alt="" width="960" height="600" loading="{'eager' if i < 6 else 'lazy'}" decoding="async"></span><figcaption class="tun__cap">{name}</figcaption></figure>'''
                    for i, (k, n, name) in enumerate(shots))
    return f'''<section class="tun" id="top" aria-labelledby="tun-t" data-tunnel data-ink>
  <div class="tun__stage">
    <span class="tun__ring tun__ring--a" aria-hidden="true"></span><span class="tun__ring tun__ring--b" aria-hidden="true"></span>
    <div class="tun__scene">
    <div class="tun__title" data-tun-title>
      <p class="label tun__kicker">Projects &middot; 30+ websites shipped</p>
      <h1 class="h1 tun__h" id="tun-t">Built to win work.</h1>
      <p class="n2 tun__lead">{swash('Eleven live sites, every one custom.')}</p>
    </div>
    <div class="tun__space" aria-hidden="true">{cards}</div>
    </div>
    <p class="label tun__prompt" data-tun-prompt aria-hidden="true">Scroll to walk the gallery</p>
  </div>
</section>'''


PROJECTS_PAGE = tunnel() + (
    chapter('index', 'Projects', None, '',   # no torn edge: the list follows the opener on the same paper
            'Work that wins work. The live ones below; more as clients agree to be shown.',
            f'''<div class="filters label" data-reveal><span>Filter</span>{''.join(f'<button class="chip" type="button" data-filter="{v}" aria-pressed="{"true" if v == "all" else "false"}">{t}</button>' for v, t in FILTERS)}</div>
    <div class="rows" data-work>{''.join(work_row(i + 1, p) for i, p in enumerate(PROJECTS))}</div>
''', tear=False)
    + chapter_start())

STUDIO_CH = []
# Studio: cleared (user, 2026-11-10: 'clear the content in it rn') -- to be rebuilt. The page and its menu
# link stay; an empty paper block keeps the footer clear of the header. Old content is in git (before this commit).
STUDIO = '<section class="blank" id="top" aria-label="Studio" data-ink></section>'


def service_chapter(s, paint, alt, cid, word, feats, img):
    return chapter(cid, word, paint, alt, s['tag'] + ' ' + s['desc'].split('. ')[0] + '.',
                   f'''{media(img[0], img[1], 'media--wide')}
    {spot(s['name'].replace('&amp;', '&'), s['desc'], 'Talk to us about this', 'get-started.html')}
    {feat_grid(feats)}''')


PRICE_CARDS = [('Website', 'For clinics, trades and professional firms that need a site that brings in work.', ['Custom design, mobile-first', 'Clinic, business or brand site', 'SEO &amp; Google setup', 'Launch support'], ''),
               ('Website + automation', 'For businesses that lose enquiries after hours or to no-shows.', ['Everything in Website', 'AI receptionist or WhatsApp automation', 'Appointment booking &amp; reminders', 'Care plan'], ' price__card--mid'),
               ('Custom software', 'For firms that have outgrown spreadsheets and off-the-shelf tools.', ['CRM, web app or dashboards', 'Backend, APIs &amp; integrations', 'Role-based access', 'Ongoing support'], '')]


def price_cards():
    cards = ''.join(f'<div class="price__card{cls}"><h4 class="h4">{n}</h4><p class="fg__p">{f}</p><p class="n2">Quote on request</p><ul>{"".join(f"<li>{x}</li>" for x in items)}</ul>{chip("Get a quote", "contact.html")}</div>'
                    for n, f, items, cls in PRICE_CARDS)
    return f'<div class="price" data-reveal>{cards}</div>'


INDUSTRIES_CH = [('ind-' + d['id'], d['word']) for d in INDUSTRIES] + [('start', 'Start')]
INDUSTRIES_PAGE = hero_rebirth() + industries_lead() + ''.join(chapter_industry(d) for d in INDUSTRIES) + chapter_start()

TALK_KINDS = ['Clinic or healthcare', 'Engineering or industrial', 'Trades or construction', 'Property or interiors',
              'Technology', 'Food or hospitality', 'Something else']
TALK_HELP = ['Website design &amp; build', 'Growth marketing', 'AI receptionist', 'WhatsApp automation',
             'Custom software or CRM', 'Web app or dashboard', 'Maintenance &amp; support', 'Not sure yet']
ARROW = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def talk_form(p='c'):
    """The enquiry form: a card of ruled rows with floating uppercase labels, the kind of
    business, chips for what they need, and a black send bar. Posts to FormSubmit (main.js)."""
    row = lambda fid, name, label, kind='text', extra='': (
        f'<div class="tf__row"><input id="{p}-{fid}" name="{name}" type="{kind}" placeholder=" "{extra}><label for="{p}-{fid}">{label}</label></div>')
    kinds = ''.join(f'<option>{k}</option>' for k in TALK_KINDS)
    chips = ''.join(f'<label class="tf__chip"><input type="checkbox" name="help" value="{h}"><span>{h}</span></label>' for h in TALK_HELP)
    return f'''<form class="form tf" data-send data-subject="New enquiry from summitxstudio.com" action="https://formsubmit.co/vedh.shetty@summitxstudio.com" method="post" novalidate data-reveal>
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" class="form__trap">
      <input type="hidden" name="_subject" value="New enquiry from summitxstudio.com"><input type="hidden" name="_cc" value="team@summitxstudio.com"><input type="hidden" name="_template" value="table"><input type="hidden" name="_captcha" value="false">
      <div class="tf__a">
      {row('name', 'name', 'Full name', extra=' autocomplete="name" required')}
      {row('business', 'business', 'Business / brand', extra=' autocomplete="organization"')}
      {row('email', 'email', 'Email', 'email', ' autocomplete="email" required')}
      {row('site', 'website', 'Current website, if you have one', 'text', ' autocomplete="url"')}
      <div class="tf__row tf__row--select"><label class="sr" for="{p}-kind">What kind of business?</label><select id="{p}-kind" name="business_type"><option value="" selected>What kind of business?</option>{kinds}</select><svg class="tf__chev" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div>
      <div class="tf__b">
      <fieldset class="tf__chips"><legend>How can we help?</legend><div class="tf__chipset">{chips}</div></fieldset>
      <div class="tf__row tf__row--area"><textarea id="{p}-msg" name="message" rows="4" placeholder=" "></textarea><label for="{p}-msg">Your message</label></div>
      </div>
      <button class="tf__send" type="submit"><span data-label>Send message</span>{ARROW}</button>
      <div class="form__ok" role="status"><p class="fg__t">Sent</p><p class="fg__p">Thanks. We will reply within one working day. If it is urgent, email <a class="mail" href="mailto:team@summitxstudio.com">team@summitxstudio.com</a>.</p></div>
      <div class="form__err" role="alert"><p class="fg__t">Not sent</p><p class="fg__p">Something went wrong on our side. Please email <a class="mail" href="mailto:vedh.shetty@summitxstudio.com">vedh.shetty@summitxstudio.com</a> and we will reply within one working day.</p></div>
    </form>'''


CONTACT_CH = [('reach', 'Reach us'), ('write', 'Write')]
CONTACT = f'''
<section class="talk" id="top" data-ink aria-labelledby="talk-t">
  <div class="talk__frame" aria-hidden="true">
    <img class="talk__art" src="assets/img/paint/handshake.jpg" alt="" width="1344" height="752" fetchpriority="high">
    <img class="talk__crest" src="assets/img/frame-crest.png" alt="" width="359" height="198">
  </div>
  <div class="talk__inner">
    <h1 class="talk__h" id="talk-t">Let&rsquo;s start a<br>conversation<br>about it.</h1>
    {talk_form('c')}
    <div class="talk__alt">
      <p class="talk__or">Prefer email?</p>
      <p class="talk__mail">Write to <a class="mail" href="mailto:team@summitxstudio.com">team@summitxstudio.com</a>, or to Vedh directly at <a class="mail" href="mailto:vedh.shetty@summitxstudio.com">vedh.shetty@summitxstudio.com</a>. We reply within one working day.</p>
    </div>
  </div>
</section>
'''

GET_STARTED_CH = [('start', 'Start'), ('review', 'Free review')]
GET_STARTED = simple_page('summit', 'A Renaissance figure on a mountain summit planting a banner', 'Get started &middot; tell us what you need',
    chapter('start', 'Start', 'summit', 'A Renaissance figure on a mountain summit above the clouds planting a banner painted as a web page',
            'No pitch, no pressure. Tell us what you need, and within one working day we tell you honestly whether we are the right fit and roughly what it would cost.',
            f'''{sub_head('How it starts')}
    {feat_grid(STEPS)}
    <div id="write"></div>
    {sub_head('Tell us about it')}
    {talk_form('g')}
    <div id="review"></div>
    {sub_head('Not ready yet?')}
    {spot('Get a free review of your current website', 'Send us the link. We will reply with a short video or written note on what we would change and why. No pitch, no obligation.')}
    <form class="form form--inline" data-send data-subject="Free website review request" action="https://formsubmit.co/vedh.shetty@summitxstudio.com" method="post" novalidate data-reveal>
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" class="form__trap">
      <input type="hidden" name="_subject" value="Free website review request"><input type="hidden" name="_template" value="table"><input type="hidden" name="_captcha" value="false">
      <div class="field"><label class="label" for="rv-url">Your website</label><input id="rv-url" name="url" type="url" placeholder="https://" required inputmode="url"></div>
      <div class="field"><label class="label" for="rv-email">Where to send it</label><input id="rv-email" name="email" type="email" placeholder="you@company.com" required></div>
      <div class="form__actions"><button class="pill pill--dark" type="submit">Send me the review</button><span class="form__hint">Usually within two working days.</span></div>
      <div class="form__ok" role="status"><p class="fg__t">Sent</p><p class="fg__p">Thanks. Your review is on its way within two working days.</p></div>
      <div class="form__err" role="alert"><p class="fg__t">Not sent</p><p class="fg__p">Something went wrong on our side. Please email <a class="mail" href="mailto:vedh.shetty@summitxstudio.com">vedh.shetty@summitxstudio.com</a> and we will reply within one working day.</p></div>
    </form>'''))

NOT_FOUND_CH = [('lost', 'Not found')]
NOT_FOUND = simple_page('summit', 'A Renaissance figure on a mountain summit above the clouds planting a banner painted as a web page', 'Page not found',
    chapter('lost', '404', None, '', "This page isn't here. The link may be old, or the address mistyped.",
            f'''<div class="cta" data-reveal>
      {pill('Back to the home page', 'index.html', 'pill--dark pill--big')}
      {chip('Studio', 'studio.html')}
      {chip('Projects', 'projects.html')}
      {chip('Contact', 'contact.html')}
    </div>'''))

PAGES = {
    'index.html': ('Summit Studios | Premium web design for engineering firms, clinics and trades',
                   'Summit Studios designs and builds premium websites, AI receptionists, WhatsApp automation and custom software for engineering firms, clinics and trades worldwide. 30+ sites shipped.',
                   HOME, HOME_CHAPTERS, True),
    'projects.html': ('Projects | Summit Studios', 'Selected work from 30+ websites: engineering and industrial firms, clinics and doctors, technology, property, interiors, food and hospitality.', PROJECTS_PAGE, PROJECTS_CH, False),
    'studio.html': ('Studio | Summit Studios', 'A small studio with a high bar. Designers and developers building premium websites for businesses worldwide.', STUDIO, STUDIO_CH, False),
    'industries.html': ('Industries | Summit Studios', 'Websites for healthcare, industrial and engineering, technology, construction and real estate, interiors, food and e-commerce, and hospitality.', INDUSTRIES_PAGE, INDUSTRIES_CH, False),
    'contact.html': ('Contact | Summit Studios', 'Start a conversation with Summit Studios. Send a message or reach us by email, and we reply within one working day.', CONTACT, CONTACT_CH, False),
    'get-started.html': ('Get started | Summit Studios', 'Tell Summit Studios what you need. We look at your current site and reply within one working day with a straight answer on fit and rough cost.', GET_STARTED, GET_STARTED_CH, False),
    '404.html': ('Page not found | Summit Studios', 'This page could not be found.', NOT_FOUND, NOT_FOUND_CH, False),
}

def stamp_css():
    """Images the stylesheet links to (masks, the gilt frame...) get a ?v=<hash> as well: /assets is cached for
    a year, so without it a changed image keeps showing the old copy (the Start mask's ghost swallows).
    Rewrites url(../...) in assets/css/style.css in place; runs before the pages so the CSS's own hash is current."""
    css = OUT / 'assets/css/style.css'
    src = css.read_text()
    def sub(m):
        q, rel = m.group(1), m.group(2)
        p = (css.parent / rel).resolve()
        h = hashlib.sha1(p.read_bytes()).hexdigest()[:8] if p.exists() else 'missing'
        return f'url({q}{rel}?v={h}{q})'
    out = re.sub(r"""url\((["']?)(\.\./[^"')?]+)(?:\?v=[0-9a-f]+)?\1\)""", sub, src)
    if out != src:
        css.write_text(out)


if __name__ == '__main__':
    stamp_css()
    for f, (t, d, body, chapters, ld) in PAGES.items():
        page(f, t, d, body, chapters, MARK, SUB, ld)
