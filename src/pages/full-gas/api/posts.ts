export const prerender = false;

import type { APIRoute } from 'astro';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = join(process.cwd(), 'src/content/blog');

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
    const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
    const posts = files.map((file) => {
      const content = readFileSync(join(POSTS_DIR, file), 'utf-8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
      const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\n/);
      const dateMatch = frontmatter.match(/pubDate:\s*(.+)\n/);
      const draftMatch = frontmatter.match(/draft:\s*(.+)\n/);
      const categoryMatch = frontmatter.match(/category:\s*["']?(.+?)["']?\n/);
      const tagsMatch = frontmatter.match(/tags:\s*(\[.*?\])/);
      let tags: string[] = [];
      if (tagsMatch) { try { tags = JSON.parse(tagsMatch[1]); } catch {} }
      return {
        slug: file.replace('.md', ''),
        title: titleMatch ? titleMatch[1].trim() : file,
        pubDate: dateMatch ? dateMatch[1].trim() : '',
        draft: draftMatch ? draftMatch[1].trim() === 'true' : false,
        category: categoryMatch ? categoryMatch[1].trim() : '',
        tags,
      };
    });
    return new Response(JSON.stringify({ posts }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error reading posts' }), {
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
    const { slug, title, description, content, tags, category } = await request.json();
    if (!slug || !title || !content) {
      return new Response(
        JSON.stringify({ error: 'slug, title y content son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const safeSlug = slug.replace(/[^a-z0-9-]/g, '-').toLowerCase();
    const filePath = join(POSTS_DIR, `${safeSlug}.md`);
    const today = new Date().toISOString().split('T')[0];
    const frontmatter = `---\ntitle: "${title}"\ndescription: "${description || ''}"\npubDate: ${today}\nauthor: "Alberto Munoz Gonzalez"\ntags: ${JSON.stringify(tags || [])}\ncategory: "${category || 'consejos'}"\ndraft: false\n---\n\n${content}`;
    writeFileSync(filePath, frontmatter, 'utf-8');
    return new Response(JSON.stringify({ success: true, slug: safeSlug }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error creating post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
