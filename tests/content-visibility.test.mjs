import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

test('public readers exclude drafts while admin readers keep them editable', async () => {
    const original = process.cwd();
    const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'kee-content-'));
    const articleModule = pathToFileURL(path.join(original, 'lib/articles.js')).href;
    const storeModule = pathToFileURL(path.join(original, 'lib/store.js')).href;
    try {
        fs.mkdirSync(path.join(fixture, 'content/articles'), { recursive: true });
        for (const [slug, draft] of [['live', false], ['draft', true], ['legacy', undefined]]) {
            const metadata = `title: "${slug}"\ndate: "2026-10-27"\nsubject: "Computer Science"\n${draft === undefined ? '' : `draft: ${draft}\n`}`;
            fs.writeFileSync(path.join(fixture, `content/articles/${slug}.md`), `---\n${metadata}---\n\nArticle text.\n`);
        }
        fs.writeFileSync(path.join(fixture, 'content/store-products.json'), JSON.stringify([
            { id: 'live', published: true }, { id: 'draft', published: false }, { id: 'legacy' },
        ]));
        process.chdir(fixture);
        const articles = await import(articleModule);
        const store = await import(storeModule);
        assert.deepEqual(articles.getSortedArticlesData().map(a => a.slug).sort(), ['legacy', 'live']);
        assert.equal(articles.getArticleData('draft'), null);
        assert.equal(articles.getArticleData('live').title, 'live');
        assert.equal(articles.getSortedArticlesData({ includeDrafts: true }).length, 3);
        assert.deepEqual(store.getStoreProducts().map(p => p.id), ['live', 'legacy']);
        assert.equal(store.getStoreProducts({ includeDrafts: true }).length, 3);
    } finally {
        process.chdir(original);
        fs.rmSync(fixture, { recursive: true, force: true });
    }
});
