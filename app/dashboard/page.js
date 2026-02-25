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
    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 py-12 relative z-10">

                {/* Hero Section */}
                <div className="relative text-center mb-16 animate-fade-in py-8 sm:py-12 border-b border-[var(--border)] border-dashed">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-semibold text-[var(--accent)] tracking-wide shadow-sm">
                        <span>📚</span> Exam Resources
                    </div>
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain shadow-sm" />
                        <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-[var(--text)] tracking-tight">
                            Past Papers
                        </h1>
                    </div>
                    <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                        Curated Edexcel IGCSE past papers, mark schemes, examiner reports and more — all in one place.
                    </p>
                </div>

                {/* Subject cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 relative z-10">
                    {SUBJECTS.map((s, i) => (
                        <div key={s.slug}>
                            <SubjectCard subject={s} index={i} />
                        </div>
                    ))}
                </div>

                {/* Info row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up anim-delay-3">
                    <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] flex items-start gap-4 transition-all hover:border-[var(--accent)] hover:shadow-paper-hover">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 text-xl">
                            🔍
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[var(--text)] mb-2 uppercase tracking-wide">Search & Filter</div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                Filter by year, session, or paper type inside each subject.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] flex items-start gap-4 transition-all hover:border-[var(--accent)] hover:shadow-paper-hover">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 text-xl">
                            📥
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[var(--text)] mb-2 uppercase tracking-wide">Instant Download</div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                Click any file to download PDFs directly — no sign-up needed.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] flex items-start gap-4 transition-all hover:border-[var(--accent)] hover:shadow-paper-hover">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-xl">
                            📬
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[var(--text)] mb-2 uppercase tracking-wide">Need Help?</div>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                Join the{' '}
                                <a href="https://t.me/learncswithkee" target="_blank" rel="noreferrer"
                                    className="text-[var(--accent)] font-semibold hover:underline">
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
