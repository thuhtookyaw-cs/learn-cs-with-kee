import { DesignFrame } from '@/components/common/DesignPage';
import { getSortedArticlesData } from '@/lib/articles';
export const metadata = { title: 'The journal' };
export default function ArticlesPage() {
    const articles = getSortedArticlesData();
    return <DesignFrame><main id="main" className="inner-main">
        <div className="page-intro shell"><div className="eyebrow">THE JOURNAL</div><h1>Learn it. Try it.<br /><em>Make it stick.</em></h1><p>Short, worked examples for Computer Science, ICT, English Language B, and Physics. Follow the steps, then try a question yourself.</p></div>
        <section className="shell journal-grid"><div className="journal-articles">
            {articles.map(article => <a className="journal-card" href={`/articles/${article.slug}/`} key={article.slug}>
                <div className="journal-art" aria-hidden="true"><span>{article.visual || 'IPv4 → IPv6'}</span><small>{article.topic || 'COMPUTER SCIENCE'}</small></div>
                <div className="journal-card-copy"><div className="journal-card-meta"><span className="journal-subject">{article.subject || 'Computer Science'}</span><span>{new Date(article.date).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</span></div><h2>{article.title}</h2><p>{article.description}</p><span className="text-link">{article.type === 'worked example' ? 'Work through the example' : 'Read the article'}</span></div>
            </a>)}
            {!articles.length && <div className="empty-state"><h2>A little reading, coming soon.</h2><p>Check back for explanations and study notes from Kee.</p></div>}
        </div><aside className="journal-aside"><h2>Practise by subject.</h2><p>Use the worked examples here, then pick a paper from your class library.</p><div className="journal-subject-links"><a href="/subject/cs/">Computer Science</a><a href="/subject/ict/">ICT</a><a href="/subject/language-b/">English Language B</a><a href="/subject/physics/">Physics</a></div><p>Need help with a step? Bring the question to Kee.</p><a href="https://t.me/xkxxee" className="button button-outline">Ask Kee</a></aside></section>
    </main></DesignFrame>;
}
