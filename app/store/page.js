'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import ResourceCard from '@/components/resources/ResourceCard';
import BuyModal from '@/components/resources/BuyModal';
import { TUTOR } from '@/lib/data';

// Mock Data (Replace with real data or keep as MVP)
const MOCK_RESOURCES = [
    {
        id: 'free-sample',
        title: 'Free Sample Exam Paper (Edexcel IGCSE CS)',
        description: 'A complete, free sample IGCSE Computer Science exam style question paper. Perfect for testing your knowledge.',
        tags: ['Exam Paper', 'Free', 'CS'],
        price: 0,
        type: 'free',
        fileUrl: '/CSC1WT001A.pdf'
    },
    {
        id: 5,
        title: '1 Sample Exam Paper',
        description: 'A single sample IGCSE Computer Science exam style question paper to test your knowledge. Choose your difficulty level.',
        tags: ['Exam Paper', 'CS'],
        price: '1,000',
        type: 'paid',
        levels: ['Easy', 'Hard', 'Extreme']
    },
    {
        id: 8,
        title: '5 Papers Bundle',
        description: 'A bundle of 5 sample exam style question papers at a discounted price. Choose your difficulty level.',
        tags: ['Exam Paper', 'Bundle', 'CS'],
        price: '4,000',
        originalPrice: '5,000',
        type: 'paid',
        levels: ['Easy', 'Hard', 'Extreme']
    },
    {
        id: 11,
        title: '10 Papers Bundle',
        description: 'A massive bundle of 10 sample exam style question papers. Choose your difficulty level.',
        tags: ['Exam Paper', 'Bundle', 'CS'],
        price: '8,000',
        originalPrice: '10,000',
        type: 'paid',
        levels: ['Easy', 'Hard', 'Extreme']
    },
    {
        id: 14,
        title: 'Mixed Level 10 Papers Bundle',
        description: 'A mixed bundle of 10 sample exam style question papers (Easy, Hard, and Extreme) to provide a complete challenge.',
        tags: ['Exam Paper', 'Bundle', 'Mixed'],
        price: '8,000',
        originalPrice: '10,000',
        type: 'paid'
    }
];

const CATEGORIES = ['All', 'CS', 'Exam Paper', 'Bundle', 'Theory', 'Hardware', 'Free', 'Mixed'];

export default function ResourcesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);

    // Filtering logic
    const filteredResources = useMemo(() => {
        return MOCK_RESOURCES.filter(res => {
            const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || res.tags.includes(selectedCategory);

            const matchesPrice = priceFilter === 'All'
                ? true
                : priceFilter === 'Free'
                    ? res.price === 0 || res.price === 'Free'
                    : res.price !== 0 && res.price !== 'Free';

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [searchQuery, selectedCategory, priceFilter]);

    // Handlers
    const handleBuyClick = (resource) => {
        if (resource.price === 0 || resource.price === 'Free') {
            const link = document.createElement('a');
            link.href = resource.fileUrl || '/sample-resource.pdf';
            link.download = resource.fileUrl ? resource.fileUrl.split('/').pop() : `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            setSelectedResource(resource);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedResource(null), 300); // Wait for animation
    };

    return (
        <div className="min-h-[100dvh] flex flex-col bg-[var(--bg)] text-[var(--text)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <div className="flex-1 py-12 px-6 sm:px-12 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="relative text-center mb-16 animate-fade-in py-8 sm:py-12 border-b border-[var(--border)] border-dashed">
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-semibold text-[var(--accent)] tracking-wide shadow-sm">
                            <span>📚</span> Premium & Free Resources
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-extrabold font-serif mb-6 text-[var(--text)] tracking-tight">
                            The Ebooks Store
                        </h1>
                        <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
                            Supercharge your IGCSE preparation with our curated collection of complete notes, cheatsheets, and sample exam papers.
                        </p>
                    </div>

                    {/* Search & Filter Section */}
                    <div className="mb-12 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            {/* Search Bar */}
                            <div className="relative w-full sm:w-96 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search resources..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-10 py-3 bg-[var(--bg-input)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:border-[var(--accent)] transition-all shadow-sm"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Price Type Filter */}
                            <div className="flex bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border)] w-full sm:w-auto">
                                {['All', 'Free', 'Premium'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setPriceFilter(type)}
                                        className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${priceFilter === type
                                            ? 'bg-[var(--bg-card)] text-[var(--text)] shadow-sm'
                                            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar justify-start sm:justify-end">
                            {CATEGORIES.map(category => {
                                const isActive = selectedCategory === category;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-300 ${isActive
                                                ? 'text-white'
                                                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                                            }`}
                                    >
                                        <span className="relative z-10">{category}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="store-category-pill"
                                                className="absolute inset-0 bg-[var(--accent)] rounded-full shadow-md shadow-[var(--accent-soft)] z-0"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        {!isActive && (
                                            <div className="absolute inset-0 border border-[var(--border)] rounded-full bg-[var(--bg-card)] z-[-1]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resources Grid */}
                    {filteredResources.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredResources.map(resource => (
                                <motion.div
                                    key={resource.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                                    }}
                                >
                                    <ResourceCard
                                        resource={resource}
                                        onBuyClick={handleBuyClick}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-24 px-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] border-dashed"
                        >
                            <div className="w-20 h-20 mb-6 rounded-full bg-[var(--bg-input)] flex items-center justify-center border border-[var(--border)] shadow-sm">
                                <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text)] mb-3">No matching resources</h3>
                            <p className="text-[var(--text-muted)] text-center max-w-md mb-8">
                                We couldn't find anything matching "{searchQuery}" in our current vault.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 justify-center">
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setPriceFilter('All'); }}
                                    className="px-6 py-3 bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text)] font-medium rounded-xl hover:bg-[var(--bg-card-2)] transition-colors shadow-sm"
                                >
                                    Clear filters
                                </button>
                                <a
                                    href={TUTOR?.telegram || 'https://t.me/kee'} target="_blank" rel="noreferrer"
                                    className="px-6 py-3 bg-[#2AABEE] text-white font-medium rounded-xl hover:bg-[#229ED9] transition-colors shadow-sm"
                                >
                                    Request on Telegram
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Buy Modal */}
            <BuyModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                resource={selectedResource}
            />
        </div>
    );
}
