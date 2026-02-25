'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import confetti from 'canvas-confetti';

import { getRandomQuestions } from '@/lib/quiz-data';

export default function QuizPage() {
    const [started, setStarted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [questions, setQuestions] = useState([]);

    const question = questions[currentIndex] || null;

    const handleStart = () => {
        setQuestions(getRandomQuestions(10)); // Pick 10 random questions per run
        setStarted(true);
        setCurrentIndex(0);
        setScore(0);
        setShowResults(false);
    };

    const handleAnswer = (option) => {
        if (selectedAnswer) return; // Prevent double clicks
        setSelectedAnswer(option);

        const isCorrect = option === question.answer;
        if (isCorrect) setScore(s => s + 1);

        setTimeout(() => {
            setSelectedAnswer(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setShowResults(true);
                if (score + (isCorrect ? 1 : 0) === questions.length) {
                    triggerConfetti();
                }
            }
        }, 1000);
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
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

                    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden min-h-[400px] flex flex-col justify-center">

                        <AnimatePresence mode="wait">
                            {!started ? (
                                <motion.div
                                    key="start"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center"
                                >
                                    <div className="text-5xl mb-6">🎯</div>
                                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] font-serif">IGCSE CS Mini Quiz</h1>
                                    <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto leading-relaxed">
                                        Test your knowledge on absolute fundamentals like Logic Gates, Number Systems, and Architecture.
                                    </p>
                                    <button onClick={handleStart} className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg">
                                        Start Quiz
                                    </button>
                                </motion.div>
                            ) : showResults ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="text-6xl mb-6">{score === questions.length ? '🏆' : score > (questions.length / 2) ? '👍' : '📚'}</div>
                                    <h2 className="text-3xl font-bold mb-2 text-[var(--text)] font-serif">Quiz Complete!</h2>
                                    <p className="text-xl text-[var(--text-muted)] mb-8">
                                        You scored <strong className="text-[var(--accent)] font-bold">{score}</strong> out of {questions.length}.
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={handleStart} className="px-6 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold rounded-full hover:bg-[var(--border)] transition-colors">
                                            Try Again
                                        </button>
                                        <Link href="/playground" className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold rounded-full hover:shadow-lg transition-all no-underline">
                                            More Tools
                                        </Link>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full"
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-sm font-semibold text-[var(--text-muted)] tracking-wider uppercase">Question {currentIndex + 1} of {questions.length}</span>
                                        <span className="text-sm font-bold text-[var(--text)] bg-[var(--bg)] px-3 py-1 rounded-full border border-[var(--border)]">Score: {score}</span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-8 leading-tight">
                                        {question.q}
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {question.options.map((opt) => {
                                            const isSelected = selectedAnswer === opt;
                                            const isCorrect = opt === question.answer;
                                            let btnStateClass = 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]';

                                            if (selectedAnswer) {
                                                if (isSelected) {
                                                    btnStateClass = isCorrect
                                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                                                        : 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 font-bold';
                                                } else if (isCorrect) {
                                                    // Reveal correct answer if they got it wrong
                                                    btnStateClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 border-dashed';
                                                } else {
                                                    btnStateClass = 'bg-[var(--bg)] border-[var(--border)] text-[var(--text-faint)] opacity-50';
                                                }
                                            }

                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleAnswer(opt)}
                                                    disabled={!!selectedAnswer}
                                                    className={`p-5 rounded-2xl border-2 text-left text-lg font-medium transition-all duration-200 ${btnStateClass}`}
                                                >
                                                    {opt}
                                                    {isSelected && isCorrect && <span className="float-right">✓</span>}
                                                    {isSelected && !isCorrect && <span className="float-right">✗</span>}
                                                </button>
                                            );
                                        })}
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
