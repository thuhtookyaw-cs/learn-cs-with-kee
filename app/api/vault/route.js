import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        status: 'online',
        message: 'Passcode verification API is reachable.',
        env_check: {
            has_passcode: !!process.env.SITE_PASSCODE
        }
    });
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { passcode } = body;
        const correct = (process.env.SITE_PASSCODE ?? 'kee@2026').trim();

        if (passcode === correct) {
            return NextResponse.json({ ok: true });
        }
        return NextResponse.json({ ok: false, error: 'Incorrect passcode.' }, { status: 401 });
    } catch (err) {
        console.error('Verify Passcode Error:', err);
        return NextResponse.json({ ok: false, error: 'Internal Server Error', details: err.message }, { status: 500 });
    }
}
