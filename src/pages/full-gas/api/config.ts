export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CONFIG_PATH = join(process.cwd(), 'src/data/site-config.json');

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
  return cookie.includes('amg-admin-auth=pogacar-es-my-dios');
}

export const GET: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
    return new Response(JSON.stringify(config), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error reading config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const body = await request.json();
    const existing = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
    const updated = deepMerge(existing, body);
    writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    return new Response(JSON.stringify({ success: true, config: updated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error updating config' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
