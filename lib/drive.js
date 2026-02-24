import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// ── In-memory cache (persists across warm serverless invocations) ──
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getDriveClient() {
    let credentials;

    // Method 1: Base64-encoded full JSON (used on Vercel for bulletproof PEM handling)
    if (process.env.GOOGLE_CREDENTIALS_BASE64) {
        try {
            const decoded = Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
            credentials = JSON.parse(decoded);
        } catch (e) {
            console.error('Failed to decode GOOGLE_CREDENTIALS_BASE64:', e.message);
        }
    }

    // Method 2: Individual env vars (used locally with .env.local)
    if (!credentials) {
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            return null;
        }
        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        privateKey = privateKey.replace(/^["']|["']$/g, '').trim();
        if (!privateKey.includes('\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }
        credentials = {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        };
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key,
        },
        scopes: SCOPES,
    });

    return google.drive({ version: 'v3', auth });
}

/**
 * Fetches the folder tree — returns from cache if fresh, otherwise crawls Drive.
 */
export async function getDriveTree(rootFolderId) {
    const drive = getDriveClient();
    if (!drive) return [];
    if (!rootFolderId) return [];

    // Check cache first
    const cached = cache.get(rootFolderId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`Cache HIT for ${rootFolderId} (${cached.tree.length} items)`);
        return cached.tree;
    }

    try {
        console.log('Cache MISS — crawling Drive folder:', rootFolderId);
        const tree = await crawlFolder(drive, rootFolderId);
        console.log(`Built tree with ${tree.length} top-level items`);

        // Store in cache
        cache.set(rootFolderId, { tree, timestamp: Date.now() });

        return tree;
    } catch (error) {
        console.error('Error fetching from Google Drive:', error);
        throw error;
    }
}

/**
 * Crawl a folder — fetches direct children then recurses into subfolders IN PARALLEL.
 */
async function crawlFolder(drive, folderId) {
    let children = [];
    let pageToken = null;

    do {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: "nextPageToken, files(id, name, mimeType)",
            pageSize: 1000,
            pageToken: pageToken,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });
        children = children.concat(res.data.files);
        pageToken = res.data.nextPageToken;
    } while (pageToken);

    // Filter out hidden/system files like .DS_Store and Thumbs.db
    const filteredChildren = children.filter(file => {
        return !file.name.startsWith('.') && file.name !== 'Thumbs.db';
    });

    // Separate folders and files
    const folders = filteredChildren.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
    const files = filteredChildren.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');

    // Crawl all sub-folders IN PARALLEL (huge speed boost)
    const folderNodes = await Promise.all(
        folders.map(async (folder) => {
            const subChildren = await crawlFolder(drive, folder.id);
            return {
                name: folder.name,
                type: 'dir',
                children: subChildren,
            };
        })
    );

    // Build file nodes
    const fileNodes = [];
    for (const file of files) {
        const ext = file.name.toLowerCase();
        const fileNode = {
            name: file.name,
            type: 'file',
            path: `https://drive.google.com/uc?export=download&id=${file.id}`,
        };

        if (ext.endsWith('.pdf')) {
            fileNode.previewUrl = `https://drive.google.com/file/d/${file.id}/preview`;
        } else if (ext.endsWith('.zip')) {
            fileNode.previewUrl = null; // Explicitly set to null for zip files if needed
        }
        // For other file types, previewUrl will be undefined, which is fine.

        fileNodes.push(fileNode);
    }

    // Combine and sort: folders first, then alphabetically
    const nodes = [...folderNodes, ...fileNodes];
    nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    return nodes;
}
