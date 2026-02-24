'use client';
import { useState, useEffect } from 'react';
import { TUTOR } from '@/lib/data';

export default function FloatingWhatsApp() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
    }, []);

    return (
        <a href={TUTOR.telegram} target="_blank" rel="noreferrer"
            style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 100,
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '13px 20px', borderRadius: 100,
                background: 'linear-gradient(135deg,#2AABEE,#0088CC)',
                color: 'white', textDecoration: 'none',
                boxShadow: '0 6px 28px rgba(42,171,238,0.5)',
                fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13,
                opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.4s, transform 0.4s, box-shadow 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 36px rgba(42,171,238,0.65)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(42,171,238,0.5)'}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
            Message Me on Telegram
        </a>
    );
}
