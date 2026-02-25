'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export default function SubjectCard({ subject, index = 0 }) {
    const [hovered, setHovered] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <Link href={`/subject/${subject.slug}`} passHref legacyBehavior>
            <motion.a
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.1 }}
                style={{
                    display: 'block', textDecoration: 'none',
                    position: 'relative', overflow: 'hidden',
                    borderRadius: 20,
                    border: hovered ? `1px solid ${subject.borderColor}` : '1px solid var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: hovered ? 'var(--shadow-lift)' : 'var(--shadow-md)',
                    transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
                    transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s',
                    padding: '28px 28px 24px',
                }}
            >
                {/* Spotlight hover effect */}
                <motion.div
                    style={{
                        position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none',
                        opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
                        background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${subject.glowColor}, transparent 80%)`,
                    }}
                />

                {/* Subtle paper grain */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none',
                    opacity: 0.03,
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                }} />

                {/* Top row: icon + stamp */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: subject.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 22,
                        boxShadow: hovered ? `0 6px 20px ${subject.glowColor}` : 'var(--shadow-sm)',
                        transition: 'box-shadow 0.22s, transform 0.22s',
                        transform: hovered ? 'scale(1.06)' : 'scale(1)',
                        flexShrink: 0,
                    }}>
                        {subject.icon}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                        <span className="stamp" style={{ color: subject.accentColor, backgroundColor: subject.accentColor + '1A', borderColor: subject.accentColor + '30' }}>
                            {subject.code}
                        </span>
                        {subject.isNew && (
                            <span className="stamp" style={{ color: '#059669', backgroundColor: '#0596691A', borderColor: '#05966930' }}>
                                New
                            </span>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 700, lineHeight: 1.2,
                    color: 'var(--text)', marginBottom: 8,
                }}>
                    {subject.title}
                </h2>

                {/* Description */}
                <p style={{
                    fontSize: 13, fontWeight: 400, lineHeight: 1.6,
                    color: 'var(--text-muted)', marginBottom: 20,
                    fontFamily: "'Inter', sans-serif",
                }}>
                    {subject.description}
                </p>

                {/* Stats row */}
                <div style={{
                    display: 'flex', gap: 16,
                    paddingTop: 16,
                    borderTop: '1px solid var(--border-2)',
                }}>
                    {subject.stats.map(stat => (
                        <div key={stat.label}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: subject.accentColor, fontFamily: "'Inter', sans-serif" }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: "'Inter', sans-serif", marginTop: 1 }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Arrow */}
                <div style={{
                    position: 'absolute', right: 24, bottom: 24,
                    color: hovered ? subject.accentColor : 'var(--text-faint)',
                    transition: 'color 0.2s, transform 0.2s',
                    transform: hovered ? 'translateX(3px)' : 'translateX(0)',
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                </div>
            </motion.a>
        </Link>
    );
}
