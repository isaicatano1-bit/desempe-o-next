import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authCookieNames } from '@/lib/auth/session';
import { authService } from '@/features/auth/services/auth.service';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;

  await authService.logout(refreshToken);

  const clearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  cookieStore.set(authCookieNames.accessToken, '', {
    ...clearOptions,
    maxAge: 0,
  });

  cookieStore.set(authCookieNames.refreshToken, '', {
    ...clearOptions,
    maxAge: 0,
  });

  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'));
}
