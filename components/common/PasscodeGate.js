'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'igcse-vault-access';
// Routes that don't require a passcode
const PUBLIC_PATHS = ['/'];

export default function PasscodeGate({ children }) {
    const pathname = usePathname();
    const isPublic = PUBLIC_PATHS.includes(pathname);

    const [verified, setVerified] = useState(false);
    const [checking, setChecking] = useState(true);
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const [showPw, setShowPw] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem(SESSION_KEY) === '1') setVerified(true);
        setChecking(false);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/verify-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode: input }),
            });
            const json = await res.json();
            if (json.ok) {
                sessionStorage.setItem(SESSION_KEY, '1');
                setVerified(true);
            } else {
                setError('Incorrect passcode. Try again.');
                setShake(true);
                setInput('');
                setTimeout(() => setShake(false), 600);
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [input]);

    // Public page — show without gate
    if (isPublic) return children;

    // Still checking sessionStorage
    if (checking) return null;

    // Already verified
    if (verified) return children;

    // Show gate
    return (
        <div style={{
            minHeight: '100dvh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--bg)', padding: '24px 16px',
        }}>
            <div className="anim-up" style={{
                width: '100%', maxWidth: 380,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 20, padding: '40px 32px 36px',
                boxShadow: 'var(--shadow-lg)',
                animation: shake ? 'shakeX 0.5s ease' : undefined,
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
                        background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(79,70,229,0.35)',
                    }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                        IGCSE Vault
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--text-faint)', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                        Enter the passcode to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            autoFocus
                            type={showPw ? 'text' : 'password'}
                            value={input}
                            onChange={e => { setInput(e.target.value); setError(''); }}
                            placeholder="Enter passcode…"
                            style={{
                                width: '100%', padding: '13px 44px 13px 16px', borderRadius: 12,
                                border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
                                backgroundColor: 'var(--bg-input)', fontSize: 15,
                                fontFamily: "'Inter', sans-serif", color: 'var(--text)',
                                outline: 'none', letterSpacing: showPw ? 'normal' : '0.15em',
                                transition: 'border-color 0.15s',
                                boxShadow: error ? '0 0 0 3px rgba(220,38,38,0.1)' : 'none',
                            }}
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)} tabIndex={-1}
                            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: 4, display: 'flex' }}>
                            {showPw
                                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            }
                        </button>
                    </div>

                    {error && (
                        <p style={{ fontSize: 12, color: 'var(--red)', fontFamily: "'Inter', sans-serif", margin: '-4px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading || !input.trim()} style={{
                        padding: '13px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white',
                        fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                        cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                        opacity: loading || !input.trim() ? 0.7 : 1,
                        boxShadow: '0 2px 12px rgba(79,70,229,0.35)', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                        {loading && <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white' }} className="spin" />}
                        {loading ? 'Verifying…' : 'Enter Vault'}
                    </button>
                </form>
            </div>

            <p style={{ marginTop: 24, fontSize: 12, color: 'var(--text-faint)', fontFamily: "'Inter', sans-serif" }}>
                IGCSE Vault &copy; {new Date().getFullYear()}
            </p>

            <style>{`
        @keyframes shakeX {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
      `}</style>
        </div>
    );
}
