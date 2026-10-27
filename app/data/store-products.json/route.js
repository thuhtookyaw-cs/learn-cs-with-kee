import { NextResponse } from 'next/server';
import { getStoreProducts } from '@/lib/store';

export const dynamic = 'force-static';

export function GET() {
    return NextResponse.json(getStoreProducts());
}
