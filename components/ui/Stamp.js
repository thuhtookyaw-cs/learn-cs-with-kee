export default function Stamp({ children, color = 'indigo' }) {
    const colorMap = {
        'indigo': 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        'emerald': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        'cyan': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    };
    const colorClass = colorMap[color] || colorMap['indigo'];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-[10px] sm:text-xs font-bold tracking-widest uppercase font-sans ${colorClass}`}>
            {children}
        </span>
    );
}
