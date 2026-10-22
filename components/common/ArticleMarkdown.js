import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ArticleTable({ node, ...props }) {
    return <div className="article-table-scroll" role="region" aria-label="Article table" tabIndex={0}>
        <table {...props} />
    </div>;
}

export default function ArticleMarkdown({ children }) {
    return <div className="article-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ table: ArticleTable }}>{children}</ReactMarkdown>
    </div>;
}
