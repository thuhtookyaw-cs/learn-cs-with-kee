import { DesignFrame } from '@/components/common/DesignPage';
import { getSortedArticlesData } from '@/lib/articles';
export const metadata = { title: 'The journal' };
export default function ArticlesPage() {
    const articles = getSortedArticlesData();
    return <DesignFrame><main id="main" className="inner-main">
        <div className="page-intro shell"><div className="eyebrow">THE JOURNAL</div><h1>Good explanations.<br /><em>Worth keeping.</em></h1><p>Notes on the ideas behind the syllabus, written to make the complicated feel a little more familiar.</p></div>
        <section className="shell journal-grid"><div className="journal-articles">
            {articles.map(article => <a className="journal-card" href={`/articles/${article.slug}/`} key={article.slug}>
                <div className="journal-art" aria-hidden="true">{article.slug === 'k' ? <><span>IPv4</span><i>→</i><span>IPv6</span><small>32 BITS → 128 BITS</small></> : <><span>Notes.</span><small>ONE IDEA AT A TIME</small></>}</div>
                <div className="journal-card-copy"><div className="eyebrow">{new Date(article.date).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</div><h2>{article.title}</h2><p>{article.description}</p><span className="text-link">Read the article <span>↗</span></span></div>
            </a>)}
            {!articles.length && <div className="empty-state"><h2>A little reading, coming soon.</h2><p>Check back for explanations and study notes from Kee.</p></div>}
        </div><aside className="journal-aside"><span className="big-symbol">✳</span><h2>Keep the curiosity going.</h2><p>Get study tips and updates from Kee in the Telegram channel.</p><a href="https://t.me/learncswithkee" className="button button-outline">Join the conversation ↗</a></aside></section>
    </main></DesignFrame>;
}
