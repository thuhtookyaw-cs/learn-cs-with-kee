import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Navbar from '@/components/layout/Navbar';
import { getArticleData, getSortedArticlesData } from '@/lib/articles';

// Generate static routes for all articles at build time
export async function generateStaticParams() {
    const articles = getSortedArticlesData();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export const dynamicParams = false; // Return 404 for unknown articles

export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const article = getArticleData(slug);

    if (!article) {
        notFound();
    }

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
            <Navbar />

            {/* Breadcrumb */}
            <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', padding: '16px 20px 0' }}>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: "'Inter',sans-serif", color: 'var(--text-faint)' }}>
                    <Link href="/articles" style={{ color: 'var(--text-faint)', textDecoration: 'none', transition: 'color 0.15s' }} className="hover:text-[var(--text)]">Articles</Link>
                    <span>›</span>
                    <span style={{ color: 'var(--text-muted)' }}>{article.title}</span>
                </nav>
            </div>

            <main style={{ flex: 1, maxWidth: 800, width: '100%', margin: '0 auto', padding: '32px 20px 80px', display: 'flex', flexDirection: 'column' }}>
                <article className="anim-in">
                    {/* Header */}
                    <header style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', fontFamily: "'Inter',sans-serif", marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, marginBottom: 16 }}>
                            {article.title}
                        </h1>
                        {article.description && (
                            <p style={{ fontSize: 18, color: 'var(--text-muted)', fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }}>
                                {article.description}
                            </p>
                        )}
                    </header>

                    {/* Markdown Content rendered via Tailwind Typography */}
                    <div className="prose prose-lg dark:prose-invert max-w-none" style={{ fontFamily: "'Inter',sans-serif" }}>
                        <ReactMarkdown>
                            {article.content}
                        </ReactMarkdown>
                    </div>
                </article>

                {/* Footer Back Link */}
                <div style={{ marginTop: 60, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
                    <Link href="/articles" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12,
                        backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)',
                        textDecoration: 'none', fontSize: 14, fontWeight: 500, fontFamily: "'Inter',sans-serif", transition: 'all 0.15s'
                    }} className="hover:border-[var(--accent)] hover:text-[var(--accent)]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to all articles
                    </Link>
                </div>
            </main>
        </div>
    );
}
