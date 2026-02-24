import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Decode credentials
        let credentials;
        if (process.env.GOOGLE_CREDENTIALS_BASE64) {
            const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
            credentials = JSON.parse(decoded);
        }

        if (!credentials) {
            return NextResponse.json({ error: 'No credentials found' });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        const csFolderId = process.env.DRIVE_CS_FOLDER_ID;
        const ictFolderId = process.env.DRIVE_ICT_FOLDER_ID;

        // Try to directly access the CS folder
        let csFolderInfo = null;
        try {
            const res = await drive.files.get({
                fileId: csFolderId,
                fields: 'id, name, mimeType, shared',
                supportsAllDrives: true,
            });
            csFolderInfo = res.data;
        } catch (e) {
            csFolderInfo = { error: e.message };
        }

        // Try to list children of CS folder
        let csChildren = null;
        try {
            const res = await drive.files.list({
                q: `'${csFolderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType)',
                pageSize: 5,
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
            });
            csChildren = res.data.files;
        } catch (e) {
            csChildren = { error: e.message };
        }

        return NextResponse.json({
            client_email: credentials.client_email,
            cs_folder_id: csFolderId,
            ict_folder_id: ictFolderId,
            cs_folder_info: csFolderInfo,
            cs_children: csChildren,
        });
    } catch (err) {
        return NextResponse.json({ error: err.message });
    }
}
