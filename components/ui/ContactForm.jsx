'use client';
import { useState } from 'react';
import { TUTOR } from '@/lib/data';

function Stamp({ children, color = '#4F46E5' }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 6,
            border: `1.5px solid ${color}`, color: color,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
        }}>
            {children}
        </span>
    );
}

export default function ContactForm() {
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');

    const tgLink = `https://t.me/${TUTOR.telegramUsername.replace('@', '')}?text=` + encodeURIComponent(
        `Hi Kee!` + (name ? ` I'm ${name}.` : '') + (msg ? `\n\n${msg}` : '')
    );

    return (
        <section id="contact" style={{ padding: '80px 24px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Stamp color="#2AABEE">Get in Touch</Stamp>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: 'var(--text)', marginTop: 14, letterSpacing: '-0.01em' }}>
                        Ready to Get Help?
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", marginTop: 8, fontWeight: 300 }}>
                        Fill in your details below and I'll open Telegram with your message ready.
                    </p>
                </div>

                {/* Smart message form */}
                <div style={{ padding: '28px', borderRadius: 16, border: '1px solid var(--border)', backgroundColor: 'var(--bg)', marginBottom: 24 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <input value={name} onChange={e => setName(e.target.value)}
                            placeholder="Your name (optional)"
                            style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)', fontSize: 14, fontFamily: "'Inter', sans-serif", color: 'var(--text)', outline: 'none' }}
                        />
                        <textarea value={msg} onChange={e => setMsg(e.target.value)}
                            placeholder="What do you need help with? (e.g. algorithms, past papers, exam in May 2025…)"
                            rows={3}
                            style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)', fontSize: 14, fontFamily: "'Inter', sans-serif", color: 'var(--text)', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                        />
                        <a href={tgLink} target="_blank" rel="noreferrer" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                            padding: '15px', borderRadius: 10,
                            background: 'linear-gradient(135deg,#2AABEE,#0088CC)',
                            color: 'white', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15,
                            textDecoration: 'none', boxShadow: '0 4px 20px rgba(42,171,238,0.4)',
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(42,171,238,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(42,171,238,0.4)'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                            Message Me on Telegram
                        </a>
                        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', fontFamily: "'Inter', sans-serif", margin: 0 }}>
                            We'll open Telegram with your message ready · Usually replies within 1 hour
                        </p>
                    </div>
                </div>

                {/* Secondary: Email */}
                <a href={`mailto:${TUTOR.email}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '14px 20px', borderRadius: 12,
                    border: '1px solid var(--border)', backgroundColor: 'var(--bg)',
                    textDecoration: 'none', transition: 'all 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Or email: {TUTOR.email}</span>
                </a>
            </div>
        </section>
    );
}
