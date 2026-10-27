import { DesignFrame } from '@/components/common/DesignPage';

export default function NotFound() {
    return <DesignFrame page="not-found"><main id="main" className="inner-main">
        <section className="page-intro shell not-found-page">
            <div className="eyebrow">PAGE NOT FOUND</div>
            <h1>Let’s find your next step.</h1>
            <p>This page may have moved or is no longer published. Your classes, papers, and practice tools are still here.</p>
            <div className="actions"><a className="button" href="/dashboard/">Find past papers</a><a className="button button-outline" href="/">Back to home</a><a className="text-link" href="/playground/">CS Playground</a></div>
        </section>
    </main></DesignFrame>;
}
