import './globals.css';
import './refined.css';
import './playground.css';
import './brand-class.css';
import './resources.css';
import './home-hub.css';
import './site-refinements.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
    title: { default: 'Study with Kee', template: '%s — Study with Kee' },
    description: 'Clearer concepts. More confident learners. Edexcel IGCSE Computer Science, ICT, English Language B, and Physics classes, resources, and practice with Kee.',
    icons: { icon: [{ url: '/kee-logo.png', type: 'image/png' }], apple: '/kee-logo.png' },
};

export default function RootLayout({ children }) {
    return <html lang="en"><body>{children}<Analytics /></body></html>;
}
