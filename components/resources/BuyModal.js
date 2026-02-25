'use client';
import { useState, useEffect } from 'react';
import { TUTOR } from '@/lib/data';

export default function BuyModal({ isOpen, onClose, resource }) {
    const [showToast, setShowToast] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('');

    // Handle initial level selection
    useEffect(() => {
        if (resource?.levels?.length > 0) {
            setSelectedLevel(resource.levels[0]);
        } else {
            setSelectedLevel('');
        }
    }, [resource]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !resource) return null;

    const handleTelegramClick = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    const telegramMsg = encodeURIComponent(
        `I paid for ${resource.title}${selectedLevel ? ` (${selectedLevel})` : ''}. Here is my screenshot.`
    );
    const username = TUTOR.telegramUsername.replace('@', '');
    const telegramUrl = `https://t.me/${username}?text=${telegramMsg}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-24">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative bg-dark-card border border-dark-border rounded-2xl shadow-paper-hover w-full max-w-md overflow-hidden animate-slide-down flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-dark-border bg-dark-card2/50">
                    <h3 className="text-xl font-bold text-parchment2">
                        Unlock Resource
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-ink-muted hover:text-parchment2 transition-colors rounded-full hover:bg-dark-border/50"
                        aria-label="Close modal"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-sm text-indigo-300 font-medium mb-1">Retrieving access for:</p>
                        <p className="text-lg font-bold text-indigo-100">{resource.title}</p>
                        {resource.levels && resource.levels.length > 0 && (
                            <div className="mt-3">
                                <label className="block text-xs font-semibold text-indigo-200 uppercase tracking-wide mb-1">
                                    Select Level
                                </label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="w-full bg-dark-card border border-indigo-500/30 text-parchment2 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                                >
                                    {resource.levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-parchment2 uppercase tracking-wide">
                                    <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                    Pay via KPay
                                </h4>
                                <img src="/kpay.png" alt="KPay Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-md" />
                            </div>
                            <div className="bg-dark-card2 rounded-xl p-4 border border-dark-border space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-ink-muted">Name:</span>
                                    <span className="font-medium text-parchment2 select-all">Eaint Hmue Pyae</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-ink-muted">Phone:</span>
                                    <span className="font-bold text-emerald-400 select-all tracking-wider">09 792 177 351</span>
                                </div>
                                <div className="flex justify-between pt-2 mt-2 border-t border-dark-border border-dashed">
                                    <span className="text-ink-muted">Amount:</span>
                                    <span className="font-bold text-parchment2">{resource.price} MMK</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-parchment2 uppercase tracking-wide mb-3">
                                <span className="bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Send Screenshot
                            </h4>
                            <p className="text-sm text-ink-muted mb-4">
                                Take a screenshot of your successful transaction and send it via Telegram.
                            </p>

                            <a
                                href={telegramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleTelegramClick}
                                className="w-full flex items-center justify-center gap-2 bg-[#2AABEE] hover:bg-[#229ED9] text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                                Send Screenshot on Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] w-[90vw] max-w-md bg-emerald-500 text-white px-4 py-3 sm:px-6 rounded-2xl sm:rounded-full shadow-lg font-medium text-sm flex items-start sm:items-center gap-3 animate-fade-in border border-emerald-400 text-left sm:text-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 sm:mt-0">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>After sending the screenshot, you'll receive your file shortly!</span>
                </div>
            )}
        </div>
    );
}
