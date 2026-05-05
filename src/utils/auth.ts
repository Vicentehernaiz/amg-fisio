const COOKIE_NAME = 'amg-admin-auth';

export function getAdminPassword(): string | null {
  const pwd = import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
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
