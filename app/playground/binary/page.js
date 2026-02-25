'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function BinaryDropPage() {
    const [started, setStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Dynamic Game Mechanics
    const [targetDecimal, setTargetDecimal] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(100);
    const [bits, setBits] = useState(Array(4).fill(false));
    const [gameSpeed, setGameSpeed] = useState(5000); // Start dropping over 5 seconds
    const [level, setLevel] = useState(1);

    const targetBits = bits.length;
    const currentDecimalValue = bits.reduce(
        (acc, bit, idx) => acc + (bit ? Math.pow(2, targetBits - 1 - idx) : 0),
        0
    );

    useEffect(() => {
        if (!started || gameOver) return;

        // Level Up Logic: Every 5 points, add a bit (max 8 bits)
        const newBitsCount = Math.min(8, 4 + Math.floor(score / 5));
        const newLevel = newBitsCount - 3; // L1=4-bit, L2=5-bit... L5=8-bit

        // Speed up gradually as score increases. Bottoms out at 1.5 seconds per drop.
        const newSpeed = Math.max(1500, 5000 - (score * 150));

        if (newBitsCount !== targetBits) {
            setBits(Array(newBitsCount).fill(false));
        } else {
            setBits(Array(targetBits).fill(false));
        }

        setLevel(newLevel);
        setGameSpeed(newSpeed);

        const maxVal = (1 << newBitsCount) - 1;
        const newTarget = Math.floor(Math.random() * maxVal) + 1;
        setTargetDecimal(newTarget);
        setTimeRemaining(100);

        const intervalTime = newSpeed / 100;
        const barTimer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(barTimer);
                    return 0;
                }
                return prev - 1;
            });
        }, intervalTime);

        const dropTimer = setTimeout(() => {
            setGameOver(true);
        }, newSpeed);

        return () => {
            clearInterval(barTimer);
            clearTimeout(dropTimer);
        };
    }, [score, started, gameOver, targetBits]); // Safe to include targetBits, won't cause infinite loop because score controls the updates primarily

    // Check Win Condition
    useEffect(() => {
        if (targetDecimal !== null && currentDecimalValue === targetDecimal) {
            setScore(s => s + 1);
        }
    }, [currentDecimalValue, targetDecimal]);

    const handleStart = () => {
        setStarted(true);
        setScore(0);
        setGameOver(false);
        setBits(Array(4).fill(false));
        setLevel(1);
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

            <div className="flex-1 flex flex-col items-center pt-16 px-4 sm:px-6 pb-12">
                <div className="w-full max-w-4xl">
                    <Link href="/playground" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors font-medium text-sm no-underline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Playground
                    </Link>

                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden min-h-[650px] flex flex-col">

                        <AnimatePresence mode="wait">
                            {!started && !gameOver && (
                                <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center m-auto max-w-lg">
                                    <div className="text-7xl mb-6">👾</div>
                                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[var(--text)] font-serif tracking-tight">Binary Drop</h1>
                                    <p className="text-[var(--text-muted)] mb-10 text-lg leading-relaxed">
                                        Toggle the bits to match the falling decimal packet before it crashes into your firewall.
                                        The game automatically speeds up and introduces more bits as your score climbs!
                                    </p>
                                    <button onClick={handleStart} className="px-10 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black rounded-full hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all text-xl tracking-widest uppercase">
                                        START GAME
                                    </button>
                                </motion.div>
                            )}

                            {gameOver && (
                                <motion.div key="gameover" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center m-auto">
                                    <h2 className="text-5xl sm:text-6xl font-black mb-4 text-rose-500 font-sans tracking-tight drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]">SYSTEM FAILURE</h2>
                                    <p className="text-[var(--text-muted)] mb-2 text-xl font-mono">PACKET COLLISION DETECTED.</p>
                                    <p className="text-[var(--text)] mb-12 text-2xl font-medium">Final Score: <strong className="text-emerald-400 text-5xl ml-2">{score}</strong></p>
                                    <button onClick={handleStart} className="px-10 py-4 bg-[var(--bg-card)] hover:bg-[var(--text)] text-[var(--text)] hover:text-[var(--bg)] border border-[var(--border)] font-black rounded-full transition-all text-xl tracking-widest uppercase shadow-lg">
                                        REBOOT
                                    </button>
                                </motion.div>
                            )}

                            {started && !gameOver && (
                                <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">

                                    {/* Game Header */}
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="text-3xl font-black text-[var(--accent)] drop-shadow-md tracking-tight">SCORE: {score}</div>
                                            <div className="hidden sm:flex text-xs px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-black tracking-widest uppercase items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                                                LEVEL {level}
                                            </div>
                                        </div>
                                        <div className="text-sm px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-full text-[var(--text-muted)] font-mono font-bold tracking-widest">
                                            {targetBits}-BIT MODE
                                        </div>
                                    </div>

                                    {/* Falling Target Area */}
                                    <div className="relative flex-1 bg-[var(--bg)] rounded-3xl border-2 border-[var(--border)] shadow-inner overflow-hidden flex flex-col items-center min-h-[300px]">

                                        {/* Retro Grid Background Effect */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

                                        {/* The falling packet */}
                                        <AnimatePresence>
                                            <motion.div
                                                key={targetDecimal}
                                                initial={{ top: "0%", y: "-100%", opacity: 0 }}
                                                animate={{ top: "100%", y: "-100%", opacity: 1 }}
                                                transition={{ duration: gameSpeed / 1000, ease: "linear" }}
                                                style={{ left: "calc(50% - 40px)" }}
                                                className="absolute z-10 flex items-center justify-center min-w-[80px] h-[60px] bg-indigo-500/10 border border-indigo-500/50 backdrop-blur-md rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] will-change-transform"
                                            >
                                                <span className="text-3xl font-black text-indigo-100 font-mono tracking-tighter">
                                                    {targetDecimal}
                                                </span>
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Danger Floor (Visual indicator of time) */}
                                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[var(--bg-card)] z-20 overflow-hidden shadow-inner border-t border-[var(--border)]">
                                            <div
                                                className={`h-full transition-all duration-75 ease-linear ${timeRemaining < 25 ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,1)]' : timeRemaining < 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${timeRemaining}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Interactive Bit Toggles */}
                                    <div className="mt-8 z-30">
                                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
                                            {bits.map((bit, idx) => {
                                                const bitValue = Math.pow(2, targetBits - 1 - idx);
                                                return (
                                                    <div key={idx} className="flex flex-col items-center gap-2">
                                                        {/* Place Value Label */}
                                                        <span className="text-[var(--text-muted)] text-[10px] sm:text-xs font-mono font-bold px-2 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-md shadow-sm">{bitValue}</span>
                                                        {/* Toggle Button */}
                                                        <button
                                                            className={`w-12 h-16 sm:w-16 sm:h-20 rounded-xl flex items-center justify-center text-3xl font-mono font-black transition-all duration-200 active:scale-90 ${bit
                                                                ? 'bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.5),inset_0_4px_4px_rgba(255,255,255,0.3)] border-transparent scale-105'
                                                                : 'bg-[var(--bg)] border-2 border-[var(--border)] text-[var(--text-muted)] hover:border-emerald-500/50 hover:text-emerald-500 shadow-inner hover:-translate-y-1'
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
                                        <div className="flex items-center justify-center gap-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl py-4 px-8 mx-auto w-fit shadow-md">
                                            <span className="text-[var(--text-muted)] font-bold text-sm tracking-widest uppercase">INPUT:</span>
                                            <span className={`font-mono font-black text-4xl sm:text-5xl transition-colors duration-300 ${currentDecimalValue === targetDecimal ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] scale-110' : 'text-[var(--text)]'}`}>
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
