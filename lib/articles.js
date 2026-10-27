import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Ensure directory exists
if (!fs.existsSync(articlesDirectory)) {
    fs.mkdirSync(articlesDirectory, { recursive: true });
}

/**
 * Get sorted list of all articles
 */
export function getSortedArticlesData({ includeDrafts = false } = {}) {
    const fileNames = fs.readdirSync(articlesDirectory);

    const allArticlesData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            // Remove ".md" from file name to get slug
            const slug = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(articlesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            // Combine the data with the slug
            return {
                slug,
                ...matterResult.data
            };
        });

    // Newest first; keep same-day guides in a predictable subject order.
    const subjectOrder = ['Computer Science', 'ICT', 'English Language B', 'Physics'];
    return allArticlesData.filter(article => includeDrafts || article.draft !== true).sort((a, b) => {
        const byDate = String(b.date).localeCompare(String(a.date));
        if (byDate) return byDate;
        const aSubject = subjectOrder.indexOf(a.subject);
        const bSubject = subjectOrder.indexOf(b.subject);
        const bySubject = (aSubject < 0 ? subjectOrder.length : aSubject) - (bSubject < 0 ? subjectOrder.length : bSubject);
        return bySubject || a.title.localeCompare(b.title);
    });
}

/**
 * Get data for a specific article
 */
export function getArticleData(slug) {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    if (matterResult.data.draft === true) return null;

    // Combine the data with the id and markdown content
    return {
        slug,
        content: matterResult.content,
        ...matterResult.data
    };
}
