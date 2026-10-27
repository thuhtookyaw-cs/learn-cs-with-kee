import { getSortedArticlesData } from '@/lib/articles';

const base = 'https://learn-cs-with-kee.vercel.app';

export default function sitemap() {
    const pages = ['', '/dashboard', '/subject/cs', '/subject/ict', '/subject/language-b', '/subject/physics', '/articles', '/store', '/playground', '/playground/python', '/playground/logic', '/playground/quiz', '/playground/binary'];
    return [
        ...pages.map(path => ({ url: base + path, changeFrequency: 'weekly', priority: path === '' ? 1 : .7 })),
        ...getSortedArticlesData().map(article => ({ url: `${base}/articles/${article.slug}`, lastModified: article.date, changeFrequency: 'monthly', priority: .6 })),
    ];
}
