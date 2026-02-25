'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';

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
`,
    "Pyodide specific (Real CPython)": `import sys
import platform
import math

print("Python Version:", sys.version)
print("Platform:", platform.system())
print("Math module test (pi):", math.pi)

# Pyodide supports comprehensions and modern syntax perfectly
squares = [x**2 for x in range(10)]
print("Squares:", squares)
`
};

export default function PythonPlayground() {
    const [code, setCode] = useState(EXAMPLES["Grade Calculator"]);
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [engineStatus, setEngineStatus] = useState("Loading Pyodide...");
    const pyodideRef = useRef(null);

    // Initialize Pyodide
    useEffect(() => {
        const initPyodide = async () => {
            try {
                // Determine if script is already loaded
                if (!window.loadPyodide) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
                    script.async = true;

                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                        document.body.appendChild(script);
                    });
                }

                if (!window.loadPyodide) throw new Error("loadPyodide failed to load.");

                const pyodide = await window.loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
                    stdout: (text) => {
                        setOutput(prev => [...prev, text]);
                    },
                    stderr: (text) => {
                        setOutput(prev => [...prev, "Error: " + text]);
                    },
                    stdin: () => {
                        const result = window.prompt("Python is requesting input:");
                        // Pyodide expects the newline character to be included by the user typing Enter.
                        if (result !== null) {
                            setOutput(prev => [...prev, "> " + result]);
                            return result + "\\n";
                        }
                        return "\\n";
                    }
                });

                pyodideRef.current = pyodide;
                setEngineStatus("Ready");
            } catch (err) {
                console.error(err);
                setEngineStatus("Failed to Load Engine");
                setOutput(["Fatal Error: Could not initialize Python engine (Pyodide). Check console."]);
            }
        };

        if (typeof window !== "undefined") {
            initPyodide();
        }
    }, []);

    const handleRunCode = async () => {
        if (!pyodideRef.current) {
            setOutput(["Engine is not ready yet..."]);
            return;
        }

        setIsRunning(true);
        setOutput([]); // Clear previous

        try {
            // Run the Python code
            await pyodideRef.current.runPythonAsync(code);
        } catch (err) {
            // Exceptions caught natively by Pyodide
            setOutput(prev => [...prev, err.toString()]);
        } finally {
            setIsRunning(false);
        }
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
                            <div className="flex items-center gap-3 text-[var(--text-muted)] text-sm font-medium">
                                <span>Write and execute Paper 2 algorithms directly in the browser via Pyodide.</span>

                                {/* Status Indicator */}
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18181b] border border-[#27272a] shadow-inner text-xs font-bold font-mono tracking-widest uppercase">
                                    <span className={\`w-2 h-2 rounded-full \${engineStatus === "Ready" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : engineStatus === "Failed to Load Engine" ? "bg-rose-500" : "bg-yellow-500 animate-pulse"}\`}></span>
                                {engineStatus === "Ready" ? "CPython Active" : engineStatus}
                            </div>
                        </div>
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
                            disabled={isRunning || !pyodideRef.current}
                            className={\`px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] tracking-widest uppercase text-sm \${isRunning || !pyodideRef.current ? 'bg-[#27272a] text-[#71717a] shadow-none cursor-not-allowed border border-[#3f3f46]' : 'bg-emerald-500 text-white hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(16,185,129,0.5)] border border-emerald-400'}\`}
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
                            <div key={i} className={\`whitespace-pre-wrap \${line.startsWith('Error') ? 'text-rose-400 font-bold' : line.startsWith('>') ? 'text-indigo-300 font-bold' : ''}\`}>
                        {line}
                    </div>
                                ))}
                </div>
            </div>
        </div>

                </div >
            </div >
        </main >
    );
}
