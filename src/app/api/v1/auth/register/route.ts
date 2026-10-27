import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { registerSchema } from '@/features/auth/schemas/auth.schema';
import { AuthError, authService } from '@/features/auth/services/auth.service';
import { authCookieNames } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => {
      throw new SyntaxError('Malformed JSON.');
    });

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Validation failed.',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const registeredUser = await authService.register(parsed.data);
    const session = await authService.login({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    const cookieStore = await cookies();

    cookieStore.set(authCookieNames.accessToken, session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    cookieStore.set(authCookieNames.refreshToken, session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json(
      {
        message: 'User registered successfully.',
        role: session.user.role,
        user: session.user,
      },
      { status: 201 },
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
