import Script from 'next/script';
import pages from '@/lib/design-pages.json';
import { getHomeHtml } from '@/lib/home-content';

// These templates are local, reviewed design assets. No request data is injected.
export default function DesignPage({ page }) {
    const template = pages[page];
    if (!template) throw new Error(`Unknown design page: ${page}`);
    return <>
        <div id="site-root" data-page={template.kind} dangerouslySetInnerHTML={{ __html: page === 'home' ? getHomeHtml(template.html) : template.html }} />
        <Script src={page === 'home' ? '/script.js' : '/app.js'} strategy="afterInteractive" />
    </>;
}

export function DesignFrame({ children, page = 'journal' }) {
    const template = pages.articles.html;
    const header = template.slice(0, template.indexOf('<main'));
    const footer = template.slice(template.lastIndexOf('<footer'));
    return <div id="site-root" data-page={page}>
        <div className="frame-fragment" dangerouslySetInnerHTML={{ __html: page === 'not-found' ? header.replace(/ aria-current="page"/g, '') : header }} />
        {children}
        <div className="frame-fragment" dangerouslySetInnerHTML={{ __html: footer }} />
        <Script src="/app.js" strategy="afterInteractive" />
    </div>;
}
