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

  // The pretty invite link: /for/acme-k7f2qp9x
  const invite = url.pathname.match(/^\/for\/([^/]+)\/?$/);
  if (invite) {
    const token = decodeURIComponent(invite[1]);
    if (!tokens.includes(token)) return notFound();

    // Render the homepage at this URL rather than redirecting, so the bespoke
    // link stays in the address bar and link-preview crawlers get real HTML.
    const target = new URL('/index.html', url.origin);
    return allow({
      'x-middleware-rewrite': target.toString(),
      'set-cookie': unlockCookie(token),
    });
  }

  // Fallback that also works: ?k=acme-k7f2qp9x on any page.
  const supplied = url.searchParams.get('k');
  if (supplied && tokens.includes(supplied)) {
    return allow({ 'set-cookie': unlockCookie(supplied) });
  }

  // Already unlocked on this device.
  const existing = cookieToken(request);
  if (existing && tokens.includes(existing)) return allow();

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
