import papers from '@/public/data/past-papers.json';
import { getSortedArticlesData } from '@/lib/articles';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export function getHomeHtml(template) {
    let html = template;
    for (const subject of ['cs', 'ict', 'language-b']) {
        const count = papers.filter(paper => paper.subject === subject).length;
        html = html.replace(`<!--HOME_COUNT_${subject.toUpperCase()}-->`, `<strong>${count}</strong>`);
    }
    const articles = getSortedArticlesData().slice(0, 2);
    const cards = articles.map(article => {
        const date = new Date(article.date);
        const dateLabel = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
        });
        const art = article.slug === 'k'
            ? '<span>IPv4</span><span>IPv6</span>'
            : '<span>Study<br>notes</span>';
        return `<a class="home-journal-card" href="/articles/${encodeURIComponent(article.slug)}/">
            <div class="home-journal-art" aria-hidden="true">${art}</div>
            <div class="home-journal-copy"><span class="home-tool-label">${escapeHtml(dateLabel)}</span>
                <h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.description)}</p>
                <span class="home-card-action">Read article</span>
            </div>
        </a>`;
    }).join('');
    return html.replace('<!--HOME_JOURNAL-->', cards || '<p class="home-section-description">New study notes will appear here.</p>');
}
