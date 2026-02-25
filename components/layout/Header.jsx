'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

function MoonIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

function SunIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navLinks = [
        { href: '/subject/CS', label: 'Computer Science' },
        { href: '/subject/ICT', label: 'ICT' },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-paper backdrop-blur-md bg-paper/80 transition-colors duration-300" style={{ borderColor: 'var(--border)', backgroundColor: 'color-mix(in srgb, var(--bg) 85%, transparent)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <span className="text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-300">
                            <BookIcon />
                        </span>
                        <span className="font-serif font-bold text-lg text-ink" style={{ color: 'var(--text)' }}>IGCSE Vault</span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden sm:flex items-center gap-1">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60'
                                        }`}
                                    style={{ color: isActive ? undefined : 'var(--text-muted)' }}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Dark mode toggle and Mobile Menu Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            style={{ color: 'var(--text-muted)' }}
                            aria-label="Toggle dark mode"
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>

                        {/* Hamburger Button for Mobile */}
                        <button onClick={() => setIsMobileOpen(v => !v)} aria-label="Toggle mobile menu" className="sm:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700" style={{ color: 'var(--text-muted)' }}>
                            {isMobileOpen ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Dropdown Menu */}
            {isMobileOpen && (
                <div className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-paper/95 dark:bg-[#121212]/95 border-b border-paper backdrop-blur-md p-4 flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
                    {navLinks.map(link => {
                        const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/60'
                                    }`}
                                style={{ color: isActive ? undefined : 'var(--text-muted)' }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    );
}
