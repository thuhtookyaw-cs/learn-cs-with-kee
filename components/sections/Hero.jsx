'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Stamp from '@/components/ui/Stamp';
import { TUTOR } from '@/lib/data';

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Mouse tracking for localized parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 50, stiffness: 400 };
    const pX = useSpring(mouseX, springConfig);
    const pY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        // Normalized from -1 to 1 representing relative position from center
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
    };

    // Scroll parallax for content
    const yContent = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacityContent = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Mouse parallax for orbs (inverse to mouse movement)
    const orb1x = useTransform(pX, [-1, 1], [30, -30]);
    const orb1y = useTransform(pY, [-1, 1], [30, -30]);

    // Orb 2 moves slightly faster and opposite
    const orb2x = useTransform(pX, [-1, 1], [-50, 50]);
    const orb2y = useTransform(pY, [-1, 1], [-50, 50]);

    return (
        <section id="hero" ref={ref} onMouseMove={handleMouseMove} className="min-h-[90dvh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    style={{ x: orb1x, y: orb1y, background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)' }}
                    className="shimmer absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply blur-[80px]"
                />
                <motion.div
                    style={{ x: orb2x, y: orb2y, background: 'radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%)' }}
                    className="shimmer anim-delay-2 absolute bottom-[10%] right-[15%] w-[35vw] h-[35vw] rounded-full mix-blend-multiply blur-[80px]"
                />
            </div>

            <motion.div style={{ y: yContent, opacity: opacityContent }} className="relative z-10 flex flex-col items-center">
                {/* Badge */}
                <div className="anim-up mb-6">
                    <Stamp color="emerald">❖ A* Edexcel Graduate · IGCSE Specialist</Stamp>
                </div>

                {/* Headline */}
                <h1 className="anim-up text-5xl sm:text-6xl md:text-7xl font-extrabold font-serif mb-6 max-w-4xl tracking-tight text-[var(--text)]">
                    Master IGCSE{' '}
                    <span className="italic bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-600">
                        Computer Science
                    </span>
                    {' '}&amp; ICT
                </h1>

                <p className="anim-up anim-delay-1 text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mb-10 leading-relaxed font-sans">
                    Personalised tutoring to help you achieve <strong className="font-semibold text-[var(--text)]">top grades</strong>{' '}
                    — from the foundations all the way to exam day.
                </p>

                {/* CTAs */}
                <div className="anim-up anim-delay-2 flex flex-wrap gap-4 justify-center mb-16">
                    <a href={TUTOR.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold whitespace-nowrap hover:-translate-y-1 hover:shadow-lg transition-all font-sans">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                        Message on Telegram
                    </a>
                    <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] font-semibold whitespace-nowrap hover:bg-[var(--border)] hover:-translate-y-1 transition-all font-sans">
                        View Contact Info ↓
                    </a>
                </div>

                {/* Stats row */}
                <div className="anim-up anim-delay-3 flex flex-wrap gap-x-12 gap-y-8 justify-center">
                    {[
                        { v: TUTOR.students, l: 'Students Helped' },
                        { v: TUTOR.sessions, l: 'Sessions Done' },
                        { v: TUTOR.rating + '★', l: 'Avg Rating' },
                    ].map(s => (
                        <div key={s.l} className="text-center">
                            <div className="font-serif text-3xl sm:text-4xl font-extrabold text-[var(--accent)] mb-1">{s.v}</div>
                            <div className="text-xs text-[var(--text-faint)] font-sans tracking-widest uppercase font-semibold">{s.l}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
