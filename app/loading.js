export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-var(--bg) backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                <span className="text-sm font-medium text-var(--text-muted) tracking-widest uppercase">Loading...</span>
            </div>
        </div>
    );
}
