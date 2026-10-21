import { notFound } from 'next/navigation';
import DesignPage from '@/components/common/DesignPage';

export function generateStaticParams() { return [{ slug: 'cs' }, { slug: 'ict' }]; }
export async function generateMetadata({ params }) {
    const { slug } = await params;
    return { title: slug.toLowerCase() === 'ict' ? 'ICT resources' : 'Computer Science resources' };
}
export default async function SubjectPage({ params }) {
    const { slug } = await params;
    const subject = slug.toLowerCase();
    if (!['cs', 'ict'].includes(subject)) notFound();
    return <DesignPage page={`subject/${subject}`} />;
}
