import { NextResponse } from 'next/server';
import { getDriveTree } from '@/lib/drive';

export const dynamic = 'force-dynamic';

export async function GET() {
    const csFolderId = process.env.DRIVE_CS_FOLDER_ID;
    const ictFolderId = process.env.DRIVE_ICT_FOLDER_ID;

    if (!csFolderId || !ictFolderId) {
        return NextResponse.json({
            error: 'Google Drive folder IDs are missing',
            cs: [], ict: []
        }, { status: 400 });
    }

    const hasCredentials = process.env.GOOGLE_CREDENTIALS_BASE64 ||
        (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);

    if (!hasCredentials) {
        return NextResponse.json({
            error: 'Google authentication credentials are missing in production environment',
            cs: [], ict: []
        }, { status: 400 });
    }

    try {
        const [cs, ict] = await Promise.all([
            getDriveTree(csFolderId),
            getDriveTree(ictFolderId)
        ]);

        return NextResponse.json({ cs, ict });
    } catch (error) {
        console.error('Files API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
