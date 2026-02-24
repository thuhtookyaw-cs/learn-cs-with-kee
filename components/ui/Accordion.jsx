'use client';

import { useState } from 'react';

function ChevronRightIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function FolderIcon({ open, className }) {
    return open ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="2" y1="13" x2="22" y2="13" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    );
}

function FileRow({ node, depth = 0 }) {
    return (
        <div className="group flex items-center justify-between py-2.5 px-3 my-0.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-150 cursor-pointer border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/40">
            <div className="flex items-center gap-3 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 text-red-400 dark:text-red-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /><polyline points="9 9 10 9" />
                </svg>
                <span className="truncate flex-1 text-left" style={{ color: 'var(--text)' }}>
                    {node.name.replace(/\.(pdf|zip)$/i, '')}
                </span>
            </div>
            <a
                href={node.path}
                download={node.name}
                onClick={e => e.stopPropagation()}
                className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium px-2.5 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 ml-3"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
            </a>
        </div>
    );
}

function AccordionItem({ node, depth = 0 }) {
    const [open, setOpen] = useState(depth === 0 ? false : false);

    if (node.type === 'file') {
        return <FileRow node={node} depth={depth} />;
    }

    const paddingLeft = depth > 0 ? `${depth * 16}px` : '0px';

    return (
        <div className="my-1.5">
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group font-medium ${open
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 border border-transparent'
                    }`}
                style={{ paddingLeft: depth > 0 ? `${12 + depth * 16}px` : undefined, color: open ? undefined : 'var(--text)' }}
            >
                <ChevronRightIcon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''} ${open ? 'text-indigo-500' : 'text-gray-400'}`} />
                <FolderIcon open={open} className={`w-5 h-5 shrink-0 ${open ? 'text-indigo-500 dark:text-indigo-400' : 'text-amber-500 dark:text-amber-400'}`} />
                <span className="font-sans text-sm font-semibold flex-1">{node.name}</span>
                {node.children && (
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0 font-normal" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-muted)' }}>
                        {node.children.filter(c => c.type === 'file').length > 0
                            ? `${node.children.filter(c => c.type === 'file').length} files`
                            : `${node.children.length} folders`
                        }
                    </span>
                )}
            </button>

            {open && node.children && (
                <div className={`mt-1 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 animate-fade-in`}>
                    {node.children.map((child, i) => (
                        <AccordionItem key={`${child.name}-${i}`} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Accordion({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="py-12 text-center rounded-xl border border-dashed" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mx-auto mb-3 opacity-40">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-sm font-sans">No files found. Add PDFs to the resources folder.</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {data.map((node, i) => (
                <AccordionItem key={`${node.name}-${i}`} node={node} />
            ))}
        </div>
    );
}
