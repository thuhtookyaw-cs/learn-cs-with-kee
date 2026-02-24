import Link from 'next/link';
import { TUTOR, SERVICES, STEPS } from '@/lib/data';
import LandingNav from '@/components/layout/LandingNav';
import ContactForm from '@/components/ui/ContactForm';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { FadeIn, HoverLift } from '@/components/ui/animations';
/* ─────────────────────────────────────────────────────────────────────── */

function Stamp({ children, color = '#4F46E5' }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 6,
            border: `1.5px solid ${color}`, color: color,
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
            backgroundColor: `${color}12`,
        }}>
            {children}
        </span>
    );
}

/* ── Sections ─────────────────────────────────────────────────────────── */

function Hero() {
    return (
        <section style={{
            minHeight: '90dvh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '80px 24px 60px',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Animated Background Blobs */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                <div className="shimmer" style={{
                    position: 'absolute', top: '10%', left: '15%', width: '40vw', height: '40vw',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(40px)', mixBlendMode: 'multiply'
                }} />
                <div className="shimmer anim-delay-2" style={{
                    position: 'absolute', bottom: '10%', right: '15%', width: '35vw', height: '35vw',
                    background: 'radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(50px)', mixBlendMode: 'multiply'
                }} />
            </div>

            {/* Paper grain overlay */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px', zIndex: 0
            }} />

            {/* Badge */}
            <div className="anim-up" style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
                <Stamp color="#059669">❖ A* Edexcel Graduate · IGCSE Specialist</Stamp>
            </div>

            {/* Headline */}
            <h1 className="anim-up text-display font-serif" style={{ marginBottom: 20, maxWidth: 720, position: 'relative', zIndex: 1 }}>
                Master IGCSE{' '}
                <span style={{
                    fontStyle: 'italic',
                    background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    Computer Science
                </span>
                {' '}&amp; ICT
            </h1>

            <p className="anim-up anim-delay-1 text-body-lg font-sans" style={{ color: 'var(--text-muted)', maxWidth: 520, marginBottom: 36, position: 'relative', zIndex: 1 }}>
                Personalised tutoring to help you achieve <strong style={{ fontWeight: 600, color: 'var(--text)' }}>top grades</strong>{' '}
                — from the foundations all the way to exam day.
            </p>

            {/* CTAs */}
            <div className="anim-up anim-delay-2" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
                <a href={TUTOR.telegram} target="_blank" rel="noreferrer" className="btn-primary text-body font-sans" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 9,
                    padding: '14px 28px', borderRadius: 100,
                    background: 'linear-gradient(135deg,#2AABEE,#0088CC)',
                    color: 'white', fontWeight: 700, textDecoration: 'none',
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                    Message on Telegram
                </a>
                <a href="#contact" className="btn-outline text-body font-sans" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 28px', borderRadius: 100,
                    border: '1.5px solid var(--border)',
                    backgroundColor: 'var(--bg-card)', fontWeight: 600,
                    textDecoration: 'none',
                }}>
                    View Contact Info ↓
                </a>
            </div>

            {/* Stats row */}
            <div className="anim-up anim-delay-3" style={{
                display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center',
            }}>
                {[
                    { v: TUTOR.students, l: 'Students Helped' },
                    { v: TUTOR.sessions, l: 'Sessions Done' },
                    { v: TUTOR.rating + '★', l: 'Avg Rating' },
                ].map(s => (
                    <div key={s.l} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>{s.v}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: "'Inter', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.l}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function About() {
    return (
        <section id="about" style={{ padding: '100px 24px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <Stamp color="#4F46E5">About the Tutor</Stamp>
                    <h2 className="text-h1 font-serif" style={{ marginTop: 16, maxWidth: 700, marginInline: 'auto', lineHeight: 1.25 }}>
                        Hi, I'm {TUTOR.name} — I help students get A* in IGCSE CS &amp; ICT 👋
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                    {/* Bio card */}
                    <HoverLift style={{ gridColumn: '1 / -1' }}>
                        <div style={{
                            padding: '36px', borderRadius: 20, height: '100%',
                            border: '1px solid var(--border)',
                            backgroundColor: 'var(--bg)',
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <p className="text-body-lg font-sans" style={{ color: 'var(--text-2)' }}>
                                    I achieved <strong style={{ color: 'var(--text)', fontWeight: 600 }}>A* in Edexcel IGCSE Computer Science and ICT</strong>, and have since helped 10+ students build a rock-solid understanding of these subjects.
                                </p>
                                <p className="text-body-lg font-sans" style={{ color: 'var(--text-2)' }}>
                                    My approach is <strong style={{ color: 'var(--text)', fontWeight: 600 }}>concept-first</strong> — we break down complex logic into bite-sized pieces so you truly understand the "why", rather than just memorising.
                                </p>
                                <p className="text-body-lg font-sans" style={{ color: 'var(--text-2)' }}>
                                    Once the foundations are set, we layer in <strong style={{ color: 'var(--text)', fontWeight: 600 }}>proven exam strategies</strong> so you know exactly what examiners are looking for to score top marks.
                                </p>
                            </div>
                        </div>
                    </HoverLift>

                    {/* Achievements */}
                    <HoverLift>
                        <div style={{ padding: '32px 28px', borderRadius: 20, height: '100%', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                            <h3 className="text-h3 font-serif" style={{ marginBottom: 20 }}>🏆 Key Achievements</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[
                                    'A* in Edexcel IGCSE CS & ICT',
                                    'Students improved by 2 grades on average',
                                    '10+ students taught successfully',
                                    '100+ sessions completed',
                                ].map(a => (
                                    <div key={a} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-body font-sans" style={{ color: 'var(--text-2)' }}>{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </HoverLift>

                    {/* Fun stuff */}
                    <HoverLift>
                        <div style={{ padding: '32px 28px', borderRadius: 20, height: '100%', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                            <h3 className="text-h3 font-serif" style={{ marginBottom: 20 }}>☕ Fun Facts</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { i: '🧠', t: 'Simplifies hard logic & pseudocode' },
                                    { i: '🤝', t: 'Patient & supportive approach' },
                                    { i: '☕', t: 'Drinks coffee as a drug' },
                                    { i: '🦇', t: 'Full-time night owl' },
                                ].map(f => (
                                    <div key={f.t} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <span style={{ fontSize: 20 }}>{f.i}</span>
                                        <span className="text-body font-sans" style={{ color: 'var(--text-2)' }}>{f.t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </HoverLift>
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 56 }}>
                    <a href={TUTOR.telegram} target="_blank" rel="noreferrer" className="btn-primary text-body font-sans" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 9,
                        padding: '14px 28px', borderRadius: 100,
                        background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                        color: 'white', fontWeight: 700, textDecoration: 'none',
                    }}>
                        Message Me on Telegram
                    </a>
                    <Link href="/dashboard" className="btn-outline text-body font-sans" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '13px 28px', borderRadius: 100,
                        border: '1.5px solid var(--border)',
                        backgroundColor: 'var(--bg-card)', fontWeight: 600,
                        textDecoration: 'none',
                    }}>
                        View Resources
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Services() {
    return (
        <section id="services" style={{ padding: '80px 24px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <Stamp color="#059669">Tutoring Options</Stamp>
                    <h2 className="text-h1 font-serif" style={{ marginTop: 14 }}>
                        How I Can Help You
                    </h2>
                    <p className="text-body-lg font-sans" style={{ color: 'var(--text-muted)', marginTop: 8, maxWidth: 500, marginInline: 'auto' }}>
                        Flexible tutoring options built to fit your schedule and learning goals.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {SERVICES.map((s, i) => (
                        <HoverLift key={i}>
                            <div style={{
                                padding: '32px 28px', borderRadius: 20, height: '100%',
                                border: '1.5px solid var(--border)', backgroundColor: 'var(--bg-card)',
                            }}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>
                                    {s.icon}
                                </div>
                                <h3 className="text-h3 font-serif" style={{ marginBottom: 10 }}>{s.title}</h3>
                                <p className="text-body font-sans" style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{s.desc}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    {s.original && (
                                        <div style={{ textDecoration: 'line-through', color: 'var(--text-faint)', fontSize: 12, fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                                            {s.original}
                                        </div>
                                    )}
                                    <div style={{ padding: '6px 12px', borderRadius: 8, backgroundColor: s.original ? 'var(--green-soft)' : 'var(--bg)', border: `1px solid ${s.original ? 'var(--green)' : 'var(--border-2)'}`, display: 'inline-block', fontSize: 12, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: s.original ? 'var(--green)' : 'var(--text)' }}>
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
        <section style={{ padding: '80px 24px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <Stamp color="#0891B2">Simple Process</Stamp>
                    <h2 className="text-h1 font-serif" style={{ marginTop: 14 }}>
                        How It Works
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0, position: 'relative' }}>
                    {STEPS.map((s, i) => (
                        <div key={s.n} style={{ position: 'relative' }}>
                            {/* Connector line */}
                            {i < STEPS.length - 1 && (
                                <div style={{
                                    position: 'absolute', top: 32, left: '50%', width: '100%',
                                    height: 2, background: 'linear-gradient(90deg, var(--border), transparent)',
                                    display: 'none', // hidden on mobile, shown via media query equivalent
                                    zIndex: 0
                                }} />
                            )}
                            <HoverLift>
                                <div style={{ textAlign: 'center', padding: '0 24px 32px', position: 'relative', zIndex: 1 }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                                        background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 26, boxShadow: '0 4px 20px rgba(79,70,229,0.3)',
                                    }}>
                                        {s.icon}
                                    </div>
                                    <div className="font-sans" style={{
                                        display: 'inline-block',
                                        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                                        color: 'var(--accent)', marginBottom: 8,
                                    }}>{s.n}</div>
                                    <h3 className="text-h3 font-serif" style={{ marginBottom: 8 }}>{s.title}</h3>
                                    <p className="text-body font-sans" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                                </div>
                            </HoverLift>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <a href={TUTOR.telegram} target="_blank" rel="noreferrer" className="btn-primary text-body font-sans" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '13px 28px', borderRadius: 100,
                        background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                        color: 'white', fontWeight: 700, textDecoration: 'none',
                    }}>
                        Start Step 1 — Message Me →
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ── Footer ───────────────────────────────────────────────────────────── */
function Footer() {
    return (
        <footer style={{ padding: '40px 24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 12 }}>
                <img src="/logo.png" alt="Logo" style={{ width: 24, height: 24, borderRadius: 5, objectFit: 'contain' }} />
                <span style={{ fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text)', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14 }}>Learn</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>CS</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>with</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: 'var(--accent)', fontStyle: 'italic', paddingLeft: '2px' }}>Kee</span>
                </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-faint)', fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>
                Personalised IGCSE CS & ICT Tutoring &nbsp;·&nbsp; {TUTOR.email}
            </p>
            <Link href="/dashboard" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: 'var(--accent)', fontFamily: "'Inter', sans-serif",
                textDecoration: 'none', fontWeight: 600,
            }}>
                📚 Browse Resources →
            </Link>
            <p style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: "'Inter', sans-serif", marginTop: 20 }}>
                © {new Date().getFullYear()} {TUTOR.name}. All rights reserved.
            </p>
        </footer>
    );
}

/* ── Main export ──────────────────────────────────────────────────────── */
export default function TutorLandingPage() {
    return (
        <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg)', position: 'relative' }}>
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
