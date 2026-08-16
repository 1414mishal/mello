# Brochure source

`build-brochure.mjs` writes the brochure HTML; `html-to-pdf.mjs` prints any
local HTML file to PDF through headless Chrome.

To change wording, edit the arrays at the top of `build-brochure.mjs`
(`services`, `steps`, `website`) and the page templates below them, then:

    node build-brochure.mjs
    node html-to-pdf.mjs brochure.html ../Summit-Studios-Brochure.pdf

Both scripts expect `logo.b64` alongside them — a base64 copy of logo-mark.png:

    node -e "console.log(require('fs').readFileSync('../../logo-mark.png').toString('base64'))" > logo.b64

Kept out of the deployed site: the site is access-gated, and the brochure is
meant to be forwarded directly on WhatsApp rather than downloaded from it.
