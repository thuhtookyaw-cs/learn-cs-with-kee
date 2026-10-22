import localFont from 'next/font/local';
import './journal-font.css';

const journalFont = localFont({
    src: './fonts/AJ_04.ttf',
    weight: '400',
    style: 'normal',
    display: 'swap',
    variable: '--font-journal',
    adjustFontFallback: false,
    fallback: ['Myanmar Text', 'Arial'],
});

export default function JournalLayout({ children }) {
    return <div className={`journal-font ${journalFont.variable}`}>{children}</div>;
}
