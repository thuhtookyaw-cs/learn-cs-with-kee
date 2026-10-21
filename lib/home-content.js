import papers from '@/public/data/past-papers.json';

export function getHomeHtml(template) {
    let html = template;
    for (const subject of ['cs', 'ict', 'language-b']) {
        const count = papers.filter(paper => paper.subject === subject).length;
        html = html.replace(`<!--HOME_COUNT_${subject.toUpperCase()}-->`, `<strong>${count}</strong>`);
    }
    return html;
}
