# Brochure source

`kit.mjs`        shared dark theme, page furniture, contact block
`build-all.mjs`  content for every brochure; writes one HTML file each
`html-to-pdf.mjs` prints a local HTML file to PDF via headless Chrome
`shots/`         compressed screenshots used by the portfolio
`logo.b64`       base64 copy of logo-mark.png

Rebuild everything:

    node build-all.mjs
    for f in *.html; do node html-to-pdf.mjs "$f" "../${f%.html}.pdf"; done

To change wording, edit the arrays inside `build-all.mjs` — each brochure is
one block. To change the look, edit `CSS` in `kit.mjs` and every document
updates together.

If `logo.b64` is missing:

    node -e "console.log(require('fs').readFileSync('../../logo-mark.png').toString('base64'))" > logo.b64

Not deployed with the site: the site is access-gated, and these are meant to be
forwarded directly on WhatsApp.
