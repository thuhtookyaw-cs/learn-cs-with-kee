import Link from 'next/link';
import { TUTOR, SERVICES, STEPS } from '@/lib/data';
import LandingNav from '@/components/layout/LandingNav';
import ContactForm from '@/components/ui/ContactForm';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import Stamp from '@/components/ui/Stamp';
import { FadeIn, HoverLift } from '@/components/ui/animations';
import Hero from '@/components/sections/Hero';
/* ─────────────────────────────────────────────────────────────────────── */

/* ── Sections ─────────────────────────────────────────────────────────── */

// Hero section moved to a separate client component to use framer-motion hooks

function About() {
    return (
        <section id="about" className="py-24 px-6 bg-[var(--bg-card)] border-y border-[var(--border)] relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <Stamp color="indigo">About the Tutor</Stamp>
                    <h2 className="text-3xl sm:text-5xl font-serif font-bold mt-6 max-w-3xl mx-auto leading-tight text-[var(--text)]">
                        Hi, I'm {TUTOR.name} — I help students get A* in IGCSE CS &amp; ICT 👋
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Bio card */}
                    <HoverLift className="lg:col-span-3">
                        <div className="p-8 sm:p-10 rounded-3xl h-full border border-[var(--border)] bg-[var(--bg)] shadow-sm hover:shadow-paper-hover hover:border-[var(--accent)] transition-all flex flex-col justify-center">
                            <div className="flex flex-col gap-5 text-lg font-sans text-[var(--text-muted)] leading-relaxed">
                                <p>
                                    I achieved <strong className="text-[var(--text)] font-semibold">A* in Edexcel IGCSE Computer Science and ICT</strong>, and have since helped 10+ students build a rock-solid understanding of these subjects.
                                </p>
                                <p>
                                    My approach is <strong className="text-[var(--text)] font-semibold">concept-first</strong> — we break down complex logic into bite-sized pieces so you truly understand the "why", rather than just memorising.
                                </p>
                                <p>
                                    Once the foundations are set, we layer in <strong className="text-[var(--text)] font-semibold">proven exam strategies</strong> so you know exactly what examiners are looking for to score top marks.
                                </p>
                            </div>
                        </div>
                    </HoverLift>

                    {/* Achievements */}
                    <HoverLift className="md:col-span-2 lg:col-span-1">
                        <div className="p-8 rounded-3xl h-full border border-[var(--border)] bg-[var(--bg)] shadow-sm hover:shadow-paper-hover hover:border-[var(--accent)] transition-all">
                            <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-6">🏆 Key Achievements</h3>
                            <div className="flex flex-col gap-4 text-[var(--text-muted)] font-sans">
                                {[
                                    'A* in Edexcel IGCSE CS & ICT',
                                    'Students improved by 2 grades on average',
                                    '10+ students taught successfully',
                                    '100+ sessions completed',
                                ].map(a => (
                                    <div key={a} className="flex gap-3 items-start">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span>{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </HoverLift>

                    {/* Fun stuff */}
                    <HoverLift className="md:col-span-2">
                        <div className="p-8 rounded-3xl h-full border border-[var(--border)] bg-[var(--bg)] shadow-sm hover:shadow-paper-hover hover:border-[var(--accent)] transition-all">
                            <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-6">☕ Fun Facts</h3>
                            <div className="flex flex-col gap-4 text-[var(--text-muted)] font-sans">
                                {[
                                    { i: '🧠', t: 'Simplifies hard logic & pseudocode' },
                                    { i: '🤝', t: 'Patient & supportive approach' },
                                    { i: '☕', t: 'Drinks coffee as a drug' },
                                    { i: '🦇', t: 'Full-time night owl' },
                                ].map(f => (
                                    <div key={f.t} className="flex gap-4 items-center">
                                        <span className="text-2xl">{f.i}</span>
                                        <span>{f.t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </HoverLift>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap justify-center gap-4 mt-16 font-sans">
                    <a href={TUTOR.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold whitespace-nowrap hover:-translate-y-1 hover:shadow-lg transition-all">
                        Message Me on Telegram
                    </a>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] font-semibold whitespace-nowrap hover:bg-[var(--border)] hover:-translate-y-1 transition-all">
                        View Resources
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Services() {
    return (
        <section id="services" className="py-24 px-6 relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <Stamp color="emerald">Tutoring Options</Stamp>
                    <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text)] mt-6">
                        How I Can Help You
                    </h2>
                    <p className="text-lg text-[var(--text-muted)] mt-4 max-w-2xl mx-auto font-sans">
                        Flexible tutoring options built to fit your schedule and learning goals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((s, i) => (
                        <HoverLift key={i}>
                            <div className="p-8 rounded-3xl h-full border border-[var(--border)] bg-[var(--bg-card)] shadow-sm hover:shadow-paper-hover hover:border-[var(--accent)] transition-all flex flex-col">
                                <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] flex items-center justify-center text-3xl mb-6 shadow-sm border border-[var(--border)] pb-1">
                                    {s.icon}
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-3">{s.title}</h3>
                                <p className="text-[var(--text-muted)] font-sans mb-8 flex-grow">{s.desc}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {s.original && (
                                        <div className="line-through text-[var(--text-faint)] text-sm font-semibold font-sans">
                                            {s.original}
                                        </div>
                                    )}
                                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-sans ${s.original ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)]'}`}>
                                        {s.tag}
                                    </div>
                                </div>
                            </div>
                        </HoverLift>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section className="py-24 px-6 bg-[var(--bg-card)] border-y border-[var(--border)] relative">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <Stamp color="cyan">Simple Process</Stamp>
                    <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text)] mt-6">
                        How It Works
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative">
                    {/* Connector line for desktop */}
                    <div className="hidden md:block absolute top-[2.75rem] left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-[var(--border)] via-[var(--border)] to-transparent z-0" />

                    {STEPS.map((s, i) => (
                        <div key={s.n} className="relative z-10">
                            <HoverLift>
                                <div className="text-center px-4">
                                    <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg text-white">
                                        {s.icon}
                                    </div>
                                    <div className="inline-block text-xs font-bold tracking-widest text-[var(--accent)] mb-3 font-sans uppercase">
                                        {s.n}
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-[var(--text)] mb-3">{s.title}</h3>
                                    <p className="text-[var(--text-muted)] font-sans leading-relaxed">{s.desc}</p>
                                </div>
                            </HoverLift>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <a href={TUTOR.telegram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold whitespace-nowrap hover:-translate-y-1 hover:shadow-lg transition-all font-sans">
                        Start Step 1 — Message Me &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ── Footer ───────────────────────────────────────────────────────────── */
function Footer() {
    return (
        <footer className="py-10 px-6 border-t border-[var(--border)] text-center bg-[var(--bg)]">
            <div className="flex items-center justify-center gap-2.5 mb-5">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-md object-contain" />
                <span className="text-base tracking-tight text-[var(--text)] flex items-baseline gap-1">
                    <span className="font-sans font-semibold text-sm">Learn</span>
                    <span className="font-serif font-black">CS</span>
                    <span className="font-sans font-normal text-xs text-[var(--text-muted)]">with</span>
                    <span className="font-serif font-extrabold text-[var(--accent)] italic pr-0.5">Kee</span>
                </span>
            </div>
            <p className="text-sm text-[var(--text-faint)] font-sans mb-4">
                Personalised IGCSE CS & ICT Tutoring &nbsp;&middot;&nbsp; {TUTOR.email}
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] font-sans font-semibold hover:underline mb-6">
                📚 Browse Resources &rarr;
            </Link>
            <p className="text-xs text-[var(--text-faint)] font-sans">
                &copy; {new Date().getFullYear()} {TUTOR.name}. All rights reserved.
            </p>
        </footer>
    );
}

/* ── Main export ──────────────────────────────────────────────────────── */
export default function TutorLandingPage() {
    return (
        <div className="min-h-[100dvh] bg-[var(--bg)] relative">
            <LandingNav />
            <FadeIn delay={0}>
                <Hero />
            </FadeIn>
            <FadeIn delay={0.1}>
                <About />
            </FadeIn>
            <FadeIn delay={0}>
                <Services />
            </FadeIn>
            <FadeIn delay={0}>
                <HowItWorks />
            </FadeIn>
            <FadeIn delay={0}>
                <ContactForm />
            </FadeIn>
            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
