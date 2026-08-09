/**
 * Per-client access gate for the whole site.
 *
 * Clients get a bespoke link that reads like it was made for them:
 *   https://www.summitxstudio.com/for/acme-k7f2qp9x
 *
 * That URL renders the homepage in place (no redirect, so link previews still
 * work) and sets a cookie, so everything they click afterwards behaves like a
 * normal site. Anyone without a valid token gets a plain 404 — the site never
 * reveals there is anything here to unlock.
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

    // Unlock, then hand the visitor to the real homepage. This has to be a
    // redirect rather than rendering in place: the pages use relative asset
    // paths ("images/..."), which a browser sitting on /for/<code> would
    // resolve to /for/images/... and fail to load.
    return new Response(null, {
      status: 302,
      headers: {
        location: '/',
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
