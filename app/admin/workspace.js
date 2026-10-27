'use client';

import { useRef, useState } from 'react';

const starter = `---\ntitle: "New study guide"\ndate: "${new Date().toISOString().slice(0, 10)}"\ndescription: "A clear description for students."\nsubject: "Computer Science"\nsubjectHref: "/subject/cs/"\ntype: "worked example"\nvisual: "01 → 02"\ntopic: "TOPIC"\ndraft: true\n---\n\n## The idea\n\nExplain the concept here.\n\n## Try it\n\nAdd a practice question and answer.\n`;

function Metric({ label, value, note }) { return <div className="admin-metric"><span>{label}</span><strong>{value ?? '—'}</strong><small>{note}</small></div>; }

export default function AdminWorkspace({ analytics, articles, initialProducts, publishingReady }) {
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState(initialProducts);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleText, setArticleText] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [keepDraft, setKeepDraft] = useState(true);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const articleRequest = useRef(0);
  const liveArticleCount = articles.filter(article => !article.draft).length;
  const liveProductCount = products.filter(product => product.published !== false).length;

  async function action(payload) {
    setBusy(true); setNotice('');
    try {
      const response = await fetch('/admin/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      setNotice(result.message || 'No response received.');
      return response.ok;
    } catch { setNotice('Could not connect. Try again in a moment.'); return false; }
    finally { setBusy(false); }
  }
  async function editArticle(slug) {
    const requestId = ++articleRequest.current;
    setLoadingArticle(true);
    setTab('articles'); setNotice(''); setSelectedArticle(slug); setArticleSlug(slug);
    setArticleText('Loading article…');
    try {
      const response = await fetch(`/admin/api?article=${encodeURIComponent(slug)}`);
      const result = await response.json();
      if (requestId !== articleRequest.current) return;
      setArticleText(response.ok ? result.source : '');
      const metadata = (result.source || '').match(/^---\s*\n([\s\S]+?)\n---/);
      setKeepDraft(Boolean(metadata && /^draft:\s*true\s*$/m.test(metadata[1])));
      if (!response.ok) setNotice(result.message);
    } catch { if (requestId === articleRequest.current) { setArticleText(''); setNotice('Could not load this article.'); } }
    finally { if (requestId === articleRequest.current) setLoadingArticle(false); }
  }
  function createArticle() { articleRequest.current += 1; setLoadingArticle(false); setKeepDraft(true); setSelectedArticle('new'); setArticleSlug(''); setArticleText(starter); setNotice(''); }
  function updateProduct(index, field, value) {
    setProducts(current => current.map((item, i) => i === index ? { ...item, [field]: field === 'price' || field === 'original' ? Number(value) : value } : item));
  }
  function addProduct() {
    setProducts(current => [...current, { id: `bundle-${Date.now()}`, title: 'New practice bundle', desc: 'Describe what students receive.', price: 0, type: 'paid', art: '01', label: 'NEW BUNDLE', subject: 'Computer Science', code: '4CP0', published: false }]);
  }
  return <div className="admin-app">
    <aside className="admin-sidebar"><a className="admin-brand" href="/"><img src="/kee-logo.png" alt="" width="38" height="38" />Study with Kee</a><span className="admin-side-label">WORKSPACE</span><nav aria-label="Admin sections">
      {[['overview', 'Overview'], ['articles', 'Journal'], ['store', 'Store bundles']].map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setNotice(''); }} type="button">{label}</button>)}
    </nav><div className="admin-side-bottom"><a href="/" target="_blank" rel="noopener">View website</a><form action="/admin/session" method="post"><input type="hidden" name="action" value="logout" /><button type="submit">Sign out</button></form></div></aside>
    <main className="admin-main"><header className="admin-top"><span>Study with Kee <span className="admin-top-divider">/</span> Admin</span><span className="admin-private">Private dashboard</span></header>
      <div className="admin-content">{notice && <div className="admin-notice" role="status">{notice}</div>}
        {tab === 'overview' && <><div className="admin-title"><div><div className="admin-kicker">YOUR SITE AT A GLANCE</div><h1>Overview</h1><p>See which parts of the site students use, then update the content they find there.</p></div><a className="admin-secondary" href="https://vercel.com/thuhtookyaw-cs-projects/learn-cs-with-kee/analytics" target="_blank" rel="noopener">Open full analytics</a></div>
          <section className="admin-panel"><div className="admin-panel-head"><div><h2>Site traffic</h2><p>Visits recorded by Vercel Web Analytics</p></div><span className={`admin-status ${analytics.state === 'connected' ? 'good' : ''}`}>{analytics.state === 'connected' ? 'Connected' : 'Needs setup'}</span></div>
            {analytics.state === 'connected' ? <div className="admin-metrics"><Metric label="All page views" value={analytics.all} note="Since analytics was enabled" /><Metric label="Journal" value={analytics.journal} note="Article pages" /><Metric label="Store" value={analytics.store} note="Store page" /><Metric label="CS Playground" value={analytics.playground} note="Playground pages" /></div> : <div className="admin-empty"><strong>{analytics.state === 'error' ? 'Analytics could not load' : 'Analytics is not connected yet'}</strong><p>{analytics.state === 'error' ? analytics.message : 'Enable Vercel Web Analytics and add a server-side analytics token to see real site traffic here.'}</p></div>}
          </section><div className="admin-overview-grid"><section className="admin-panel"><div className="admin-panel-head"><div><h2>Journal</h2><p>{liveArticleCount} published · {articles.length - liveArticleCount} drafts</p></div><strong className="admin-count">{liveArticleCount}</strong></div><button className="admin-row-button" onClick={() => setTab('articles')}>Manage articles <span>Open</span></button></section><section className="admin-panel"><div className="admin-panel-head"><div><h2>Store</h2><p>{liveProductCount} visible · {products.length - liveProductCount} drafts</p></div><strong className="admin-count">{liveProductCount}</strong></div><button className="admin-row-button" onClick={() => setTab('store')}>Manage bundles <span>Open</span></button></section></div>
          <section className="admin-panel admin-activity"><h2>Student activity</h2><p>Traffic shows which pages are visited. The website does not collect individual student identities or enquiries, so this area reports aggregate activity only.</p><div><a href="/articles/" target="_blank" rel="noopener">View Journal</a><a href="/store/" target="_blank" rel="noopener">View Store</a><a href="/playground/" target="_blank" rel="noopener">View CS Playground</a></div></section>
        </>}
        {tab === 'articles' && <><div className="admin-title"><div><div className="admin-kicker">CONTENT MANAGEMENT</div><h1>Journal</h1><p>Write clear guides and worked examples for your students.</p></div><button className="admin-primary" onClick={createArticle}>New article</button></div><div className="admin-editor-layout"><section className="admin-panel"><div className="admin-panel-head"><h2>Articles &amp; drafts</h2><span className="admin-count">{articles.length}</span></div><div className="admin-list">{articles.map(article => <button key={article.slug} type="button" className={selectedArticle === article.slug ? 'admin-list-row selected' : 'admin-list-row'} onClick={() => editArticle(article.slug)}><span><strong>{article.title}</strong><small>{article.subject} · {article.date}{article.draft ? " · Draft" : ""}</small></span><span>Edit</span></button>)}</div></section><section className="admin-panel admin-editor"><div className="admin-panel-head"><div><h2>{selectedArticle === 'new' ? 'New article' : selectedArticle ? 'Edit article' : 'Choose an article'}</h2><p>Markdown content and article details</p></div></div>{selectedArticle ? <><label>URL name <input value={articleSlug} disabled={selectedArticle !== 'new'} onChange={event => setArticleSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="for-example-trace-tables" /></label><label className="admin-visibility"><input type="checkbox" checked={keepDraft} onChange={event => setKeepDraft(event.target.checked)} /><span>Keep as draft<small>Drafts stay off the public Journal.</small></span></label><label>Article content <textarea value={articleText} onChange={event => setArticleText(event.target.value)} spellCheck={false} disabled={loadingArticle} /></label><div className="admin-editor-actions"><button className="admin-primary" disabled={busy || loadingArticle || !publishingReady || !articleSlug} onClick={() => action({ kind: 'article', slug: articleSlug, source: articleText, draft: keepDraft })}>{keepDraft ? "Save draft" : "Publish article"}</button>{selectedArticle !== 'new' && <button className="admin-danger" disabled={busy || !publishingReady} onClick={async () => { if (window.confirm(`Remove ${articleSlug} from the Journal?`)) await action({ kind: 'delete-article', slug: articleSlug }); }}>Remove</button>}</div></> : <div className="admin-empty"><strong>Your next explanation starts here.</strong><p>Choose an article on the left or create a new one.</p></div>}</section></div></>}
        {tab === 'store' && <><div className="admin-title"><div><div className="admin-kicker">CONTENT MANAGEMENT</div><h1>Store bundles</h1><p>Update the Computer Science practice bundles students see in the Store.</p></div><button className="admin-secondary" onClick={addProduct}>Add bundle</button></div><div className="admin-bundle-list">{products.map((product, index) => <section className="admin-panel admin-bundle" key={product.id}><div className="admin-bundle-top"><div><span className="admin-bundle-index">{String(index + 1).padStart(2, '0')}</span><h2>{product.title}</h2></div><button className="admin-danger" onClick={() => setProducts(current => current.filter((_, i) => i !== index))}>Remove</button></div><label className="admin-visibility"><input type="checkbox" checked={product.published !== false} onChange={event => updateProduct(index, 'published', event.target.checked)} /><span>Visible in Store<small>{product.published === false ? "Draft — hidden from visitors" : "Students can see this bundle"}</small></span></label><div className="admin-form-grid"><label>Title<input value={product.title} onChange={e => updateProduct(index, 'title', e.target.value)} /></label><label>Price in MMK<input type="number" min="0" value={product.price} onChange={e => updateProduct(index, 'price', e.target.value)} /></label><label>Original price in MMK<input type="number" min="0" value={product.original ?? 0} onChange={e => updateProduct(index, 'original', e.target.value)} /></label><label>Type<select value={product.type} onChange={e => updateProduct(index, 'type', e.target.value)}><option value="paid">Paid</option><option value="free">Free sample</option></select></label><label className="wide">Description<textarea value={product.desc} onChange={e => updateProduct(index, 'desc', e.target.value)} /></label></div></section>)}</div><div className="admin-save-bar"><span>{liveProductCount} visible bundles · {products.length - liveProductCount} drafts</span><button className="admin-primary" disabled={busy || !publishingReady} onClick={() => action({ kind: 'products', products })}>Save Store changes</button></div></>}
        {!publishingReady && tab !== 'overview' && <div className="admin-alert">Publishing needs a GitHub content token in the site settings. You can prepare edits here, but saving is disabled until it is connected.</div>}
      </div></main>
  </div>;
}
