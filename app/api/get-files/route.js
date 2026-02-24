import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * Recursively read a directory and return a nested structure.
 * Returns an array of { name, type: 'file'|'dir', children?, path? }
 */
function readDirRecursive(dirPath, publicBase) {
    if (!fs.existsSync(dirPath)) return [];

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const result = [];

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(publicBase, fullPath).replace(/\\/g, '/');

        if (entry.isDirectory()) {
            result.push({
                name: entry.name,
                type: 'dir',
                children: readDirRecursive(fullPath, publicBase),
            });
        } else if (entry.name.toLowerCase().endsWith('.pdf')) {
            result.push({
                name: entry.name,
                type: 'file',
                // This path can be used directly as an href for download
                path: '/' + relativePath,
            });
        }
    }

    return result;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject'); // 'CS' or 'ICT'

    if (!subject || !['CS', 'ICT'].includes(subject.toUpperCase())) {
        return NextResponse.json({ error: 'Invalid subject. Use CS or ICT.' }, { status: 400 });
    }

    const subjectKey = subject.toUpperCase();
    const publicDir = path.join(process.cwd(), 'public');
    const subjectDir = path.join(publicDir, 'resources', subjectKey);

    // Scan PastPapers: resources/CS/PastPapers/[Year]/[Season]/files...
    const pastPapersDir = path.join(subjectDir, 'PastPapers');
    const pastPapers = readDirRecursive(pastPapersDir, publicDir);

    // Scan Topical: resources/CS/Topical/[Topic]/files...
    const topicalDir = path.join(subjectDir, 'Topical');
    const topical = readDirRecursive(topicalDir, publicDir);

    // Scan Other: resources/CS/Other/files...
    const otherDir = path.join(subjectDir, 'Other');
    const other = readDirRecursive(otherDir, publicDir);

    return NextResponse.json({
        subject: subjectKey,
        pastPapers,
        topical,
        other,
    });
}
