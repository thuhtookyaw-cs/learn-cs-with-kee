'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

// Very basic logic gate implementations
const GATES = {
    AND: (a, b) => a && b,
    OR: (a, b) => a || b,
    NOT: (a) => !a,
    XOR: (a, b) => a !== b,
};

export default function LogicPlayground() {
    // In a full implementation, you'd use a robust node-graph state.
    // For this IGCSE mini-playground, we'll hardcode a 2-input, 1-gate, 1-output circuit for simplicity.
    const [inputA, setInputA] = useState(0);
    const [inputB, setInputB] = useState(0);
    const [selectedGate, setSelectedGate] = useState('AND');

    // Calculate output
    let output = 0;
    if (selectedGate === 'NOT') {
        output = GATES.NOT(inputA) ? 1 : 0;
    } else {
        output = GATES[selectedGate](inputA, inputB) ? 1 : 0;
    }

    return (
        <main className="min-h-screen bg-[var(--bg)] flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center pt-20 px-6 pb-12">
                <div className="w-full max-w-4xl">
                    <Link href="/playground" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] mb-8 transition-colors font-medium text-sm no-underline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Playground
                    </Link>

                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-12">

                        {/* Interactive Circuit Area */}
                        <div className="flex-1 flex items-center justify-center relative min-h-[300px] border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg)]">

                            {/* Wires (SVG) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                                <path d="M 120 100 L 250 150" stroke={inputA ? '#10B981' : 'var(--border)'} strokeWidth="4" fill="none" className="transition-all duration-300" />
                                {selectedGate !== 'NOT' && (
                                    <path d="M 120 200 L 250 150" stroke={inputB ? '#10B981' : 'var(--border)'} strokeWidth="4" fill="none" className="transition-all duration-300" />
                                )}
                                <path d="M 330 150 L 450 150" stroke={output ? '#10B981' : 'var(--border)'} strokeWidth="4" fill="none" className="transition-all duration-300" />
                            </svg>

                            {/* Inputs */}
                            <div className="absolute left-8 z-10">
                                <div className="flex flex-col gap-10">
                                    <button
                                        onClick={() => setInputA(a => a ? 0 : 1)}
                                        className={`relative w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-mono font-bold transition-all shadow-md ${inputA ? 'bg-emerald-500 text-white border-none ring-4 ring-emerald-500/30' : 'bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)]'}`}
                                    >
                                        <div className="absolute -left-6 text-sm font-sans text-[var(--text-muted)]">A</div>
                                        {inputA}
                                    </button>

                                    {selectedGate !== 'NOT' && (
                                        <button
                                            onClick={() => setInputB(b => b ? 0 : 1)}
                                            className={`relative w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-mono font-bold transition-all shadow-md ${inputB ? 'bg-emerald-500 text-white border-none ring-4 ring-emerald-500/30' : 'bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text)]'}`}
                                        >
                                            <div className="absolute -left-6 text-sm font-sans text-[var(--text-muted)]">B</div>
                                            {inputB}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* The Gate */}
                            <motion.div
                                key={selectedGate}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="z-10 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center text-white font-black text-xl tracking-wider select-none"
                            >
                                {selectedGate}
                            </motion.div>

                            {/* Output */}
                            <div className="absolute right-8 z-10 w-16 h-16">
                                <div className={`relative w-full h-full rounded-full flex items-center justify-center text-2xl font-mono font-bold transition-all duration-300 shadow-lg ${output ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110 border-none' : 'bg-[var(--bg-card)] border-2 border-[var(--border)] text-[var(--text-muted)]'}`}>
                                    <div className="absolute -right-6 text-sm text-[var(--text-muted)] font-sans">Q</div>
                                    {output}
                                </div>
                            </div>

                        </div>

                        {/* Controls Panel */}
                        <div className="w-full md:w-64 flex flex-col gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--text)] font-serif mb-2">Logic Gate Setup</h2>
                                <p className="text-[var(--text-muted)] text-sm mb-6">Select a logic gate and toggle the inputs (A and B) to see how the boolean logic resolves to the output (Q).</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Select Gate</label>
                                {Object.keys(GATES).map(gate => (
                                    <button
                                        key={gate}
                                        onClick={() => setSelectedGate(gate)}
                                        className={`px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${selectedGate === gate
                                            ? 'bg-indigo-500 text-white shadow-md'
                                            : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] hover:border-indigo-500'
                                            }`}
                                    >
                                        {gate} Gate
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
