// Shared look and page furniture for every Summit Studios brochure.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '..', '..');

export const LOGO = `data:image/png;base64,${readFileSync(join(HERE, 'logo.b64'), 'utf8').trim()}`;

export const CONTACT = {
  whatsapp: '+91 98441 70575',
  email: 'summitstud@gmail.com',
  site: 'summitxstudio.com',
  based: 'Mangaluru, India — working worldwide',
};

/** Dark brand palette. The wash is a hint of the site's shader, not a light background. */
export const CSS = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #07070c; }
  body { font-family: Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

  .page { position: relative; width: 210mm; height: 297mm; padding: 18mm 18mm 30mm;
    background: #07070c; color: #fff; overflow: hidden;
    display: flex; flex-direction: column; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  .page::before { content: ""; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(100% 70% at 100% 0%, rgba(132, 92, 246, 0.34), transparent 62%),
      radial-gradient(85% 60% at 0% 100%,  rgba(59, 100, 224, 0.26), transparent 64%); }
  .page > * { position: relative; z-index: 1; }

  .mono { font-family: "JetBrains Mono", ui-monospace, monospace; text-transform: uppercase;
    letter-spacing: 0.22em; font-size: 9pt; color: rgba(255,255,255,0.6); }
  .folio { position: absolute; left: 18mm; right: 18mm; bottom: 12mm; z-index: 1;
    display: flex; justify-content: space-between;
    font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8pt;
    letter-spacing: 0.16em; color: rgba(255,255,255,0.42);
    border-top: 1px solid rgba(255,255,255,0.16); padding-top: 4mm; }

  .brand { display: flex; align-items: center; gap: 4mm; }
  .brand img { width: 12mm; height: 12mm; }
  .brand b { font-size: 17pt; font-weight: 600; letter-spacing: -0.02em; }
  .brand b i { font-weight: 300; font-style: italic; }

  h1 { font-size: 37pt; line-height: 1.07; font-weight: 300; letter-spacing: -0.025em; }
  h1 i, h2 i { font-style: italic; }
  h2 { font-size: 29pt; line-height: 1.1; font-weight: 300; letter-spacing: -0.02em; }
  .lede { font-size: 13pt; line-height: 1.62; font-weight: 300; color: rgba(255,255,255,0.86); }
  .note { font-size: 11pt; line-height: 1.6; font-weight: 300; color: rgba(255,255,255,0.66); }

  .cover { justify-content: flex-start; }
  .cover .spacer { flex: 1; }
  .cover h1 { margin-top: 7mm; max-width: 158mm; }
  .cover .lede { margin-top: 9mm; max-width: 142mm; }
  .pills { margin-top: 12mm; display: flex; flex-wrap: wrap; gap: 2.5mm; max-width: 156mm; }
  .pills span { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8.5pt;
    letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.9);
    border: 1px solid rgba(255,255,255,0.3); border-radius: 20pt; padding: 2.2mm 4.5mm; }

  /* Numbered list of things */
  .svc { margin-top: 8mm; display: flex; flex-direction: column; gap: 4.5mm; }
  .svc .row { display: grid; grid-template-columns: 14mm 1fr; gap: 3mm;
    border-top: 1px solid rgba(255,255,255,0.16); padding-top: 4mm; }
  .svc .num { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 9pt;
    color: rgba(255,255,255,0.45); padding-top: 1mm; }
  .svc h3 { font-size: 15pt; font-weight: 500; letter-spacing: -0.01em; }
  .svc p { margin-top: 2.5mm; font-size: 11pt; line-height: 1.55; font-weight: 300;
    color: rgba(255,255,255,0.8); max-width: 152mm; }
  .svc ul { margin-top: 3.5mm; display: flex; flex-wrap: wrap; gap: 2mm; list-style: none; }
  .svc li, .chips li { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.6pt;
    letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.75);
    border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06);
    border-radius: 20pt; padding: 1.7mm 3.4mm; }
  .chips { display: flex; flex-wrap: wrap; gap: 2mm; list-style: none; }

  /* Bordered points */
  .deep { margin-top: 10mm; display: flex; flex-direction: column; gap: 7mm; }
  .deep .item { border-left: 2px solid rgba(255,255,255,0.26); padding-left: 6mm; }
  .deep h3 { font-size: 14.5pt; font-weight: 500; letter-spacing: -0.01em; }
  .deep p { margin-top: 2.5mm; font-size: 11.5pt; line-height: 1.6; font-weight: 300;
    color: rgba(255,255,255,0.82); max-width: 155mm; }

  /* Process steps */
  .steps { margin-top: 9mm; display: flex; flex-direction: column; }
  .steps .st { display: grid; grid-template-columns: 20mm 1fr; gap: 4mm;
    padding: 5.5mm 0; border-top: 1px solid rgba(255,255,255,0.16); }
  .steps .st:last-child { border-bottom: 1px solid rgba(255,255,255,0.16); }
  .steps .n { font-size: 20pt; font-weight: 200; color: rgba(255,255,255,0.45); line-height: 1; }
  .steps h3 { font-size: 14.5pt; font-weight: 500; letter-spacing: -0.01em; }
  .steps p { margin-top: 2mm; font-size: 11pt; line-height: 1.55; font-weight: 300;
    color: rgba(255,255,255,0.8); max-width: 138mm; }

  /* Stats + contact */
  .stats { margin-top: 12mm; display: grid; grid-template-columns: 1fr 1fr; gap: 9mm 6mm; }
  .stats dt { font-size: 27pt; font-weight: 200; letter-spacing: -0.02em; }
  .stats dd { margin-top: 2mm; font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 8.5pt; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.62); }
  .contact { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 7mm; }
  .contact .row { display: grid; grid-template-columns: 28mm 1fr; gap: 4mm; padding: 2.8mm 0; }
  .contact .k { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8.5pt;
    letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.5); padding-top: 1mm; }
  .contact .v { font-size: 13.5pt; font-weight: 300; }

  /* Project cards with a screenshot */
  .proj { margin-top: 9mm; display: flex; flex-direction: column; gap: 9mm; }
  .proj .p { display: grid; grid-template-columns: 78mm 1fr; gap: 7mm; align-items: start; }
  .proj img { width: 100%; border-radius: 3mm; border: 1px solid rgba(255,255,255,0.16); display: block; }
  .proj .k { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.6pt;
    letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
  .proj h3 { margin-top: 2.5mm; font-size: 16pt; font-weight: 500; letter-spacing: -0.015em; }
  .proj p { margin-top: 3mm; font-size: 10.5pt; line-height: 1.55; font-weight: 300;
    color: rgba(255,255,255,0.8); }
  .proj .url { margin-top: 3.5mm; font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 8pt; letter-spacing: 0.06em; color: rgba(255,255,255,0.55); }

  /* Quotes */
  .quotes { margin-top: 9mm; display: flex; flex-direction: column; gap: 6mm; }
  .quotes .q { border-left: 2px solid rgba(255,255,255,0.26); padding-left: 6mm; }
  .quotes blockquote { font-size: 12.5pt; line-height: 1.55; font-weight: 300;
    color: rgba(255,255,255,0.92); }
  .quotes .who { margin-top: 3mm; display: flex; align-items: center; gap: 3mm; }
  .quotes .who img { width: 7mm; height: 7mm; border-radius: 1.6mm; }
  .quotes .who b { font-size: 10.5pt; font-weight: 500; }
  .quotes .who span { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.6pt;
    letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5); }

  /* Audit checklist */
  .audit { margin-top: 8mm; display: flex; flex-direction: column; gap: 4mm; }
  .audit .a { display: grid; grid-template-columns: 9mm 1fr 24mm; gap: 4mm; align-items: start;
    border-top: 1px solid rgba(255,255,255,0.16); padding-top: 4mm; }
  .audit .box { width: 5.5mm; height: 5.5mm; border: 1px solid rgba(255,255,255,0.4);
    border-radius: 1.2mm; margin-top: 1mm; }
  .audit h3 { font-size: 12.5pt; font-weight: 500; }
  .audit p { margin-top: 1.8mm; font-size: 10pt; line-height: 1.5; font-weight: 300;
    color: rgba(255,255,255,0.72); }
  .audit .score { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.6pt;
    letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.42);
    text-align: right; padding-top: 1.5mm; }
`;

export const page = (n, cls, inner) => `<section class="page ${cls}">
  ${inner}
  <div class="folio"><span>${CONTACT.site}</span><span>${n}</span></div>
</section>`;

export const cover = (kicker, title, lede, pills) => page('01', 'cover', `
  <div class="brand"><img src="${LOGO}" alt="" /><b>summit<i>studios</i></b></div>
  <div class="spacer"></div>
  <div>
    <p class="mono">${kicker}</p>
    <h1>${title}</h1>
    <p class="lede">${lede}</p>
    ${pills ? `<div class="pills">${pills.map((p) => `<span>${p}</span>`).join('')}</div>` : ''}
  </div>`);

export const contactBlock = () => `
  <div class="contact">
    <div class="brand" style="margin-bottom:6mm"><img src="${LOGO}" alt="" /><b>summit<i>studios</i></b></div>
    <div class="row"><div class="k">WhatsApp</div><div class="v">${CONTACT.whatsapp}</div></div>
    <div class="row"><div class="k">Email</div><div class="v">${CONTACT.email}</div></div>
    <div class="row"><div class="k">Website</div><div class="v">${CONTACT.site}</div></div>
    <div class="row"><div class="k">Based in</div><div class="v">${CONTACT.based}</div></div>
  </div>`;

export const doc = (title, pages) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>${CSS}</style></head><body>
${pages.join('\n')}
</body></html>`;
