import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { DesignFrame } from '@/components/common/DesignPage';
import { getArticleData, getSortedArticlesData } from '@/lib/articles';
export function generateStaticParams() { return getSortedArticlesData().map(article => ({slug:article.slug})); }
export const dynamicParams = false;
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = getArticleData(slug);
    return {title:article?.title || 'Article',description:article?.description};
}
export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const article = getArticleData(slug);
    if (!article) notFound();
    return <DesignFrame page="article"><main id="main" className="inner-main">
        <div className="shell breadcrumbs"><a href="/articles/">Journal</a><span>/</span><span>{article.title}</span></div>
        <div className="article-layout shell"><article className="article-prose"><header><div className="article-meta"><span className="journal-subject">{article.subject || 'Computer Science'}</span><span>{new Date(article.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</span></div><h1>{article.title}</h1>{article.description && <p>{article.description}</p>}</header><ReactMarkdown>{article.content}</ReactMarkdown></article>
        <aside className="article-sidebar"><div className="eyebrow">KEEP PRACTISING</div><h2>Now try it<br />yourself.</h2><p className="small-note">Work through the question before checking the answer. If a step is unclear, Kee can help you with it.</p><a className="text-link" href="/articles/">Back to the journal</a>{article.subjectHref && <a className="text-link" href={article.subjectHref}>Explore {article.subject} papers</a>}<a className="text-link" href="https://t.me/xkxxee">Ask Kee</a></aside></div>
    </main></DesignFrame>;
}
