export const prerender = false;

import type { APIRoute } from 'astro';
import { ghPutBase64 } from '@utils/github';
import { checkAdminAuth } from '@utils/auth';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB safety bound for the GitHub Contents API
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!checkAdminAuth(request)) return unauthorized();
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slug = formData.get('slug');

    if (!(file instanceof File)) return bad('Falta el archivo');
    if (typeof slug !== 'string' || !slug.trim()) return bad('Falta el slug del post');
    if (file.size > MAX_BYTES) return bad('Imagen demasiado grande (máx 4 MB)');

    const ext = (file.name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!ALLOWED_EXT.has(ext)) return bad(`Extensión no permitida: ${ext || '(vacía)'}`);

    const safeSlug = slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const safeBase = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9-]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
      .slice(0, 40) || 'image';
    const timestamp = Date.now();
    const fileName = `${timestamp}-${safeBase}.${ext}`;
    const path = `public/images/blog/${safeSlug}/${fileName}`;

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    await ghPutBase64(path, base64, `blog: upload image for "${safeSlug}"`);

    const publicUrl = `/images/blog/${safeSlug}/${fileName}`;
    return new Response(JSON.stringify({ url: publicUrl, fileName }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return bad(e instanceof Error ? e.message : 'Error en la subida', 500);
  }
};
