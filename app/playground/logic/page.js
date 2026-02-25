'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
import { ReactFlowProvider } from '@xyflow/react';

// Dynamically import the canvas to prevent Next.js SSR from crashing on window/DOM access
const LogicCanvas = dynamic(() => import('@/components/playground/LogicCanvas'), {
    ssr: false,
    loading: () => (
        <div className="flex-1 w-full flex flex-col items-center justify-center bg-[#0f0f11] text-[var(--text-muted)] animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-mono text-sm tracking-widest">LOADING SIMULATOR ENGINE...</p>
        </div>
    )
});

export default function LogicPlaygroundPage() {
    return (
        <main className="h-screen flex flex-col bg-[var(--bg)] overflow-hidden">
            <Navbar />

            {/* Header / Sub-Nav */}
            <div className="pt-20 px-6 pb-2 w-full flex items-center gap-4">
                <Link href="/playground" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors font-medium text-sm no-underline shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back
                </Link>
                <h1 className="text-xl font-serif font-bold text-[var(--text)] ml-2">Logic Gate Simulator</h1>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 w-full border-t border-[var(--border)] relative">
                <ReactFlowProvider>
                    <LogicCanvas />
                </ReactFlowProvider>
            </div>
        </main>
    );
}
