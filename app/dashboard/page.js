'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import SubjectCard from '@/components/cards/SubjectCard';
import Navbar from '@/components/layout/Navbar';

const SUBJECTS = [
    {
        slug: 'cs',
        title: 'Computer Science',
        code: '4CP0',
        description: 'Past papers, mark schemes, examiner reports and topical questions for Edexcel IGCSE Computer Science.',
        gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        accentColor: '#4F46E5',
        borderColor: 'rgba(79,70,229,0.35)',
        glowColor: 'rgba(79,70,229,0.22)',
        icon: '💻',
        stats: [{ value: '120+', label: 'Papers' }, { value: '2019–2025', label: 'Years' }, { value: '3', label: 'Types' }],
        isNew: false,
    },
    {
        slug: 'ict',
        title: 'ICT',
        code: '4IT1',
        description: 'Complete collection of Edexcel IGCSE ICT resources including past papers, data files and mark schemes.',
        gradient: 'linear-gradient(135deg, #059669, #0D9488)',
        accentColor: '#059669',
        borderColor: 'rgba(5,150,105,0.35)',
        glowColor: 'rgba(5,150,105,0.22)',
        icon: '📡',
        stats: [{ value: '100+', label: 'Papers' }, { value: '2019–2025', label: 'Years' }, { value: '3', label: 'Types' }],
        isNew: false,
    },
];

export default function DashboardPage() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('igcse-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored ? stored === 'dark' : prefersDark;
        setDark(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    const toggleTheme = useCallback(() => {
        setDark(d => {
            const next = !d;
            document.documentElement.classList.toggle('dark', next);
            localStorage.setItem('igcse-theme', next ? 'dark' : 'light');
            return next;
        });
    }, []);

    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
            <Navbar dark={dark} onToggleTheme={toggleTheme} />

            <main style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '48px 20px 80px' }}>
                {/* Back link */}
                <div className="anim-up" style={{ marginBottom: 24 }}>
                    <Link href="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif",
                        textDecoration: 'none', fontWeight: 500,
                        transition: 'color 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        ← Back to home
                    </Link>
                </div>

                {/* Header */}
                <div className="anim-up" style={{ marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <img src="/logo.png" alt="Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain' }} />
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(24px, 5vw, 36px)',
                            fontWeight: 900, letterSpacing: '-0.02em',
                            color: 'var(--text)', margin: 0,
                        }}>
                            Resources
                        </h1>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", fontWeight: 300, maxWidth: 500 }}>
                        Curated Edexcel IGCSE past papers, mark schemes, examiner reports and more — all in one place.
                    </p>
                </div>

                {/* Subject cards grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: 20,
                }}>
                    {SUBJECTS.map((s, i) => (
                        <div key={s.slug} className={`anim-up anim-delay-${i + 1}`}>
                            <SubjectCard subject={s} />
                        </div>
                    ))}
                </div>

                {/* Info row */}
                <div className="anim-up anim-delay-3" style={{
                    marginTop: 36,
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12,
                }}>
                    <div style={{
                        padding: '16px 20px', borderRadius: 12,
                        border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)',
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>🔍</span>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>Search & Filter</div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", lineHeight: 1.5, margin: 0 }}>
                                Filter by year, session, or paper type inside each subject.
                            </p>
                        </div>
                    </div>
                    <div style={{
                        padding: '16px 20px', borderRadius: 12,
                        border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)',
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>📥</span>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>Instant Download</div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", lineHeight: 1.5, margin: 0 }}>
                                Click any file to download PDFs directly — no sign-up needed.
                            </p>
                        </div>
                    </div>
                    <div style={{
                        padding: '16px 20px', borderRadius: 12,
                        border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)',
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>📬</span>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>Need Help?</div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", lineHeight: 1.5, margin: 0 }}>
                                Join the{' '}
                                <a href="https://t.me/learncswithkee" target="_blank" rel="noreferrer"
                                    style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                                    Telegram channel
                                </a>{' '}
                                for tips and updates.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
