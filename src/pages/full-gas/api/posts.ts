export const prerender = false;

import type { APIRoute } from 'astro';
import { ghListDir, ghGetFile, ghPutText } from '@utils/github';
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

function parsePostMeta(content: string, slug: string) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const fm = fmMatch ? fmMatch[1] : '';
  const titleMatch = fm.match(/title:\s*["']?(.+?)["']?\n/);
  const dateMatch = fm.match(/pubDate:\s*(.+)\n/);
  const draftMatch = fm.match(/draft:\s*(.+)\n/);
  const categoryMatch = fm.match(/category:\s*["']?(.+?)["']?\n/);
  const tagsMatch = fm.match(/tags:\s*(\[.*?\])/);
  let tags: string[] = [];
  if (tagsMatch) { try { tags = JSON.parse(tagsMatch[1]); } catch {} }
  return {
    slug,
    title: titleMatch ? titleMatch[1].trim() : slug,
    pubDate: dateMatch ? dateMatch[1].trim() : '',
    draft: draftMatch ? draftMatch[1].trim() === 'true' : false,
    category: categoryMatch ? categoryMatch[1].trim() : '',
    tags,
  };
}

export const GET: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) return unauthorized();
  try {
    const entries = await ghListDir(POSTS_DIR);
    const mdFiles = entries.filter((e) => e.type === 'file' && e.name.endsWith('.md'));
    const posts = await Promise.all(
      mdFiles.map(async (file) => {
        const f = await ghGetFile(file.path);
        return parsePostMeta(f?.content || '', file.name.replace('.md', ''));
      })
    );
    return new Response(JSON.stringify({ posts }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : 'Error reading posts');
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!checkAuth(request)) return unauthorized();
  try {
    const { slug, title, description, content, tags, category } = await request.json();
    if (!slug || !title || !content) {
      return new Response(
        JSON.stringify({ error: 'slug, title y content son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const safeSlug = String(slug).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const today = new Date().toISOString().split('T')[0];
    const frontmatter = `---\ntitle: "${title}"\ndescription: "${description || ''}"\npubDate: ${today}\nauthor: "Alberto Muñoz Gonzalez"\ntags: ${JSON.stringify(tags || [])}\ncategory: "${category || 'consejos'}"\ndraft: false\n---\n\n${content}`;
    await ghPutText(`${POSTS_DIR}/${safeSlug}.md`, frontmatter, `blog: create post "${title}"`);
    return new Response(JSON.stringify({ success: true, slug: safeSlug }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : 'Error creating post');
  }
};
