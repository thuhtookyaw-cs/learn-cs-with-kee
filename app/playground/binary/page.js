'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

const GAME_SPEED = 1500; // time in ms for a number to drop
const TARGET_BITS = 4;   // e.g., max number is 15 (1111)

export default function BinaryDropPage() {
    const [started, setStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Current target decimal number user needs to match
    const [targetDecimal, setTargetDecimal] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(100); // Percentage for the visual bar

    // State of the 4 toggleable bits (e.g., [false, false, true, false] = 0010 = 2)
    const [bits, setBits] = useState(Array(TARGET_BITS).fill(false));

    const currentDecimalValue = bits.reduce(
        (acc, bit, idx) => acc + (bit ? Math.pow(2, TARGET_BITS - 1 - idx) : 0),
        0
    );

    useEffect(() => {
        if (!started || gameOver) return;

        // Generate a new drop
        const newTarget = Math.floor(Math.random() * 15) + 1; // 1 to 15
        setTargetDecimal(newTarget);
        setBits(Array(TARGET_BITS).fill(false));
        setTimeRemaining(100);

        // Progress bar interval
        const intervalTime = GAME_SPEED / 100;
        const barTimer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(barTimer);
                    return 0;
                }
                return prev - 1;
            });
        }, intervalTime);

        // Drop timeout
        const dropTimer = setTimeout(() => {
            setGameOver(true);
        }, GAME_SPEED);

        return () => {
            clearInterval(barTimer);
            clearTimeout(dropTimer);
        };
    }, [score, started, gameOver]);

    // Check if they won the current round
    useEffect(() => {
        if (targetDecimal !== null && currentDecimalValue === targetDecimal) {
            setScore(s => s + 1);
        }
    }, [currentDecimalValue, targetDecimal]);

    const handleStart = () => {
        setStarted(true);
        setScore(0);
        setGameOver(false);
        setBits(Array(TARGET_BITS).fill(false));
    };

    const toggleBit = (index) => {
        setBits(prev => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    return (
        <main className="min-h-screen bg-[var(--bg)] flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center pt-20 px-6 pb-12">
                <div className="w-full max-w-2xl">
                    <Link href="/playground" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] mb-8 transition-colors font-medium text-sm no-underline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Playground
                    </Link>

                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col">

                        <AnimatePresence mode="wait">
                            {!started && !gameOver && (
                                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center m-auto">
                                    <div className="text-6xl mb-6">👾</div>
                                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] font-serif">Binary Drop</h1>
                                    <p className="text-[var(--text-muted)] mb-8 max-w-sm mx-auto">
                                        Toggle the bits to match the falling decimal number before it hits the bottom!
                                    </p>
                                    <button onClick={handleStart} className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg tracking-wide tracking-tight">
                                        START GAME
                                    </button>
                                </motion.div>
                            )}

                            {gameOver && (
                                <motion.div key="gameover" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center m-auto">
                                    <h2 className="text-4xl font-black mb-2 text-rose-500 font-sans tracking-tight">GAME OVER</h2>
                                    <p className="text-[var(--text-muted)] mb-8 text-lg">Final Score: <strong className="text-[var(--text)] text-2xl">{score}</strong></p>
                                    <button onClick={handleStart} className="px-8 py-3.5 bg-[var(--text)] text-[var(--bg)] font-bold rounded-full hover:opacity-90 transition-all text-lg">
                                        PLAY AGAIN
                                    </button>
                                </motion.div>
                            )}

                            {started && !gameOver && (
                                <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">

                                    {/* Game Header */}
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="text-lg font-bold text-[var(--text)]">Score: {score}</div>
                                        <div className="text-sm px-3 py-1 bg-[var(--border)] rounded-full text-[var(--text-muted)] font-mono">
                                            Denary to Binary
                                        </div>
                                    </div>

                                    {/* Falling Target Area */}
                                    <div className="relative flex-1 bg-[var(--bg)] rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col items-center">
                                        {/* The falling number */}
                                        <motion.div
                                            key={targetDecimal}
                                            initial={{ y: -50, opacity: 0 }}
                                            animate={{ y: `400%`, opacity: 1 }}
                                            transition={{ duration: GAME_SPEED / 1000, ease: "linear" }}
                                            className="absolute top-0 text-6xl font-black text-[var(--accent)] font-sans mt-4"
                                            style={{ textShadow: '0 0 20px rgba(16,185,129,0.3)' }}
                                        >
                                            {targetDecimal}
                                        </motion.div>

                                        {/* Lava floor (Visual indicator of time) */}
                                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[var(--border)]">
                                            <div
                                                className="h-full bg-rose-500 transition-all duration-75"
                                                style={{ width: `${timeRemaining}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Interactive Bit Toggles */}
                                    <div className="mt-8">
                                        <div className="flex justify-center gap-3 sm:gap-6 mb-4">
                                            {bits.map((bit, idx) => {
                                                const bitValue = Math.pow(2, TARGET_BITS - 1 - idx);
                                                return (
                                                    <div key={idx} className="flex flex-col items-center gap-2">
                                                        {/* Place Value Label */}
                                                        <span className="text-[var(--text-faint)] text-xs font-mono font-bold">{bitValue}</span>
                                                        {/* Toggle Button */}
                                                        <button
                                                            className={`w-14 h-16 sm:w-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl font-mono font-bold transition-all duration-150 active:scale-95 ${bit
                                                                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border-transparent'
                                                                : 'bg-[var(--bg)] border-2 border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                                                                }`}
                                                            onClick={() => toggleBit(idx)}
                                                        >
                                                            {bit ? '1' : '0'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Total Visualizer */}
                                        <div className="text-center font-mono text-xl mt-6 pb-2">
                                            Current Total:{' '}
                                            <span className={`font-black ${currentDecimalValue === targetDecimal ? 'text-emerald-500' : 'text-[var(--text)]'}`}>
                                                {currentDecimalValue}
                                            </span>
                                        </div>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </main>
    );
}
