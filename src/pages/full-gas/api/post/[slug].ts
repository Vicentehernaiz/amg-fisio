export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = join(process.cwd(), 'src/content/blog');

function checkAuth(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  return cookie.includes('amg-admin-auth=pogacar-es-my-dios');
}

export const GET: APIRoute = async ({ request, params }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { slug } = params;
  const filePath = join(POSTS_DIR, `${slug}.md`);
  if (!existsSync(filePath)) {
    return new Response(JSON.stringify({ error: 'Post not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const content = readFileSync(filePath, 'utf-8');
  return new Response(JSON.stringify({ slug, content }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ request, params }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { slug } = params;
  const filePath = join(POSTS_DIR, `${slug}.md`);
  try {
    const { content } = await request.json();
    writeFileSync(filePath, content, 'utf-8');
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error updating post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { slug } = params;
  const filePath = join(POSTS_DIR, `${slug}.md`);
  try {
    if (existsSync(filePath)) unlinkSync(filePath);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error deleting post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
