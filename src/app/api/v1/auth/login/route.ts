import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { loginSchema } from '@/features/auth/schemas/auth.schema';
import { AuthError, authService } from '@/features/auth/services/auth.service';
import { authCookieNames } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => {
      throw new SyntaxError('Malformed JSON.');
    });

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Validation failed.',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await authService.login(parsed.data);
    const cookieStore = await cookies();

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
        message: 'Login successful.',
        role: result.user.role,
        user: result.user,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: 'Malformed JSON body.',
        },
        { status: 400 },
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        message: 'Internal server error.',
      },
      { status: 500 },
    );
  }
}
