import { NextResponse } from 'next/server';
import { adminConfigured, makeSession, sameOrigin, sessionCookie, validPassword } from '@/lib/admin-auth';

export async function POST(request) {
  if (!sameOrigin(request)) return new Response('Invalid origin', { status: 403 });
  const returnUrl = new URL('/admin/', request.headers.get('origin') || request.headers.get('referer') || request.url);
  const form = await request.formData();
  const action = form.get('action');
  if (action === 'logout') {
    const response = NextResponse.redirect(returnUrl, 303);
    response.cookies.set({ ...sessionCookie(''), maxAge: 0 });
    return response;
  }
  if (!adminConfigured() || !validPassword(form.get('password'))) {
    return NextResponse.redirect(new URL('/admin/?error=signin', returnUrl), 303);
  }
  const response = NextResponse.redirect(returnUrl, 303);
  response.cookies.set(sessionCookie(makeSession()));
  return response;
}
