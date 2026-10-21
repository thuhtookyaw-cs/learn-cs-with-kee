import './globals.css';
import './refined.css';
import './playground.css';
import './brand-class.css';
import './resources.css';

export const metadata = {
    title: { default: 'Learn CS with Kee', template: '%s — Learn CS with Kee' },
    description: 'Clearer concepts. More confident learners. Edexcel IGCSE Computer Science, ICT, and English Language B classes, resources, and practice with Kee.',
    icons: { icon: [{ url: '/kee-logo.png', type: 'image/png' }], apple: '/kee-logo.png' },
};

export default function RootLayout({ children }) {
    return <html lang="en"><body>{children}</body></html>;
}
