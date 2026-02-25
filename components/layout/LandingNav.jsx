'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';

export default function LandingNav() {
    const [scrolled, setScrolled] = useState(false);
    const [dark, setDark] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const stored = localStorage.getItem('igcse-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored ? stored === 'dark' : prefersDark;
        setDark(isDark);
        document.documentElement.classList.toggle('dark', isDark);

        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler, { passive: true });

        // Scroll spy
        const observers = [];
        const sections = ['about', 'services', 'contact'];

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const obs = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    },
                    { rootMargin: '-30% 0px -70% 0px' }
                );
                obs.observe(el);
                observers.push(obs);
            }
        });

        return () => {
            window.removeEventListener('scroll', handler);
            observers.forEach(obs => obs.disconnect());
        };
    }, []);

    const toggleTheme = () => {
        setDark(d => {
            const next = !d;
            document.documentElement.classList.toggle('dark', next);
            localStorage.setItem('igcse-theme', next ? 'dark' : 'light');
            return next;
        });
    };

    const navAnimation = {
        hidden: { y: -20, opacity: 0 },
        show: {
            y: 0, opacity: 1,
            transition: { staggerChildren: 0.1, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }
        }
    };
    const itemAnimation = {
        hidden: { y: -10, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <LazyMotion features={domAnimation}>
            <m.header
                variants={navAnimation} initial="hidden" animate="show"
                style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px', height: 60,
                    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    backgroundColor: scrolled ? 'color-mix(in srgb, var(--bg) 92%, transparent)' : 'transparent',
                    transition: 'background-color 0.3s, border-color 0.3s',
                }}>
                <m.div variants={itemAnimation} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Image src="/logo.png" alt="Logo" width={28} height={28} style={{ borderRadius: 6, objectFit: 'contain' }} priority />
                    <span style={{ fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text)', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 16 }}>Learn</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>CS</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 14, color: 'var(--text-muted)' }}>with</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: 'var(--accent)', fontStyle: 'italic', paddingLeft: '2px' }}>Kee</span>
                    </span>
                </m.div>

                <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {[['#about', 'About'], ['#services', 'Services'], ['#contact', 'Contact']].map(([h, l]) => {
                        // For hash links, isActive depends on the activeSection (from scroll spy)
                        const isActive = activeSection === h.slice(1);
                        return (
                            <m.a variants={itemAnimation} key={h} href={h}
                                className="relative px-2.5 py-1.5 no-underline hidden md:block"
                            >
                                <span className="relative z-10 text-[13px] font-sans transition-colors duration-200" style={{
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? 'var(--text)' : 'var(--text-muted)'
                                }}>
                                    {l}
                                </span>
                                {isActive && (
                                    <m.div
                                        layoutId="landingnav-active-hash"
                                        className="absolute inset-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg z-0"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </m.a>
                        );
                    })}
                    <m.div variants={itemAnimation} className="hidden md:flex gap-1.5 items-center">
                        {[
                            { href: '/articles', label: 'Blog' },
                            { href: '/store', label: 'Store' }
                        ].map(({ href, label }) => {
                            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
                            return (
                                <Link key={href} href={href} className="relative px-2.5 py-1.5 no-underline">
                                    <span className="relative z-10 text-[13px] font-sans transition-colors duration-200" style={{
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? 'var(--text)' : 'var(--text-muted)'
                                    }}>
                                        {label}
                                    </span>
                                    {isActive && (
                                        <m.div
                                            layoutId="landingnav-active"
                                            className="absolute inset-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg z-0"
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        <Link href="/dashboard" className="hidden md:inline-flex items-center gap-1.5 ml-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[12px] font-semibold font-sans text-[var(--text)] no-underline transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_var(--accent-soft)]">
                            📝 Past Papers
                        </Link>
                    </m.div>
                    <m.button variants={itemAnimation} onClick={toggleTheme} aria-label="Toggle theme" style={{
                        width: 34, height: 34, borderRadius: '50%',
                        border: '1px solid var(--border)', background: 'var(--bg-card)',
                        color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        {dark
                            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        }
                    </m.button>
                    {/* Hamburger Button for Mobile */}
                    <m.button variants={itemAnimation} onClick={() => setIsMobileOpen(v => !v)} aria-label="Toggle mobile menu" className="md:hidden flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] cursor-pointer transition-all duration-150 hover:text-[var(--text)]">
                        {isMobileOpen ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        )}
                    </m.button>
                </nav>
            </m.header>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden fixed top-[60px] left-0 right-0 z-40 bg-[var(--bg)] border-b border-[var(--border)] shadow-md p-4 flex flex-col gap-2"
                        // To allow backdrop blur matching nav:
                        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', backgroundColor: 'color-mix(in srgb, var(--bg) 95%, transparent)' }}
                    >
                        {[['#about', 'About'], ['#services', 'Services'], ['#contact', 'Contact']].map(([h, l]) => (
                            <a key={h} href={h} onClick={() => setIsMobileOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text)] font-medium text-sm transition-colors border border-transparent hover:border-[var(--border)]">
                                {l}
                            </a>
                        ))}
                        {[
                            { href: '/articles', label: 'Blog' },
                            { href: '/store', label: 'Store' },
                            { href: '/dashboard', label: 'Past Papers' },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href} onClick={() => setIsMobileOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[var(--bg-card)] text-[var(--text)] font-medium text-sm transition-colors border border-transparent hover:border-[var(--border)]">
                                {label}
                            </Link>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
}
