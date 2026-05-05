export const prerender = false;

import type { APIRoute } from 'astro';
import { ghGetFile, ghPutText } from '@utils/github';

const CONFIG_PATH = 'src/data/site-config.json';

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      result[key] = deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>);
    } else {
      result[key] = sv;
    }
  }
  return result;
}

function checkAuth(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  return cookie.includes('amg-admin-auth=pogacar-es-mi-dios');
}

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function serverError(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) return unauthorized();
  try {
    const file = await ghGetFile(CONFIG_PATH);
    if (!file) return serverError('site-config.json no encontrado');
    return new Response(file.content, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : 'Error reading config');
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) return unauthorized();
  try {
    const body = await request.json();
    const existingFile = await ghGetFile(CONFIG_PATH);
    if (!existingFile) return serverError('site-config.json no encontrado');
    const existing = JSON.parse(existingFile.content);
    const updated = deepMerge(existing, body);
    await ghPutText(CONFIG_PATH, JSON.stringify(updated, null, 2), 'admin: update site config');
    return new Response(JSON.stringify({ success: true, config: updated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : 'Error updating config');
  }
};
