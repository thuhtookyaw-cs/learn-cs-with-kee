'use client';

export default function ResourceCard({ resource, onBuyClick }) {
    const isFree = resource.price === 0 || resource.price === 'Free';

    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-6 transition-all duration-300 hover:shadow-paper-hover hover:-translate-y-1 hover:border-[var(--accent)]">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Sale Badge */}
            {resource.originalPrice && (
                <div className="absolute -right-8 top-5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] uppercase font-bold py-1 w-32 text-center transform rotate-45 shadow-lg z-20 tracking-widest">
                    SALE
                </div>
            )}

            <div className="relative z-10 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {resource.title}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${isFree ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        {isFree ? 'Free' : 'Premium'}
                    </span>
                </div>

                <p className="text-sm text-[var(--text-muted)] mb-6 line-clamp-3">
                    {resource.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags?.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded-md bg-[var(--bg-card-2)] text-[var(--text-muted)] border border-[var(--border)]">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="relative z-10 mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Price</span>
                    <div className="flex items-center gap-2">
                        {resource.originalPrice && (
                            <span className="text-sm line-through text-[var(--text-faint)]">
                                {resource.originalPrice}
                            </span>
                        )}
                        <span className="text-lg font-bold text-[var(--text)]">
                            {isFree ? 'Free' : `${resource.price} MMK`}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onBuyClick(resource)}
                    className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${isFree
                        ? 'bg-[var(--text)] text-[var(--bg)] hover:opacity-90 hover:shadow-md'
                        : 'bg-[var(--accent)] text-white hover:opacity-90 hover:shadow-[var(--accent-soft)]'
                        }`}
                >
                    {isFree ? 'Download PDF' : 'Buy Now'}
                </button>
            </div>
        </div>
    );
}
