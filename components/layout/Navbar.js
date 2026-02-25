'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';



const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/articles', label: 'Blog' },
    { href: '/store', label: 'Store' },
    { href: '/dashboard', label: 'Past Papers' },
];

export default function Navbar() {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('igcse-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored ? stored === 'dark' : prefersDark;
        setDark(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    const toggleTheme = () => {
        setDark(d => {
            const next = !d;
            document.documentElement.classList.toggle('dark', next);
            localStorage.setItem('igcse-theme', next ? 'dark' : 'light');
            return next;
        });
    };

    return (
        <>
            <header style={{
                position: 'sticky', top: 0, zIndex: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 24px', height: 58,
                borderBottom: '1px solid var(--border)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                backgroundColor: 'color-mix(in srgb, var(--bg) 88%, transparent)',
            }}>
                {/* Logo */}
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
                    <Image src="/logo.png" alt="Logo" width={28} height={28} style={{ borderRadius: 6, objectFit: 'contain' }} priority />
                    <span style={{ fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text)', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 16 }}>Learn</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>CS</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 14, color: 'var(--text-muted)' }}>with</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: 'var(--accent)', fontStyle: 'italic', paddingLeft: '2px' }}>Kee</span>
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Nav Links */}
                    <nav className="hidden sm:flex items-center gap-1.5">
                        {NAV_LINKS.map(({ href, label }) => {
                            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
                            return (
                                <Link key={href} href={href} style={{ position: 'relative', padding: '6px 12px', textDecoration: 'none' }}>
                                    <span style={{
                                        position: 'relative', zIndex: 2,
                                        fontSize: 14, fontWeight: isActive ? 600 : 500, fontFamily: "'Inter', sans-serif",
                                        color: isActive ? 'var(--text)' : 'var(--text-muted)',
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            style={{
                                                position: 'absolute', inset: 0,
                                                backgroundColor: 'var(--bg-card)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 8, zIndex: 1
                                            }}
                                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Theme toggle */}
                    {mounted && (
                        <button onClick={toggleTheme} aria-label="Toggle theme" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 34, height: 34, borderRadius: '50%',
                            border: '1px solid var(--border)', background: 'var(--bg-card)',
                            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                            <AnimatePresence mode="wait">
                                {dark ? (
                                    <motion.svg key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </motion.svg>
                                ) : (
                                    <motion.svg key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                        </button>
                    )}

                    {/* Hamburger Button for Mobile */}
                    <button onClick={() => setIsMobileOpen(v => !v)} aria-label="Toggle mobile menu" className="sm:hidden flex items-center justify-center w-[34px] h-[34px] rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] cursor-pointer transition-all hover:text-[var(--text)]">
                        {isMobileOpen ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="sm:hidden fixed top-[58px] left-0 right-0 z-40 bg-[var(--bg)] border-b border-[var(--border)] shadow-md p-4 flex flex-col gap-2"
                        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', backgroundColor: 'color-mix(in srgb, var(--bg) 95%, transparent)' }}
                    >
                        {NAV_LINKS.map(({ href, label }) => {
                            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
                            return (
                                <Link key={href} href={href} onClick={() => setIsMobileOpen(false)} className={`px-4 py-3 rounded-xl font-medium text-sm transition-colors border ${isActive ? 'bg-[var(--bg-card)] text-[var(--text)] border-[var(--border)]' : 'text-[var(--text-muted)] border-transparent hover:bg-[var(--bg-card)] hover:text-[var(--text)] hover:border-[var(--border)]'}`}>
                                    {label}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
