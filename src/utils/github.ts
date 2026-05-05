const OWNER = 'Vicentehernaiz';
const REPO = 'amg-fisio';
const BRANCH = 'main';
const API = 'https://api.github.com';

function authHeaders() {
  const token = import.meta.env.BLOG_GITHUB_TOKEN;
  if (!token) {
    throw new Error('BLOG_GITHUB_TOKEN no configurado en variables de entorno');
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function utf8ToBase64(text: string): string {
  return Buffer.from(text, 'utf-8').toString('base64');
}

function base64ToUtf8(b64: string): string {
  return Buffer.from(b64, 'base64').toString('utf-8');
}

export interface GhFile {
  content: string;
  sha: string;
}

export interface GhDirEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
}

export async function ghGetFile(path: string): Promise<GhFile | null> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub get ${path}: ${res.status} ${await res.text()}`);
  const json = await res.json();
  if (Array.isArray(json)) throw new Error(`${path} es un directorio, no un fichero`);
  return {
    content: base64ToUtf8(json.content.replace(/\n/g, '')),
    sha: json.sha,
  };
}

export async function ghListDir(path: string): Promise<GhDirEntry[]> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list ${path}: ${res.status} ${await res.text()}`);
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error(`${path} no es un directorio`);
  return json.map((e: any) => ({ name: e.name, path: e.path, type: e.type, sha: e.sha }));
}

export async function ghPutText(path: string, text: string, message: string): Promise<void> {
  return ghPutBase64(path, utf8ToBase64(text), message);
}

export async function ghPutBase64(path: string, contentBase64: string, message: string): Promise<void> {
  const existing = await ghGetFile(path).catch(() => null);
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  const body: Record<string, unknown> = {
    message,
    content: contentBase64,
    branch: BRANCH,
  };
  if (existing) body.sha = existing.sha;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub put ${path}: ${res.status} ${await res.text()}`);
}

export async function ghDeleteFile(path: string, message: string): Promise<void> {
  const existing = await ghGetFile(path);
  if (!existing) return;
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha: existing.sha, branch: BRANCH }),
  });
  if (!res.ok) throw new Error(`GitHub delete ${path}: ${res.status} ${await res.text()}`);
}
