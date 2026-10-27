import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authService } from '@/features/auth/services/auth.service';
import { authCookieNames } from '@/lib/auth/session';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(authCookieNames.refreshToken)?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        message: 'Unauthorized.',
      },
      { status: 401 },
    );
  }

  try {
    const result = await authService.refresh(refreshToken);

    cookieStore.set(authCookieNames.accessToken, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    cookieStore.set(authCookieNames.refreshToken, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json(
      {
        message: 'Refresh successful.',
        user: result.user,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid refresh token.') {
      return NextResponse.json(
        {
          message: 'Unauthorized.',
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        message: 'Unauthorized.',
      },
      { status: 401 },
    );
  }
}
