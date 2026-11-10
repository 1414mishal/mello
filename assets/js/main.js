/* Summit Studios v3: behaviour that works without the motion layer.
   Menu, local clock, forms, booking embed, project filters. */
(() => {
  'use strict';
  const d = document;
  const root = d.documentElement;
  root.classList.add('js');

  /* ---------- Mobile menu ---------- */
  const menuBtn = d.querySelector('[data-menu]');
  const closeMenu = () => { root.classList.remove('nav-open'); if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false'); };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => { const open = root.classList.toggle('nav-open'); menuBtn.setAttribute('aria-expanded', String(open)); });
    d.querySelectorAll('.hdr__nav a').forEach(a => a.addEventListener('click', closeMenu));
    d.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Chapter index: the arrow pops it out once it has tucked away ---------- */
  const sbToggle = d.querySelector('[data-sb-toggle]');
  if (sbToggle) {
    const sb = d.querySelector('[data-sb]');
    const setOpen = open => {
      root.classList.toggle('sb-open', open);
      sbToggle.setAttribute('aria-expanded', String(open));
      sbToggle.querySelector('.sr').textContent = open ? 'Hide the chapter index' : 'Show the chapter index';
    };
    sbToggle.addEventListener('click', e => { e.stopPropagation(); setOpen(!root.classList.contains('sb-open')); });
    d.addEventListener('click', e => { if (root.classList.contains('sb-open') && !sb.contains(e.target)) setOpen(false); });
    sb.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('sb-open')) { setOpen(false); sbToggle.focus(); } });
    window.__sbClose = () => setOpen(false);
  }

  /* ---------- Local clock ---------- */
  const clocks = d.querySelectorAll('[data-clock]');
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => { const t = fmt.format(new Date()); clocks.forEach(c => { c.textContent = t; }); };
    tick(); setInterval(tick, 15000);
  }

  /* ---------- Forms: sent by email through FormSubmit ----------
     Without JS the form posts normally (FormSubmit shows its own thank-you page). With JS it
     posts to the AJAX endpoint and shows the inline Sent / Not sent state. */
  d.querySelectorAll('form[data-send]').forEach(f => {
    const btn = f.querySelector('[type=submit]');
    f.addEventListener('submit', async e => {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      f.classList.remove('is-error');
      const lab = btn.querySelector('[data-label]') || btn, label = lab.textContent; btn.disabled = true; lab.textContent = 'Sending…';
      const data = {};   // a field ticked more than once (the help chips) goes as one comma-separated line
      for (const [k, v] of new FormData(f)) data[k] = k in data ? data[k] + ', ' + v : v;
      data._url = location.href;
      // sent as an ordinary form post (not JSON), so the browser needn't ask FormSubmit's permission
      // first (that round trip alone took 10-15 s); given up on after 30 s so it never hangs
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 30000);
      let why = '';
      try {
        const r = await fetch(f.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), { method: 'POST', headers: { Accept: 'application/json' }, body: new URLSearchParams(data), signal: ctl.signal });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) !== 'true') { why = j.message || ''; throw new Error(why || r.status); }
        f.classList.add('is-sent');
      } catch (err) {
        if (err.name === 'AbortError') why = 'The form service took too long to answer.';
        const box = f.querySelector('.form__err');
        let p = box && box.querySelector('.form__why');
        if (box && !p) { p = d.createElement('p'); p.className = 'form__why'; box.append(p); }
        if (p) p.textContent = why;   // e.g. FormSubmit's "This form needs Activation..." while it's being set up
        f.classList.add('is-error');
      } finally { clearTimeout(timer); btn.disabled = false; lab.textContent = label; }
    });
  });

  /* ---------- Things that grow into place when they come into view ---------- */
  const growers = d.querySelectorAll('[data-grow]');
  if (growers.length) {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) growers.forEach(g => g.classList.add('is-in'));
    else { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .3 }); growers.forEach(g => io.observe(g)); }
  }

  /* ---------- "Calls, answered": the handset cord, drawn to fit the layout ----------
     From the handset's cord stub it falls, loops once, then runs left beneath the text
     and the call card to the screen's edge. Recomputed on resize. */
  d.querySelectorAll('[data-calls]').forEach(c => {
    const svg = c.querySelector('.calls__cord'), path = svg && svg.querySelector('path');
    const hand = c.querySelector('.calls__hand img'), text = c.querySelector('.calls__text'), card = c.querySelector('.calls__card');
    if (!path || !hand) return;
    const draw = () => {
      const o = svg.getBoundingClientRect(), h = hand.getBoundingClientRect();
      if (!h.width || getComputedStyle(svg).display === 'none') return;
      const sx = h.left - o.left + h.width * .455, sy = h.top - o.top + h.height * .925;   // the cord stub
      const low = Math.max(text.getBoundingClientRect().bottom, card.getBoundingClientRect().bottom) - o.top + 48;
      const lx = sx - h.width * .55, ly = Math.max(sy + 140, low - 40);              // the loop
      const r = 16;
      svg.setAttribute('viewBox', `0 0 ${o.width} ${o.height}`);
      path.setAttribute('d', [
        `M${sx} ${sy}`,
        `C ${sx} ${sy + (ly - sy) * .6}, ${lx + 80} ${ly - 10}, ${lx + r} ${ly}`,
        `C ${lx + r + 18} ${ly + 14}, ${lx - r} ${ly + 22}, ${lx - r} ${ly + 4}`,
        `C ${lx - r} ${ly - 16}, ${lx + r} ${ly - 8}, ${lx} ${ly + 12}`,
        `C ${lx - 60} ${low + 10}, ${o.width * .45} ${low + 24}, -20 ${low + 30}`,
      ].join(' '));
    };
    if (hand.complete) draw(); else hand.addEventListener('load', draw, { once: true });
    addEventListener('resize', draw);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(draw);
  });

  /* ---------- Rip: the cards' paper tears away to reveal the next painting ----------
     The painting sits behind the cards section. As its bottom comes up the screen, the
     paper's torn edge climbs faster than the page, and each stretch of it climbs at its own
     rate, so peaks open up on one side while the other lags behind. One fixed torn shape,
     driven only by the scroll. The painting shows as a dark etching first, then in colour. */
  d.querySelectorAll('[data-rip]').forEach(box => {
    const svg = box.querySelector('svg'), sec = box.closest('section');
    const paper = svg.querySelector('[data-wave="paper"]'), foam = svg.querySelector('[data-wave="fibre"]');
    const nextSec = sec.nextElementSibling, bg = nextSec && nextSec.querySelector('.ch__bg'), img = bg && bg.querySelector('.paint');
    const cards = [...sec.querySelectorAll('.duo__card > *')];
    // zoom-out: the painting starts close on the view through the window and pulls back
    const zoomAt = img && img.dataset.zoom ? img.dataset.zoom.split(',').map(Number) : null;
    const Z = 2.7;
    const zoomOrigin = () => {
      if (!zoomAt || !img.naturalWidth) return;
      const w = bg.clientWidth, h = bg.clientHeight, c = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * c, dh2 = img.naturalHeight * c;
      const pos = getComputedStyle(img).objectPosition.split(' ').map(v => (v.endsWith('%') ? parseFloat(v) / 100 : .5));   // where cover crops the picture
      const o = `${((w - dw) * pos[0] + zoomAt[0] * dw).toFixed(1)}px ${((h - dh2) * pos[1] + zoomAt[1] * dh2).toFixed(1)}px`;
      [img, etch].forEach(el => { if (el) { el.style.transformOrigin = o; el.style.willChange = 'transform'; } });
    };   // the parts, not the card (its reveal tween owns the card's opacity)
    let etch = null;
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const N = 260, jit = Array.from({ length: N + 1 }, () => rnd() - .5);
    const raw = Array.from({ length: N + 1 }, () => rnd()), fz = raw.map((_, i) => (raw[Math.max(0, i - 1)] + raw[i] * 2 + raw[Math.min(N, i + 1)]) / 4);
    let W = 0, H = 0;
    const size = () => { W = box.clientWidth; H = box.clientHeight; svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H); };
    const draw = () => {
      const vh = innerHeight, r = sec.getBoundingClientRect(), dh = sec.offsetHeight;
      const prog = (vh - r.bottom) / vh;                      // 0 when the cards' bottom reaches the screen's bottom, 1 at its top
      const lift = Math.max(0, prog - .12) * vh * .6;         // tears once the paper's edge is near the bottom of the screen
      const A = Math.min(.075 * vh, 70), sc = Math.max(W / 1440, .5);
      let p = 'M0 0 L', f = 'M0 0 L', minY = 1e9;
      for (let i = 0; i <= N; i++) {
        const x = i / N * W, u = x / sc;
        const ridge = A * (.6 * Math.sin(u / 240) + .28 * Math.sin(u / 115 + 1.3) + .12 * Math.sin(u / 47)) + jit[i] * 3;
        const rate = 1 + .5 * Math.sin(u / 360 + .7) + .25 * Math.sin(u / 150 + 2.2);   // how fast this stretch tears
        const y = Math.max(-20, dh + A + 24 + ridge - lift * rate);
        if (y < minY) minY = y;
        p += `${x.toFixed(1)} ${y.toFixed(1)} `;
        f += `${x.toFixed(1)} ${(y + 5 + fz[i] * 16).toFixed(1)} `;
      }
      paper.setAttribute('d', p + `L${W} 0 Z`);
      foam.setAttribute('d', f + `L${W} 0 Z`);
      if (etch) etch.style.opacity = (1 - Math.max(0, Math.min(1, (prog - .75) / .4))).toFixed(3);
      if (zoomAt) {
        const t = Math.max(0, Math.min(1, (prog - .12) / .95)), e = t * t * (3 - 2 * t);
        const z = `scale(${(1 + (Z - 1) * (1 - e)).toFixed(4)})`;
        img.style.transform = z; if (etch) etch.style.transform = z;
      }
      const fade = (1 - Math.max(0, Math.min(1, (prog - .45) / .45))).toFixed(3);
      cards.forEach(c => { c.style.opacity = fade; });
      root.classList.toggle('ui-over-paint', !root.classList.contains('has-orbit') && r.top + minY < 70 && r.bottom > -vh * .2);   // framed walk: parchment under the header
    };
    size(); zoomOrigin(); draw();
    if (img && !img.complete) img.addEventListener('load', () => { zoomOrigin(); draw(); }, { once: true });
    let raf = 0; const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
    addEventListener('scroll', kick, { passive: true }); addEventListener('resize', () => { size(); zoomOrigin(); draw(); });
    const hook = () => { if (window.__summit && window.__summit.lenis) window.__summit.lenis.on('scroll', kick); };
    if (window.__summit) hook(); else addEventListener('load', hook);
  });

  /* ---------- Phones: the header wordmark steps aside while you scroll down ----------
     It has no background, so on a phone it sat on top of the content. It comes back as soon as you
     scroll up, or near the top of the page. The Contact and menu buttons are solid and always stay. */
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (innerWidth >= 900 || y < innerHeight * .4) root.classList.remove('hdr-tuck');
    else if (y > lastY + 4) root.classList.add('hdr-tuck');
    else if (y < lastY - 4) root.classList.remove('hdr-tuck');
    lastY = y;
  }, { passive: true });

  /* ---------- Projects index: filter by sector (every project shows under "All") ---------- */
  const work = d.querySelector('[data-work]');
  if (work) {
    const rows = [...work.querySelectorAll('.row')];
    let f = 'all';
    const apply = () => {
      rows.forEach(r => { r.hidden = f !== 'all' && r.dataset.sector !== f; });
      if (window.__summit && window.__summit.ScrollTrigger) window.__summit.ScrollTrigger.refresh();
    };
    d.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
      d.querySelectorAll('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      f = b.dataset.filter; apply();
    }));
    apply();
  }
})();
