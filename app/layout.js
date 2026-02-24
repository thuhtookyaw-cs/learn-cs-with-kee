import './globals.css';
import PasscodeGate from '@/components/common/PasscodeGate';

export const metadata = {
    title: 'Learn CS with Kee',
    description: 'Personalised Edexcel IGCSE Computer Science & ICT tutoring by Kee — A* graduate',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <PasscodeGate>
                    {children}
                </PasscodeGate>
            </body>
        </html>
    );
}
