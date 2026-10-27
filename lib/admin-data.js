import fs from 'node:fs';
import path from 'node:path';
import { getSortedArticlesData } from '@/lib/articles';
import { getStoreProducts } from '@/lib/store';

export const repository = 'thuhtookyaw-cs/learn-cs-with-kee';
export const branch = 'main';

export function articleList() {
  return getSortedArticlesData({ includeDrafts: true }).map(({ slug, title, date, subject, description, draft }) => ({ slug, title, date, subject, description, draft: draft === true }));
}

export function articleSource(slug) {
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  const filename = path.join(process.cwd(), 'content/articles', `${slug}.md`);
  return fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : null;
}

export function storeProducts() {
  return getStoreProducts({ includeDrafts: true });
}

async function githubRequest(filePath, method = 'GET', body) {
  const url = `https://api.github.com/repos/${repository}/contents/${filePath}${method === 'GET' ? `?ref=${branch}` : ''}`;
  const response = await fetch(url, {
    method,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GITHUB_CONTENT_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store'
  });
  if (!response.ok) {
    if (response.status === 404 && method === 'GET') return null;
    throw new Error(`GitHub returned ${response.status}`);
  }
  return response.json();
}

export async function publishFile(filePath, source, message, allowCreate = false) {
  if (!process.env.GITHUB_CONTENT_TOKEN) throw new Error('GitHub publishing is not connected.');
  const existing = await githubRequest(filePath);
  if (!existing && !allowCreate) throw new Error('This file no longer exists in GitHub.');
  const body = { message, content: Buffer.from(source, 'utf8').toString('base64'), branch };
  if (existing?.sha) body.sha = existing.sha;
  return githubRequest(filePath, 'PUT', body);
}

export async function removeFile(filePath, message) {
  if (!process.env.GITHUB_CONTENT_TOKEN) throw new Error('GitHub publishing is not connected.');
  const existing = await githubRequest(filePath);
  if (!existing?.sha) throw new Error('This file no longer exists in GitHub.');
  const url = `https://api.github.com/repos/${repository}/contents/${filePath}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${process.env.GITHUB_CONTENT_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha: existing.sha, branch }), cache: 'no-store'
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
}

function readCount(payload) {
  if (typeof payload === 'number') return payload;
  for (const key of ['count', 'total', 'visits', 'pageviews', 'data']) {
    if (typeof payload?.[key] === 'number') return payload[key];
    if (payload?.[key] && typeof payload[key] === 'object') {
      const nested = readCount(payload[key]);
      if (nested !== null) return nested;
    }
  }
  return null;
}

export async function analyticsOverview() {
  if (!process.env.VERCEL_ANALYTICS_TOKEN) return { state: 'unconnected' };
  const params = new URLSearchParams({ teamId: 'team_Xkk5ZN0ObtlJy1oUXWAn4NxQ', projectId: 'prj_12mVB4aaMHGlHRmFSPW1qDTBysnD' });
  const query = async filter => {
    const url = new URL('https://api.vercel.com/v1/query/web-analytics/visits/count');
    url.search = params.toString();
    if (filter) url.searchParams.set('filter', filter);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${process.env.VERCEL_ANALYTICS_TOKEN}` }, cache: 'no-store' });
    if (!response.ok) throw new Error(`Vercel Analytics returned ${response.status}`);
    return readCount(await response.json());
  };
  try {
    const [all, journal, store, playground] = await Promise.all([
      query(), query("startswith(requestPath, '/articles')"), query("requestPath eq '/store' or requestPath eq '/store/'"), query("startswith(requestPath, '/playground')")
    ]);
    return { state: 'connected', all, journal, store, playground };
  } catch (error) {
    return { state: 'error', message: error.message };
  }
}
