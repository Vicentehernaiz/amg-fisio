// TEMPORARY diagnostic endpoint. Remove once /full-gas login is confirmed
// working in production. Returns env var names (NOT values) so we can
// debug why ADMIN_PASSWORD isn't visible to the function.
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const allKeys = Object.keys(process.env || {});
  const suspicious = allKeys.filter((k) => /pass|admin|github|booking|token/i.test(k));
  const adminPwd = process.env.ADMIN_PASSWORD;
  const ghToken = process.env.BLOG_GITHUB_TOKEN;
  return new Response(
    JSON.stringify({
      runtimeNote: 'process.env keys visible to this serverless function',
      adminPasswordPresent: typeof adminPwd === 'string' && adminPwd.length > 0,
      adminPasswordLength: typeof adminPwd === 'string' ? adminPwd.length : 0,
      blogGithubTokenPresent: typeof ghToken === 'string' && ghToken.length > 0,
      blogGithubTokenLength: typeof ghToken === 'string' ? ghToken.length : 0,
      totalEnvKeys: allKeys.length,
      relatedKeys: suspicious.sort(),
    }, null, 2),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
