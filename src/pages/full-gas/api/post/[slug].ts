export const prerender = false;

import type { APIRoute } from 'astro';
import { ghGetFile, ghPutText, ghDeleteFile } from '@utils/github';
import { checkAdminAuth } from '@utils/auth';

const POSTS_DIR = 'src/content/blog';

function checkAuth(request: Request): boolean {
  return checkAdminAuth(request);
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

export const GET: APIRoute = async ({ request, params }) => {
  if (!checkAuth(request)) return unauthorized();
  try {
    const { slug } = params;
    const file = await ghGetFile(`${POSTS_DIR}/${slug}.md`);
    if (!file) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ slug, content: file.content }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : 'Error reading post');
  }
};

export const PUT: APIRoute = async ({ request, params }) => {
  if (!checkAuth(request)) return unauthorized();
  try {
    const { slug } = params;
    const { content } = await request.json();
    if (typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'content requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await ghPutText(`${POSTS_DIR}/${slug}.md`, content, `blog: update post "${slug}"`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : 'Error updating post');
  }
};

export const DELETE: APIRoute = async ({ request, params }) => {
  if (!checkAuth(request)) return unauthorized();
  try {
    const { slug } = params;
    await ghDeleteFile(`${POSTS_DIR}/${slug}.md`, `blog: delete post "${slug}"`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : 'Error deleting post');
  }
};
