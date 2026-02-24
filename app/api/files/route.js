import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * Recursively reads a directory and returns a nested tree.
 * Each node is either:
 *   { name, type: 'dir', children: [...] }
 *   { name, type: 'file', path: '/cs/...' }
 */
function readTree(dirPath, publicBase) {
    if (!fs.existsSync(dirPath)) return [];

    return fs
        .readdirSync(dirPath, { withFileTypes: true })
        .map((entry) => {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = '/' + path.relative(publicBase, fullPath).replace(/\\/g, '/');

            if (entry.isDirectory()) {
                return {
                    name: entry.name,
                    type: 'dir',
                    children: readTree(fullPath, publicBase),
                };
            }

            // Expose PDF and ZIP files
            const ext = entry.name.toLowerCase();
            if (ext.endsWith('.pdf') || ext.endsWith('.zip')) {
                return {
                    name: entry.name,
                    type: 'file',
                    path: relativePath,
                };
            }

            return null;
        })
        .filter(Boolean); // strip nulls (non-PDF files)
}

export async function GET() {
    const publicBase = path.join(process.cwd(), 'public');

    const cs = readTree(path.join(publicBase, 'cs'), publicBase);
    const ict = readTree(path.join(publicBase, 'ict'), publicBase);

    return NextResponse.json({ cs, ict });
}
