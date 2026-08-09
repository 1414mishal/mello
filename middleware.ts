/**
 * Per-client access gate for the whole site.
 *
 * Clients get a link like:
 *   https://www.summitxstudio.com/?k=THEIR-TOKEN
 *
 * That first visit sets a cookie, so every page they browse afterwards works
 * normally without the token in the URL. Anyone without a valid token gets a
 * plain 404 — the site never reveals that there is anything here to unlock.
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

function validTokens(): string[] {
  return (process.env.CLIENT_KEYS ?? '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

function cookieToken(request: Request): string | null {
  const header = request.headers.get('cookie') ?? '';
  const match = header.match(/(?:^|;\s*)sx_access=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
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
  const supplied = url.searchParams.get('k');

  // A fresh link: serve the page and remember this visitor.
  if (supplied && tokens.includes(supplied)) {
    return allow({
      'set-cookie':
        `${COOKIE}=${encodeURIComponent(supplied)}; Path=/; Max-Age=${MAX_AGE}; ` +
        `HttpOnly; Secure; SameSite=Lax`,
    });
  }

  // Already unlocked on this device.
  const existing = cookieToken(request);
  if (existing && tokens.includes(existing)) return allow();

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
