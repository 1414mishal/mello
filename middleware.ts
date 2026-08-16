/**
 * Per-client access gate for the whole site.
 *
 * Clients get a bespoke link that reads like it was made for them:
 *   https://www.summitxstudio.com/for/acme-k7f2qp9x
 *
 * That URL answers with a small page carrying the og: tags, so a shared link
 * still draws a preview card, and sets a cookie before moving the browser on
 * to the homepage — after which everything behaves like a normal site. Anyone
 * without a valid token gets a plain 404, so the site never reveals there is
 * anything here to unlock.
 *
 * Tokens live in the CLIENT_KEYS environment variable (comma separated) so they
 * are never committed to the repo. Issue one per client: if a link gets passed
 * around, the token tells you whose it was, and you can revoke just that one
 * without disturbing anybody else.
 */

const COOKIE = 'sx_access';
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

/**
 * Kept reachable without a token so WhatsApp/iMessage link previews and the
 * browser tab icon still render. These are only the logo and the share image —
 * no portfolio content.
 */
const ALWAYS_PUBLIC = new Set([
  '/favicon.png',
  '/logo-mark.png',
  '/og-image.png',
  '/robots.txt',
]);

/**
 * Access codes, lower-cased so a code shared by email or read out loud still
 * works whatever way the other person types it.
 */
function validTokens(): string[] {
  return (process.env.CLIENT_KEYS ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function isValid(candidate: string | null, tokens: string[]): boolean {
  return !!candidate && tokens.includes(candidate.trim().toLowerCase());
}

function cookieToken(request: Request): string | null {
  const header = request.headers.get('cookie') ?? '';
  const match = header.match(/(?:^|;\s*)sx_access=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function unlockCookie(token: string): string {
  return (
    `${COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE}; ` +
    `HttpOnly; Secure; SameSite=Lax`
  );
}

/** Let the request through to the static file, attaching extra response headers. */
function allow(headers: Record<string, string> = {}) {
  return new Response(null, {
    headers: {
      'x-middleware-next': '1',
      // A leaked token link should still never end up in search results.
      'x-robots-tag': 'noindex, nofollow',
      ...headers,
    },
  });
}

export default function middleware(request: Request) {
  const url = new URL(request.url);

  if (ALWAYS_PUBLIC.has(url.pathname)) return;

  const tokens = validTokens();

  // The shareable link: /for/<code>
  const invite = url.pathname.match(/^\/for\/([^/]+)\/?$/);
  if (invite) {
    const code = decodeURIComponent(invite[1]);
    if (!isValid(code, tokens)) return notFound();

    // Answer with a real HTML page rather than a redirect, so that WhatsApp,
    // iMessage and the like can read the og: tags and draw a preview card —
    // they do not carry cookies, so a redirect would just land them on a 404.
    // Browsers get the cookie and are moved straight on to the homepage; the
    // pages use relative asset paths, so they have to end up at the root.
    return new Response(invitePage(url.origin, url.origin + url.pathname), {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'set-cookie': unlockCookie(code.trim().toLowerCase()),
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    });
  }

  // Fallback that also works: ?k=<code> on any page.
  const supplied = url.searchParams.get('k');
  if (isValid(supplied, tokens)) {
    return allow({ 'set-cookie': unlockCookie(supplied!.trim().toLowerCase()) });
  }

  // Already unlocked on this device.
  if (isValid(cookieToken(request), tokens)) return allow();

  return notFound();
}

/**
 * The page served at /for/<code>.
 *
 * Two audiences: link-preview crawlers, which read the og: tags and stop; and
 * real browsers, which are moved on to the homepage immediately. All asset and
 * meta URLs are absolute, since this page lives one level down at /for/.
 */
function invitePage(origin: string, selfUrl: string): string {
  const title = 'Summit Studios | Websites That Bring In Customers';
  // Front-loaded: WhatsApp shows roughly the first two lines and truncates the rest.
  const description =
    'Custom websites for clinics, doctors, brands and businesses — designed and ' +
    'built end to end, fast on mobile, and made to turn a visitor into a booking. ' +
    'Dozens live across India, plus apps, AI receptionists and CRMs.';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="robots" content="noindex, nofollow" />
<meta name="description" content="${description}" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Summit Studios" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${selfUrl}" />
<meta property="og:image" content="${origin}/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Summit Studios logo" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${origin}/og-image.png" />

<link rel="icon" type="image/png" href="${origin}/favicon.png" />
<!-- No refresh redirect here on purpose: preview crawlers follow those to the
     root, arrive without a cookie, hit the 404 and then render no card.
     Browsers are moved on by the script below instead; crawlers ignore it. -->
<style>
  html,body{height:100%;margin:0}
  body{background:#060608;display:flex;align-items:center;justify-content:center}
  .dove{display:block;width:72px;height:72px;background-color:#fff;
    -webkit-mask:url("${origin}/logo-mark.png") center/contain no-repeat;
            mask:url("${origin}/logo-mark.png") center/contain no-repeat;
    filter:drop-shadow(0 0 18px rgba(140,120,255,.45));
    animation:in .9s cubic-bezier(.22,1,.36,1) both}
  @keyframes in{from{opacity:0;transform:translateY(10px) rotate(0deg) scale(.82)}
                  to{opacity:1;transform:translateY(0) rotate(-8deg) scale(1)}}
</style>
</head>
<body>
  <a class="dove" href="/" aria-label="Enter Summit Studios"></a>
  <script>location.replace('/');</script>
</body>
</html>`;
}

function notFound() {
  return new Response('Not Found', {
    status: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export const config = {
  // Everything except Vercel's own internal paths.
  matcher: ['/((?!_vercel).*)'],
};
