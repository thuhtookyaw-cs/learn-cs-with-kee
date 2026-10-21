import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { isAdminRequest, sameOrigin } from '@/lib/admin-auth';
import { articleSource, publishFile, removeFile, storeProducts } from '@/lib/admin-data';

export const runtime = 'nodejs';

function reply(message, status = 200) { return NextResponse.json({ message }, { status }); }
function validSlug(value) { return typeof value === 'string' && /^[a-z0-9-]{1,80}$/.test(value); }
function validProduct(product) {
  return product && typeof product === 'object' &&
    ['id', 'title', 'desc', 'type', 'art', 'label', 'subject', 'code'].every(key => typeof product[key] === 'string' && product[key].length > 0 && product[key].length <= 500) &&
    /^[a-z0-9-]{1,60}$/.test(product.id) && product.subject === 'Computer Science' && product.code === '4CP0' && ['free', 'paid'].includes(product.type) &&
    Number.isInteger(product.price) && product.price >= 0 && product.price <= 100000000 &&
    (product.original === undefined || (Number.isInteger(product.original) && product.original >= 0 && product.original <= 100000000));
}

export async function POST(request) {
  if (!isAdminRequest(request)) return reply('Please sign in again.', 401);
  if (!sameOrigin(request)) return reply('Invalid origin.', 403);
  let data;
  try { data = await request.json(); } catch { return reply('Invalid request.', 400); }
  try {
    if (data.kind === 'article') {
      const { slug, source } = data;
      if (!validSlug(slug) || typeof source !== 'string' || source.length > 100000 || !/^---\s*\n[\s\S]+?\n---\s*\n/.test(source)) return reply('Use a valid URL name and a Markdown article with front matter.', 400);
      const metadata = matter(source).data;
      if (typeof metadata.title !== 'string' || !metadata.title.trim() || typeof metadata.description !== 'string' || !metadata.description.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(String(metadata.date)) || !['Computer Science', 'ICT', 'English Language B', 'Physics'].includes(metadata.subject)) return reply('Article needs a title, date, description, and valid subject.', 400);
      await publishFile(`content/articles/${slug}.md`, source, `Update journal article: ${slug}`, true);
      return reply('Article sent to GitHub. It will appear after the next deployment.');
    }
    if (data.kind === 'delete-article') {
      if (!validSlug(data.slug)) return reply('Invalid article URL name.', 400);
      await removeFile(`content/articles/${data.slug}.md`, `Remove journal article: ${data.slug}`);
      return reply('Article removal sent to GitHub.');
    }
    if (data.kind === 'products') {
      const products = data.products;
      if (!Array.isArray(products) || products.length > 30 || !products.every(validProduct) || new Set(products.map(item => item.id)).size !== products.length) return reply('Check the bundle details before publishing.', 400);
      await publishFile('public/data/store-products.json', JSON.stringify(products, null, 2) + '\n', 'Update Study with Kee store bundles');
      return reply('Store changes sent to GitHub. They will appear after the next deployment.');
    }
    return reply('Unknown action.', 400);
  } catch (error) { return reply(error.message, 502); }
}

export async function GET(request) {
  if (!isAdminRequest(request)) return reply('Please sign in again.', 401);
  const slug = new URL(request.url).searchParams.get('article');
  if (!validSlug(slug)) return reply('Invalid article URL name.', 400);
  const source = articleSource(slug);
  return source === null ? reply('Article not found.', 404) : NextResponse.json({ source });
}
