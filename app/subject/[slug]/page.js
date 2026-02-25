'use client';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { TUTOR } from '@/lib/data';

/* ─ Config ─────────────────────────────────────────────────── */
const SUBJECT_META = {
    cs: { title: 'Computer Science', code: '4CP0', accent: '#4F46E5', gradient: 'linear-gradient(135deg,#4F46E5,#7C3AED)' },
    ict: { title: 'ICT', code: '4IT1', accent: '#059669', gradient: 'linear-gradient(135deg,#059669,#0D9488)' },
};

/* ─ Name normalization ──────────────────────────────────────── */
const NAME_MAP = {
    pastpaper: 'Past Papers', 'past-paper': 'Past Papers', topical: 'Topical Questions',
    'topical-questions': 'Topical Questions', 'question-paper': 'Question Paper',
    'mark-scheme': 'Mark Scheme', 'data-file': 'Data File', 'data-files': 'Data Files',
    'examiner-report': "Examiner's Report", other: 'Other Resources',
    'may-june': 'June', 'oct-nov': 'November', 'feb-march': 'Feb / March',
};
function pretty(s = '') {
    const k = s.toLowerCase().replace(/\s+/g, '-');
    return NAME_MAP[k] || s.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ─ Flatten tree for search ─────────────────────────────────── */
function flatten(nodes = [], subject, anc = []) {
    const out = [];
    for (const n of nodes) {
        if (n.type === 'file') {
            let year = '', session = '';
            for (const a of anc) { const m = a.match(/(\d{4})\s*(june|nov\w*|feb\w*|may)?/i); if (m) { year = m[1]; session = (m[2] ?? '').toLowerCase(); } }
            out.push({
                ...n, subject, ancestors: anc, ancestorDisplay: anc.map(pretty), year, session, paperType: anc.length ? pretty(anc[anc.length - 1]) : '',
                searchText: [subject, ...anc.map(a => a + ' ' + pretty(a)), n.name.replace(/[_.-]/g, ' ')].join(' ').toLowerCase()
            });
        } else if (n.children?.length) { out.push(...flatten(n.children, subject, [...anc, n.name])); }
    }
    return out;
}

/* ─ Icons ───────────────────────────────────────────────────── */
const Chevron = ({ open }) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.17s', flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>;
const FolderIco = ({ color = 'var(--amber)', open }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={open ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
const PDFIco = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
const ZIPIco = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M10 12v2" /><path d="M10 16v2" /><path d="M10 8v2" /></svg>;
const DlIco = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const EyeIco = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const CloseIco = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

/* ─ PDF Preview Modal ───────────────────────────────────────── */
function PreviewModal({ url, name, onClose }) {
    if (!url) return null;
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column',
                backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                justifyContent: 'center', alignItems: 'center', padding: '5vh 5vw'
            }}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                style={{
                    display: 'flex', flexDirection: 'column',
                    width: '100%', maxWidth: 1000, height: '100%',
                    backgroundColor: '#1a1a1a', borderRadius: 12, overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px', backgroundColor: 'rgba(0,0,0,0.6)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: "'Inter',sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 16 }}>
                        {name?.replace(/\.(pdf|zip)$/i, '').replace(/[_-]/g, ' ')}
                    </span>
                    <button onClick={onClose} style={{
                        color: 'white', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0
                    }}><CloseIco /></button>
                </div>
                <div style={{ flex: 1, padding: '0 16px 16px' }}>
                    <iframe src={url} title={name} allow="autoplay"
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '0 0 12px 12px', backgroundColor: '#1a1a1a' }} />
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─ Depth config ─────────────────────────────────────────────── */
const DS = [
    { fs: 14, fw: 700, fc: 'var(--accent)', pv: 11 },
    { fs: 13, fw: 600, fc: 'var(--amber)', pv: 9 },
    { fs: 13, fw: 500, fc: 'var(--text-muted)', pv: 8 },
    { fs: 12, fw: 500, fc: 'var(--text-faint)', pv: 7 },
];

/* ─ FileRow ─────────────────────────────────────────────────── */
function FileRow({ node, depth = 0, onPreview }) {
    const [h, sH] = useState(false);
    const isZip = node.name.toLowerCase().endsWith('.zip');
    const isPdf = node.name.toLowerCase().endsWith('.pdf');
    const label = (node.label ?? node.name.replace(/\.(pdf|zip)$/i, '').replace(/[_-]/g, ' '));
    return (
        <div onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)}
            style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: `8px 10px 8px ${10 + depth * 16}px`, borderRadius: 8, margin: '1px 0',
                backgroundColor: h ? 'var(--bg-hover)' : 'transparent', border: '1px solid ' + (h ? 'var(--border)' : 'transparent'),
                transition: 'all 0.13s'
            }}>
            {isZip ? <ZIPIco /> : <PDFIco />}
            <span style={{ flex: 1, fontSize: 13, fontWeight: 400, color: h ? 'var(--text)' : 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: "'Inter',sans-serif" }}>
                {label}
            </span>
            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                {isPdf && node.previewUrl && (
                    <button onClick={() => onPreview?.(node)} style={{
                        display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                        color: h ? 'white' : 'var(--text-muted)', backgroundColor: h ? '#059669' : 'var(--border-2)', border: '1px solid ' + (h ? 'transparent' : 'var(--border)'),
                        transition: 'all 0.13s', cursor: 'pointer', boxShadow: h ? '0 1px 6px rgba(5,150,105,0.35)' : 'none'
                    }}>
                        <EyeIco /> Preview
                    </button>
                )}
                <a href={node.path} download={node.name} style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                    color: h ? 'white' : 'var(--text-muted)', backgroundColor: h ? (isZip ? '#F59E0B' : 'var(--accent)') : 'var(--border-2)', border: '1px solid ' + (h ? 'transparent' : 'var(--border)'),
                    transition: 'all 0.13s', textDecoration: 'none', cursor: 'pointer', flexShrink: 0, boxShadow: h ? (isZip ? '0 1px 6px rgba(245,158,11,0.35)' : '0 1px 6px rgba(79,70,229,0.35)') : 'none'
                }}>
                    <DlIco /> {isZip ? 'ZIP' : 'PDF'}
                </a>
            </div>
        </div>
    );
}

/* ─ TreeNode ─────────────────────────────────────────────────── */
function TreeNode({ node, depth = 0, onPreview }) {
    const [open, sO] = useState(false);
    if (node.type === 'file') return <FileRow node={node} depth={depth} onPreview={onPreview} />;
    const ds = DS[Math.min(depth, DS.length - 1)];
    const display = pretty(node.name);
    const files = node.children?.filter(c => c.type === 'file') ?? [];
    const dirs = node.children?.filter(c => c.type === 'dir') ?? [];
    const badge = files.length ? `${files.length} file${files.length !== 1 ? 's' : ''}` : dirs.length ? `${dirs.length} folder${dirs.length !== 1 ? 's' : ''}` : null;
    const pl = 10 + depth * 16;
    return (
        <div style={{ margin: '2px 0' }}>
            <button onClick={() => sO(v => !v)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: pl, paddingRight: 10,
                paddingTop: ds.pv, paddingBottom: ds.pv, borderRadius: depth === 0 ? 10 : 8, border: '1px solid ' + (open ? 'var(--border)' : 'transparent'),
                background: open ? (depth === 0 ? 'var(--accent-soft)' : 'var(--bg-hover)') : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
            }}>
                <span style={{ color: open ? ds.fc : 'var(--text-faint)', transition: 'color 0.15s' }}><Chevron open={open} /></span>
                <span style={{ color: ds.fc, transition: 'color 0.15s' }}><FolderIco color={ds.fc} open={open} /></span>
                <span style={{ flex: 1, fontSize: ds.fs, fontWeight: ds.fw, fontFamily: "'Inter',sans-serif", color: open ? 'var(--text)' : 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {display}
                </span>
                {badge && <span style={{ fontSize: 10, fontWeight: 500, fontFamily: "'Inter',sans-serif", color: 'var(--text-faint)', backgroundColor: 'var(--border-2)', border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>
                    {badge}
                </span>}
            </button>
            <AnimatePresence initial={false}>
                {open && node.children?.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden', marginLeft: pl + 8, paddingLeft: 8, borderLeft: '1.5px solid var(--border)', paddingTop: 2, paddingBottom: 2, marginTop: 2 }}>
                        {node.children.map((c, i) => <TreeNode key={`${c.name}-${i}`} node={c} depth={depth + 1} onPreview={onPreview} />)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─ ResultRow ────────────────────────────────────────────────── */
function ResultRow({ file, onPreview }) {
    const [h, sH] = useState(false);
    const isCS = file.subject === 'cs';
    const isPdf = file.name?.toLowerCase().endsWith('.pdf');
    return (
        <div onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)}
            style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                border: '1px solid ' + (h ? 'var(--border)' : 'var(--border-2)'), backgroundColor: h ? 'var(--bg-hover)' : 'var(--bg-card)',
                transition: 'all 0.13s', marginBottom: 6
            }}>
            <span style={{
                flexShrink: 0, fontSize: 10, fontWeight: 700, fontFamily: "'Inter',sans-serif", letterSpacing: '0.05em',
                color: isCS ? 'var(--accent)' : 'var(--green)', backgroundColor: isCS ? 'var(--accent-soft)' : 'var(--green-soft)',
                padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase'
            }}>{isCS ? 'CS' : 'ICT'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: "'Inter',sans-serif", marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.ancestorDisplay?.join(' › ')}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'Inter',sans-serif", color: h ? 'var(--text)' : 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.label ?? file.name}
                </div>
            </div>
            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                {isPdf && file.previewUrl && (
                    <button onClick={() => onPreview?.(file)} style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                        color: h ? 'white' : 'var(--text-muted)', backgroundColor: h ? '#059669' : 'var(--border-2)', border: '1px solid ' + (h ? 'transparent' : 'var(--border)'),
                        transition: 'all 0.13s', cursor: 'pointer', boxShadow: h ? '0 1px 6px rgba(5,150,105,0.35)' : 'none'
                    }}>
                        <EyeIco /> <span className="hide-sm">Preview</span>
                    </button>
                )}
                <a href={file.path} download={file.name} style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: "'Inter',sans-serif",
                    color: h ? 'white' : 'var(--text-muted)', backgroundColor: h ? 'var(--accent)' : 'var(--border-2)', border: '1px solid ' + (h ? 'transparent' : 'var(--border)'),
                    transition: 'all 0.13s', textDecoration: 'none', cursor: 'pointer', boxShadow: h ? '0 1px 6px rgba(79,70,229,0.35)' : 'none'
                }}>
                    <DlIco /> <span className="hide-sm">Download</span>
                </a>
            </div>
        </div>
    );
}

/* ─ FilterChip ───────────────────────────────────────────────── */
function Chip({ label, active, onClick }) {
    return (
        <button onClick={onClick} style={{
            padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, fontFamily: "'Inter',sans-serif",
            border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'), backgroundColor: active ? 'var(--accent-soft)' : 'var(--bg-card)',
            color: active ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.13s', whiteSpace: 'nowrap'
        }}>
            {label}
        </button>
    );
}

/* ─ Main Page ────────────────────────────────────────────────── */
export default function SubjectPage() {
    const params = useParams();
    const slug = params?.slug ?? 'cs';

    const [dark, setDark] = useState(false);
    const [raw, setRaw] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQ] = useState('');
    const [fYear, sFY] = useState('');
    const [fSession, sFS] = useState('');
    const [fType, sFT] = useState('');
    const searchRef = useRef(null);
    const [previewFile, setPreviewFile] = useState(null);

    const meta = SUBJECT_META[slug] ?? SUBJECT_META.cs;

    useEffect(() => {
        const stored = localStorage.getItem('igcse-theme');
        const pd = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = stored ? stored === 'dark' : pd;
        setDark(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    useEffect(() => {
        fetch('/api/files').then(r => r.json()).then(j => setRaw(j)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const toggleTheme = useCallback(() => {
        setDark(d => { const n = !d; document.documentElement.classList.toggle('dark', n); localStorage.setItem('igcse-theme', n ? 'dark' : 'light'); return n; });
    }, []);

    const tree = useMemo(() => raw?.[slug] ?? [], [raw, slug]);
    const flatFiles = useMemo(() => flatten(tree, slug), [tree, slug]);
    const years = useMemo(() => [...new Set(flatFiles.map(f => f.year).filter(Boolean))].sort((a, b) => b - a), [flatFiles]);

    const isSearchActive = query.trim() || fYear || fSession || fType;
    const filtered = useMemo(() => {
        if (!isSearchActive) return [];
        const q = query.trim().toLowerCase();
        return flatFiles.filter(f => {
            if (q && !f.searchText.includes(q)) return false;
            if (fYear && f.year !== fYear) return false;
            if (fSession && f.session !== fSession) return false;
            if (fType && f.paperType !== fType) return false;
            return true;
        });
    }, [flatFiles, query, fYear, fSession, fType, isSearchActive]);

    const clearAll = useCallback(() => { setQ(''); sFY(''); sFS(''); sFT(''); searchRef.current?.focus(); }, []);



    return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
            <Navbar dark={dark} onToggleTheme={toggleTheme} />

            {/* Breadcrumb */}
            <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '16px 20px 0' }}>
                <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: "'Inter',sans-serif", color: 'var(--text-faint)' }}>
                    <Link href="/dashboard" style={{ color: 'var(--text-faint)', textDecoration: 'none' }}>Dashboard</Link>
                    <span>›</span>
                    <span style={{ color: 'var(--text-muted)' }}>{meta.title}</span>
                </nav>
            </div>

            {/* Subject header */}
            <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', padding: '24px 20px 0' }}>
                <div className="anim-up" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14, background: meta.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 22, boxShadow: 'var(--shadow-md)', flexShrink: 0
                    }}>
                        {slug === 'cs' ? '💻' : '📡'}
                    </div>
                    <div>
                        <h1 className="text-h1 font-serif mb-2" style={{ color: 'var(--text)' }}>{meta.title}</h1>
                        <span className="stamp" style={{ color: meta.accent, backgroundColor: meta.accent + '1A', borderColor: meta.accent + '30', marginTop: 4, display: 'inline-block' }}>{meta.code}</span>
                    </div>
                </div>
            </div>

            {/* Sticky search */}
            <div style={{
                position: 'sticky', top: 58, zIndex: 40, backgroundColor: 'color-mix(in srgb, var(--bg) 95%, transparent)',
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border-2)', padding: '10px 20px'
            }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderRadius: 12,
                        border: '1.5px solid var(--border)', backgroundColor: 'var(--bg-input)', boxShadow: 'var(--shadow-sm)', height: 44
                    }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input ref={searchRef} value={query} onChange={e => setQ(e.target.value)}
                            placeholder={`Search ${meta.title} papers… (e.g. 2023, mark scheme)`}
                            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: "'Inter',sans-serif", color: 'var(--text)' }} />
                        {query && <button onClick={() => setQ('')} style={{ color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>Filters:</span>
                        {years.slice(0, 7).map(y => <Chip key={y} label={y} active={fYear === y} onClick={() => sFY(v => v === y ? '' : y)} />)}
                        <Chip label="June" active={fSession === 'june'} onClick={() => sFS(v => v === 'june' ? '' : 'june')} />
                        <Chip label="November" active={fSession === 'november'} onClick={() => sFS(v => v === 'november' ? '' : 'november')} />
                        {['Question Paper', 'Mark Scheme', "Examiner's Report"].map(t => <Chip key={t} label={t} active={fType === t} onClick={() => sFT(v => v === t ? '' : t)} />)}
                        {isSearchActive && <button onClick={clearAll} style={{
                            marginLeft: 4, padding: '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, fontFamily: "'Inter',sans-serif",
                            border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer'
                        }}>
                            ✕ Clear
                        </button>}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '20px 20px 80px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {isSearchActive ? (
                    <div className="anim-in">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Search Results</h2>
                            <span style={{ fontSize: 12, fontFamily: "'Inter',sans-serif", color: 'var(--text-faint)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 20, backgroundColor: 'var(--bg-card)' }}>
                                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        {filtered.length === 0
                            ? <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '40px 20px', textAlign: 'center', border: '1.5px dashed var(--border)', borderRadius: 12, backgroundColor: 'var(--bg-card)' }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: "'Inter',sans-serif", marginBottom: 6 }}>No matches found</p>
                                <p style={{ fontSize: 14, color: 'var(--text-faint)', fontFamily: "'Inter',sans-serif", marginBottom: 20 }}>
                                    We couldn't find anything matching "{query}" or your filters.
                                </p>
                                <a
                                    href={TUTOR?.telegram || 'https://t.me/kee'} target="_blank" rel="noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        padding: '10px 20px', borderRadius: 10, backgroundColor: '#2AABEE', color: 'white',
                                        fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: 'none',
                                        boxShadow: '0 4px 12px rgba(42, 171, 238, 0.3)'
                                    }}
                                >
                                    Request paper on Telegram
                                </a>
                            </motion.div>
                            : filtered.map((f, i) => <ResultRow key={`${f.path}-${i}`} file={f} onPreview={f => setPreviewFile(f)} />)
                        }
                    </div>
                ) : (
                    loading
                        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)' }} className="spin" />
                        </div>
                        : tree.length > 0
                            ? tree.map((n, i) =>
                                <section key={`${n.name}-${i}`} style={{ backgroundColor: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-2)', backgroundColor: 'var(--bg)' }}>
                                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{pretty(n.name)}</h2>
                                    </div>
                                    <div style={{ padding: '10px 14px 14px' }}>
                                        {n.type === 'file'
                                            ? <FileRow node={n} depth={0} />
                                            : n.children?.map((c, j) => <TreeNode key={`${c.name}-${j}`} node={c} depth={0} onPreview={f => setPreviewFile(f)} />)
                                        }
                                    </div>
                                </section>
                            )
                            : <div style={{ padding: '40px', textAlign: 'center', border: '1.5px dashed var(--border)', borderRadius: 12 }}>
                                <p style={{ fontSize: 14, color: 'var(--text-faint)', fontFamily: "'Inter',sans-serif" }}>
                                    No PDFs yet — drop files into <code>public/{slug}/</code>
                                </p>
                            </div>
                )}
            </main>
            <AnimatePresence>
                {previewFile && <PreviewModal url={previewFile.previewUrl} name={previewFile.name} onClose={() => setPreviewFile(null)} />}
            </AnimatePresence>
        </div>
    );
}
