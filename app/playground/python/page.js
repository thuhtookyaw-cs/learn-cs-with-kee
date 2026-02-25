'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';

// Next.js dynamic import for Monaco to prevent SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const EXAMPLES = {
    "Grade Calculator": `# Welcome to the IGCSE Python Playground!
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
`,
    "Fibonacci Sequence": `def fibonacci(n):
    sequence = [0, 1]
    while len(sequence) < n:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

print("First 10 Fibonacci numbers:")
print(fibonacci(10))
`,
    "Bubble Sort": `def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
print("Sorted array:", bubble_sort(numbers))
`,
    "Interactive Input": `# This example uses the input() function!
# When you run this, watch for the browser prompt.

name = input("What is your name? ")
try:
    age = int(input(f"Hello {name}, how old are you? "))
    year = 2026 - age
    print(f"Awesome! You were born around {year}.")
except ValueError:
    print("That doesn't look like a valid number for age!")
`
};

export default function PythonPlayground() {
    const [code, setCode] = useState(EXAMPLES["Grade Calculator"]);
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
            },
            inputfun: function (promptText) {
                return new Promise((resolve) => {
                    // Delay slightly so UI renders before blocking prompt
                    setTimeout(() => {
                        const answer = window.prompt(promptText || "Input requested:");
                        if (answer !== null) {
                            // Optionally echo the input to the console
                            setOutput(prev => {
                                const newLog = [...prev];
                                if (newLog.length > 0 && newLog[newLog.length - 1] !== '') {
                                    newLog[newLog.length - 1] += (promptText || "") + answer;
                                } else {
                                    newLog.push((promptText || "") + answer);
                                }
                                newLog.push(''); // new line after input
                                return newLog;
                            });
                        }
                        resolve(answer || "");
                    }, 50);
                });
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

                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-sans tracking-tight mb-2 drop-shadow-sm">Python Web Editor</h1>
                            <p className="text-[var(--text-muted)] text-sm font-medium">Write and execute Paper 2 algorithms directly in the browser. Supports <code className="bg-[var(--bg-card)] px-1.5 py-0.5 rounded text-indigo-400 border border-[var(--border)]">input()</code> via prompts!</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Example Selector */}
                            <select
                                className="px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] text-sm font-semibold outline-none hover:border-indigo-500/50 transition-colors shadow-sm appearance-none cursor-pointer pr-10 relative"
                                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
                                onChange={(e) => {
                                    if (e.target.value && EXAMPLES[e.target.value]) {
                                        setCode(EXAMPLES[e.target.value]);
                                        setOutput([]);
                                    }
                                }}
                            >
                                <option value="" disabled selected>Load Example...</option>
                                {Object.keys(EXAMPLES).map(ex => <option key={ex} value={ex}>{ex}</option>)}
                            </select>

                            {/* Run Button */}
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || !skulptLoaded}
                                className={`px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] tracking-widest uppercase text-sm ${isRunning || !skulptLoaded ? 'bg-[#27272a] text-[#71717a] shadow-none cursor-not-allowed border border-[#3f3f46]' : 'bg-emerald-500 text-white hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] border border-emerald-400'}`}
                            >
                                {isRunning ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
                                        EXECUTING
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8V4z" /></svg>
                                        RUN CODE
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#1e1e1e] border border-[#3f3f46] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
                        {/* Editor View */}
                        <div className="flex-1 md:border-r border-[#3f3f46] bg-[#1e1e1e] flex flex-col">
                            {/* Mac Window Header */}
                            <div className="bg-[#2d2d30] px-4 py-2 flex items-center gap-4 border-b border-[#3f3f46] select-none">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"></div>
                                </div>
                                <div className="flex items-center gap-2 bg-[#1e1e1e] px-4 py-1 rounded-md border border-[#3f3f46]">
                                    <span className="text-yellow-400 text-sm">🐍</span>
                                    <span className="text-xs font-mono text-gray-300">script.py</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full pt-2">
                                <MonacoEditor
                                    height="100%"
                                    language="python"
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(value) => setCode(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 15,
                                        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                                        padding: { top: 16, bottom: 16 },
                                        scrollBeyondLastLine: false,
                                        smoothScrolling: true,
                                        cursorBlinking: 'smooth',
                                        fontLigatures: true,
                                        renderLineHighlight: "all",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Console Output */}
                        <div className="w-full md:w-1/3 min-h-[250px] bg-[#0c0c0c] flex flex-col relative overflow-hidden group">
                            {/* Terminal scanline effect overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none opacity-20"></div>

                            <div className="bg-[#18181b] px-4 py-2.5 flex items-center justify-between border-b border-[#27272a] z-20">
                                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-black flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Console Output
                                </span>
                                <button onClick={() => setOutput([])} className="text-xs text-gray-400 hover:text-white transition-colors bg-[#27272a] px-3 py-1 rounded-md font-medium border border-[#3f3f46]">Clear</button>
                            </div>

                            <div className="p-5 font-mono text-[13px] text-gray-300 overflow-y-auto flex-1 z-20 leading-relaxed shadow-inner">
                                {output.length === 0 && !isRunning && (
                                    <span className="text-gray-500 italic">Ready for execution. Watch this space for outputs...</span>
                                )}
                                {output.map((line, i) => (
                                    <div key={i} className={`whitespace-pre-wrap ${line.startsWith('Error') ? 'text-rose-400 font-bold' : ''}`}>
                                        {line === '' ? <br /> : line}
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
