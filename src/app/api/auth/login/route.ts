import { NextRequest, NextResponse } from 'next/server';
import { sessionToken, safeEqual } from '../../../../lib/auth-token';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const correctPassword = process.env.DASHBOARD_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: 'DASHBOARD_PASSWORD not configured' },
      { status: 500 }
    );
  }

  if (typeof password !== 'string' || !safeEqual(password, correctPassword)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('gdpr-auth', await sessionToken(correctPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
