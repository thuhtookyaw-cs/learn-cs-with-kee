'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Stamp from '@/components/ui/Stamp';
import Magnetic from '@/components/ui/Magnetic';
import Link from 'next/link';

const PLAYGROUND_TOOLS = [
    {
        id: 'quiz',
        title: 'IGCSE Mini Quiz',
        desc: 'A rapid-fire 5-question test covering theory and binary math.',
        icon: '🎯',
        color: 'from-rose-500 to-orange-400',
        href: '/playground/quiz',
        status: 'Active'
    },
    {
        id: 'binary',
        title: 'Binary Drop Game',
        desc: 'Arcade-style decimal-to-binary conversion speed game.',
        icon: '👾',
        color: 'from-emerald-400 to-teal-500',
        href: '/playground/binary',
        status: 'Active'
    },
    {
        id: 'logic',
        title: 'Logic Gate Builder',
        desc: 'Interact with AND, OR, NOT, and XOR gates to test truth tables live.',
        icon: '⚡',
        color: 'from-indigo-400 to-purple-500',
        href: '/playground/logic',
        status: 'Active'
    },
    {
        id: 'python',
        title: 'Python Web Editor',
        desc: 'Write and execute IGCSE Paper 2 algorithms right here in the browser.',
        icon: '🐍',
        color: 'from-sky-400 to-blue-500',
        href: '/playground/python',
        status: 'Active'
    }
];

export default function PlaygroundPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="mb-6 flex justify-center">
                        <Stamp color="#8B5CF6">Interactive Tools</Stamp>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-extrabold mb-6 tracking-tight text-[var(--text)]">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Playground</span>
                    </h1>
                    <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                        Master IGCSE Computer Science through gamified learning. Test your binary math, build logic circuits, and write actual Python code directly in your browser.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PLAYGROUND_TOOLS.map((tool, i) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Magnetic strength={0.05}>
                                <Link
                                    href={tool.href}
                                    className="block relative overflow-hidden group rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-8 h-full transition-all duration-300 hover:border-transparent hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-left no-underline"
                                >
                                    {/* Hover Gradient Background */}
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${tool.color} transition-opacity duration-300 pointer-events-none`} />

                                    <div className="flex items-start justify-between mb-6 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${tool.color} shadow-lg text-white`}>
                                            {tool.icon}
                                        </div>
                                        {/* Status Badge */}
                                        <span className="text-xs font-semibold px-3 py-1 bg-[var(--bg)] border border-[var(--border)] rounded-full text-[var(--text-muted)]">
                                            {tool.status}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 text-[var(--text)] relative z-10 font-sans">
                                        {tool.title}
                                    </h3>
                                    <p className="text-[var(--text-muted)] leading-relaxed text-sm relative z-10">
                                        {tool.desc}
                                    </p>

                                    {/* Interactive Arrow Indicator */}
                                    <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] transition-all group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] group-hover:border-transparent group-hover:scale-110">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </div>
                                </Link>
                            </Magnetic>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
