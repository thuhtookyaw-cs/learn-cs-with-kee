'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';

// Next.js dynamic import for Monaco to prevent SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const DEFAULT_CODE = `# Welcome to the IGCSE Python Playground!
# Try writing a simple program below.

def calculate_grade(marks):
    if marks >= 90:
        return "A*"
    elif marks >= 80:
        return "A"
    else:
        return "B"

score = 85
print(f"A score of {score} is a Grade: {calculate_grade(score)}")
`;

export default function PythonPlayground() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [skulptLoaded, setSkulptLoaded] = useState(false);

    // Load Skulpt dynamically on client-side
    useEffect(() => {
        const loadSkulpt = async () => {
            if (window.Sk) {
                setSkulptLoaded(true);
                return;
            }

            const script1 = document.createElement('script');
            script1.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
            script1.async = true;

            const script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js';
            script2.async = true;

            script1.onload = () => {
                document.body.appendChild(script2);
            };

            script2.onload = () => {
                setSkulptLoaded(true);
            };

            document.body.appendChild(script1);
        };

        loadSkulpt();
    }, []);

    const handleRunCode = () => {
        if (!skulptLoaded || !window.Sk) {
            setOutput(["Error: Python engine is still loading..."]);
            return;
        }

        setIsRunning(true);
        setOutput([]); // clear previous output

        // Grab Skulpt from the global window object
        const Sk = window.Sk;

        Sk.configure({
            output: function (text) {
                // Skulpt calls this function for every print statement (and sometimes partial prints)
                // We append it to our React state
                setOutput(prev => {
                    // If the text is just a newline from a print block, handle it carefully
                    // to avoid massive spacing
                    if (text === '\\n') {
                        return [...prev, '']; // add empty string which we'll render as a break
                    }

                    // If the last entry exists and isn't a newline separator, append to it
                    // Otherwise add a new entry
                    if (prev.length > 0 && prev[prev.length - 1] !== '') {
                        const newArr = [...prev];
                        newArr[newArr.length - 1] += text;
                        return newArr;
                    } else {
                        return [...prev, text];
                    }
                });
            },
            read: function (x) {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                    throw "File not found: '" + x + "'";
                return Sk.builtinFiles["files"][x];
            }
        });

        // Run the code async
        const myPromise = Sk.misceval.asyncToPromise(function () {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        });

        myPromise.then(function (mod) {
            setIsRunning(false);
        },
            function (err) {
                setOutput(prev => [...prev, err.toString()]);
                setIsRunning(false);
            });
    };

    return (
        <main className="min-h-screen bg-[var(--bg)] flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center pt-20 px-6 pb-12">
                <div className="w-full max-w-6xl flex flex-col h-[80vh]">
                    <Link href="/playground" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors font-medium text-sm w-fit no-underline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Playground
                    </Link>

                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text)] font-serif mb-1">Python Web Editor</h1>
                            <p className="text-[var(--text-muted)] text-sm">Write and execute Paper 2 algorithms in the browser via Skulpt.</p>
                        </div>
                        <button
                            onClick={handleRunCode}
                            disabled={isRunning || !skulptLoaded}
                            className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${isRunning || !skulptLoaded ? 'bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed' : 'bg-green-500 text-white hover:-translate-y-0.5 hover:shadow-md hover:bg-green-400'}`}
                        >
                            {isRunning ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
                                    Running...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                                    Run Code
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                        {/* Editor View */}
                        <div className="flex-1 md:border-r border-[var(--border)] bg-[#1e1e1e]">
                            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-[#1e1e1e]">
                                <span className="text-yellow-400">🐍</span>
                                <span className="text-xs font-mono text-gray-300">main.py</span>
                            </div>
                            <div className="h-[calc(100%-40px)] w-full">
                                <MonacoEditor
                                    height="100%"
                                    language="python"
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                                        padding: { top: 16 },
                                        scrollBeyondLastLine: false,
                                        smoothScrolling: true,
                                        cursorBlinking: 'smooth',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Console Output */}
                        <div className="w-full md:w-1/3 min-h-[200px] bg-[#0c0c0c] flex flex-col">
                            <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-[#0c0c0c]">
                                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">Terminal Output</span>
                                <button onClick={() => setOutput([])} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Clear</button>
                            </div>
                            <div className="p-4 font-mono text-sm text-gray-300 overflow-y-auto flex-1 h-[calc(100%-40px)]">
                                {output.length === 0 && !isRunning && (
                                    <span className="text-gray-600 italic">No output yet. Click 'Run Code' to execute.</span>
                                )}
                                {output.map((line, i) => (
                                    <div key={i} className={`whitespace-pre-wrap ${line.startsWith('Error') ? 'text-red-400' : ''}`}>
                                        {line}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
