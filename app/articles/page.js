import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { getSortedArticlesData } from '@/lib/articles';

export const dynamic = 'force-static';

export default async function ArticlesPage() {
    const allArticlesData = getSortedArticlesData();

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 py-12 relative z-10">
                {/* Hero Section */}
                <div className="relative text-center mb-16 animate-fade-in py-8 sm:py-12 border-b border-[var(--border)] border-dashed">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-semibold text-[var(--accent)] tracking-wide shadow-sm">
                        <span>✍️</span> Latest Updates
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold font-serif mb-6 text-[var(--text)] tracking-tight">
                        Articles & Updates
                    </h1>
                    <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                        Guides, announcements, study tips, and resources for your IGCSE journey.
                    </p>
                </div>

                <div className="w-full">
                    {allArticlesData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 px-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] border-dashed">
                            <div className="w-20 h-20 mb-6 rounded-full bg-[var(--bg-input)] flex items-center justify-center border border-[var(--border)] shadow-sm">
                                <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text)] mb-3">No articles yet</h3>
                            <p className="text-[var(--text-muted)] text-center max-w-md">
                                Add a Markdown file to the <code className="bg-dark-card2 px-2 py-1 rounded text-sm whitespace-nowrap">content/articles/</code> directory to publish your first post!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
                            {allArticlesData.map(({ slug, date, title, description }) => (
                                <Link href={`/articles/${slug}`} key={slug} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-6 transition-all duration-300 hover:shadow-paper-hover hover:-translate-y-1 hover:border-[var(--accent)]">
                                    {/* Ambient Glow */}
                                    <div className="absolute inset-0 h-32 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex-1">
                                        <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4 h-[24px] flex items-center">
                                            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <h2 className="text-2xl font-bold font-serif text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-4 line-clamp-2">
                                            {title}
                                        </h2>
                                        {description && (
                                            <p className="text-[var(--text-muted)] leading-relaxed line-clamp-3 mb-6">
                                                {description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative z-10 mt-auto pt-4 border-t border-[var(--border)] flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                                        Read Article
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
