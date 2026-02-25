'use client';
import { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Stamp from '@/components/ui/Stamp';
import Link from 'next/link';

const PLAYGROUND_TOOLS = [
    {
        id: 'python',
        title: 'Python Web Editor',
        desc: 'Write and execute IGCSE Paper 2 algorithms right here in the browser using a real WASM CPython engine.',
        icon: '🐍',
        color: 'from-sky-400 to-blue-500',
        borderColor: 'rgba(56, 189, 248, 0.4)',
        glowColor: 'rgba(56, 189, 248, 0.15)',
        href: '/playground/python',
        status: 'Active',
        colSpan: 'md:col-span-2 lg:col-span-2'
    },
    {
        id: 'logic',
        title: 'Logic Gate Builder',
        desc: 'Drag, drop, and connect logic gates to dynamically test complex truth tables live in your browser.',
        icon: '⚡',
        color: 'from-indigo-400 to-purple-500',
        borderColor: 'rgba(129, 140, 248, 0.4)',
        glowColor: 'rgba(129, 140, 248, 0.15)',
        href: '/playground/logic',
        status: 'Active',
        colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
        id: 'quiz',
        title: 'IGCSE Mini Quiz',
        desc: 'A rapid-fire, randomized 10-question test covering theory and binary math across the syllabus.',
        icon: '🎯',
        color: 'from-rose-500 to-orange-400',
        borderColor: 'rgba(244, 63, 94, 0.4)',
        glowColor: 'rgba(244, 63, 94, 0.15)',
        href: '/playground/quiz',
        status: 'Active',
        colSpan: 'md:col-span-1 lg:col-span-1'
    },
    {
        id: 'binary',
        title: 'Binary Drop Arcade',
        desc: 'Arcade-style decimal-to-binary conversion speed game. Think fast before the bits hit the floor!',
        icon: '👾',
        color: 'from-emerald-400 to-teal-500',
        borderColor: 'rgba(52, 211, 153, 0.4)',
        glowColor: 'rgba(52, 211, 153, 0.15)',
        href: '/playground/binary',
        status: 'Active',
        colSpan: 'md:col-span-2 lg:col-span-2'
    }
];

function PlaygroundCard({ tool, index }) {
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
        <Link href={tool.href} passHref legacyBehavior>
            <motion.a
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24, delay: index * 0.1 }}
                className={`block relative overflow-hidden rounded-[24px] bg-[var(--bg-card)] border border-[var(--border)] transition-all duration-300 no-underline h-full ${tool.colSpan}`}
                style={{
                    boxShadow: hovered ? 'var(--shadow-lift)' : 'var(--shadow-md)',
                    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                    borderColor: hovered ? tool.borderColor : 'var(--border)'
                }}
            >
                {/* Spotlight hover effect */}
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none rounded-[24px]"
                    style={{
                        opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
                        background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${tool.glowColor}, transparent 80%)`,
                    }}
                />

                <div className="p-8 relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${tool.color} text-white shadow-lg transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
                                {tool.icon}
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-full text-[var(--text-muted)] uppercase tracking-wide">
                                {tool.status}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-3 text-[var(--text)] font-sans">
                            {tool.title}
                        </h3>
                        <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                            {tool.desc}
                        </p>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <div className={`w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center transition-all ${hovered ? 'bg-[var(--text)] text-[var(--bg)] border-transparent scale-110' : 'text-[var(--text-muted)]'}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                </div>
            </motion.a>
        </Link>
    );
}

export default function PlaygroundPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-24 pb-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20 relative animate-fade-in py-8 border-b border-[var(--border)] border-dashed"
                >
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-semibold text-purple-400 tracking-wide shadow-sm">
                        <span>🚀</span> Interactive Tools
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <h1 className="text-4xl md:text-6xl font-serif font-extrabold tracking-tight text-[var(--text)]">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Playground</span>
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                        Master IGCSE Computer Science through gamified learning. Test your binary math, build logic circuits, and write actual Python code directly in your browser.
                    </p>
                </motion.div>

                {/* Bento Box Grid Setup */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PLAYGROUND_TOOLS.map((tool, index) => (
                        <PlaygroundCard key={tool.id} tool={tool} index={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}
