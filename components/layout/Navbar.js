'use client';
import Link from 'next/link';
import { useState } from 'react';

function BookIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

export default function Navbar({ dark, onToggleTheme }) {
    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: 58,
            borderBottom: '1px solid var(--border)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            backgroundColor: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        }}>
            {/* Logo */}
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
                <BookIcon />
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
                    IGCSE Vault
                </span>
            </Link>

            {/* Theme toggle */}
            {onToggleTheme && (
                <button onClick={onToggleTheme} aria-label="Toggle theme" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 34, height: 34, borderRadius: '50%',
                    border: '1px solid var(--border)', background: 'var(--bg-card)',
                    color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                    {dark ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
            )}
        </header>
    );
}
