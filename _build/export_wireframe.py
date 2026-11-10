"""Export the 'Why Summit' wireframe sheets as one self-contained HTML file for editing
in a design tool: each sheet fully drawn on its own full-screen board over the painting."""
import base64, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / '_build'))
from dive import dive_sheets, DIVE_LAYERS          # noqa: E402
import build                                        # noqa: E402  (FONTS)

style = (ROOT / 'assets/css/style.css').read_text()
root_tokens = style[style.index(':root {'):style.index('}', style.index(':root {')) + 1]
motion = (ROOT / 'assets/css/motion.css').read_text()
dive_css = motion[motion.index('/* Tokens the fly-through expects'):motion.index('/* Stacked version for phones')]
# every home-only fly-through rule (tokens, thick sheets, colours), without the .ch--rip scope
rules = re.findall(r'^\.ch--rip \.(?:dive|dv-)[^{]*\{[^}]*\}', style, flags=re.M)
home_tokens = '\n'.join(r.replace('.ch--rip ', '') for r in rules if 'dive__dots' not in r and 'dive--video' not in r and 'dive__row' not in r and 'dive__stack' not in r and 'dive__steps' not in r)
paint = base64.b64encode((ROOT / 'assets/img/paint/handshake-window.jpg').read_bytes()).decode()

html = dive_sheets()
layers = ['<div class="dive__layer' + part for part in html.split('<div class="dive__layer')[1:]]
boards = ''.join(f'''
<section class="board" aria-label="Sheet {i + 1:02d}: {DIVE_LAYERS[i]}">
  <div class="dive"><div class="dive__pin"><div class="dive__cam"><div class="dive__world">
    {L.strip()}
  </div></div></div></div>
</section>''' for i, L in enumerate(layers))

doc = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Why Summit wireframe sheets</title>
<link rel="stylesheet" href="{build.FONTS}">
<style>
{root_tokens}
*, *::before, *::after {{ box-sizing: border-box; }}
body {{ margin: 0; font: 400 14px/1.5 var(--sans); color: var(--ink); background: #1A140E; -webkit-font-smoothing: antialiased; }}
h1, h2, h3, h4, p, ul, ol {{ margin: 0; }} ul, ol {{ padding: 0; list-style: none; }}
{dive_css}
{home_tokens}
/* Static boards: one sheet per screen, over the home page's painting */
.board {{ position: relative; height: 100vh; min-height: 640px; overflow: hidden; background: url(data:image/jpeg;base64,{paint}) center / cover; }}
.board + .board {{ border-top: 6px solid #1A140E; }}
.board .dive, .board .dive__pin {{ position: absolute; inset: 0; height: 100%; background: transparent; border: 0; }}
.board .dive__layer {{ opacity: 1 !important; visibility: visible !important; transform: none !important; }}
/* everything in its finished, drawn state */
.board path, .board line, .board rect {{ stroke-dashoffset: 0 !important; }}
.board .dv-grid__cell {{ opacity: 1; }}
.board .dv-code__l {{ clip-path: none; }}
.board .dv-palette li, .board .dv-node, .board .dv-ruler__tick .dv-live {{ transform: none; }}
.board .dv-node__strike {{ transform: scaleX(1) rotate(-6deg); }}
.board .dv-ruler__fill {{ transform: scaleX(1); }}
</style></head>
<body>{boards}
</body></html>
'''
out = ROOT / 'design-files/why-summit-wireframe.html'
out.write_text(doc)
print('wrote', out.relative_to(ROOT), len(doc) // 1024, 'KB,', len(layers), 'sheets')
