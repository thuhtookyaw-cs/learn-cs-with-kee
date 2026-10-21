import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = 'kee_admin';
const lifetime = 60 * 60 * 24 * 7;

function equal(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET;
}

function signature(value) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret() && process.env.ADMIN_PASSWORD.length >= 16 && secret().length >= 32);
}

export function validPassword(password) {
  return adminConfigured() && equal(password, process.env.ADMIN_PASSWORD);
}

export function makeSession() {
  const expires = Math.floor(Date.now() / 1000) + lifetime;
  return `${expires}.${signature(String(expires))}`;
}

export function validSession(value) {
  if (!adminConfigured() || typeof value !== 'string') return false;
  const [expires, mac, extra] = value.split('.');
  if (extra || !/^\d{10}$/.test(expires || '') || !mac) return false;
  if (Number(expires) < Date.now() / 1000) return false;
  return equal(mac, signature(expires));
}

export function isAdminRequest(request) {
  return validSession(request.cookies.get(cookieName)?.value);
}

export function sessionCookie(value) {
  return { name: cookieName, value, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/admin', maxAge: lifetime };
}

export function sameOrigin(request) {
  const origin = request.headers.get('origin') || request.headers.get('referer');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!origin || !host) return false;
  try {
    const source = new URL(origin);
    return source.host === host && ['http:', 'https:'].includes(source.protocol);
  } catch { return false; }
}
