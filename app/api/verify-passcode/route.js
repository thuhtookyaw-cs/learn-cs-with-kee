import { NextResponse } from 'next/server';

export async function POST(req) {
    const { passcode } = await req.json();
    const correct = process.env.SITE_PASSCODE ?? 'kee@2026';
    if (passcode === correct) {
        return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: 'Incorrect passcode.' }, { status: 401 });
}
