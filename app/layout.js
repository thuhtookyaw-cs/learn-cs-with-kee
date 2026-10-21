import './globals.css';
import './refined.css';
import './playground.css';

export const metadata = {
    title: { default: 'Learn CS with Kee', template: '%s — Learn CS with Kee' },
    description: 'Clearer concepts. More confident learners. Personal Edexcel IGCSE Computer Science and ICT tutoring, past papers, and interactive practice with Kee.',
};

export default function RootLayout({ children }) {
    return <html lang="en"><body>{children}</body></html>;
}
