import { notFound } from 'next/navigation';
import DesignPage from '@/components/common/DesignPage';

const subjects = {
    cs: 'Computer Science resources',
    ict: 'ICT resources',
    'language-b': 'English Language B class',
    physics: 'Physics class and past papers',
};

export function generateStaticParams() { return Object.keys(subjects).map(slug => ({ slug })); }
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const subject = slug.toLowerCase();
    if (!Object.hasOwn(subjects, subject)) notFound();
    return {
        title: subjects[subject],
        ...(subject === 'language-b' ? { description: 'Edexcel IGCSE English Language B (4EB1) with Kee. Build reading and writing confidence, explore official resources, and ask about the class.' } : {}),
        ...(subject === 'physics' ? { description: 'Edexcel IGCSE Physics (4PH1) with Kee. Study the concepts, practise calculations, and download past papers with matching mark schemes.' } : {}),
    };
}
export default async function SubjectPage({ params }) {
    const { slug } = await params;
    const subject = slug.toLowerCase();
    if (!Object.hasOwn(subjects, subject)) notFound();
    return <DesignPage page={`subject/${subject}`} />;
}
