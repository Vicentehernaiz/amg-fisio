const COOKIE_NAME = 'amg-admin-auth';

export function getAdminPassword(): string | null {
  // process.env first because it reflects the live runtime value on Vercel
  // serverless functions; import.meta.env may be inlined at build time and
  // capture an undefined/stale value if the env var was set after the build.
  const fromProc = typeof process !== 'undefined' ? process.env?.ADMIN_PASSWORD : undefined;
  const fromMeta = (import.meta as any)?.env?.ADMIN_PASSWORD;
  const pwd = fromProc ?? fromMeta;
  return typeof pwd === 'string' && pwd.length > 0 ? pwd : null;
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

function parseCookies(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of header.split(/;\s*/)) {
    if (!pair) continue;
    const eq = pair.indexOf('=');
    if (eq < 0) continue;
    out[pair.slice(0, eq).trim()] = pair.slice(eq + 1);
  }
  return out;
}

export function checkAdminAuth(request: Request): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  const header = request.headers.get('cookie') || '';
  const cookies = parseCookies(header);
  return cookies[COOKIE_NAME] === expected;
}
