import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { getSortedArticlesData } from '@/lib/articles';

export const dynamic = 'force-static';

export default async function ArticlesPage() {
    const allArticlesData = getSortedArticlesData();

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
            <Navbar />

            <main style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '40px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="anim-up">
                    <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                        Articles & Updates
                    </h1>
                    <p style={{ fontSize: 15, color: 'var(--text-faint)', fontFamily: "'Inter',sans-serif" }}>
                        Guides, announcements, and study tips.
                    </p>
                </div>

                <div className="anim-in" style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                    {allArticlesData.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', border: '1.5px dashed var(--border)', borderRadius: 12 }}>
                            <p style={{ fontSize: 14, color: 'var(--text-faint)', fontFamily: "'Inter',sans-serif" }}>
                                No articles yet. Add a Markdown file to <code>content/articles/</code> to publish your first post!
                            </p>
                        </div>
                    ) : (
                        allArticlesData.map(({ slug, date, title, description }) => (
                            <Link href={`/articles/${slug}`} key={slug} style={{ textDecoration: 'none' }}>
                                <article style={{
                                    padding: '24px', borderRadius: 16, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                                    boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', cursor: 'pointer'
                                }} className="article-card">
                                    <style>{`
                                        .article-card:hover {
                                            transform: translateY(-2px);
                                            border-color: var(--accent);
                                            box-shadow: var(--shadow-md);
                                        }
                                    `}</style>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', fontFamily: "'Inter',sans-serif", marginBottom: 8 }}>
                                        {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                                        {title}
                                    </h2>
                                    {description && (
                                        <p style={{ fontSize: 15, color: 'var(--text-muted)', fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }}>
                                            {description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 600, fontFamily: "'Inter',sans-serif", marginTop: 16 }}>
                                        Read Article <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </div>
                                </article>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
