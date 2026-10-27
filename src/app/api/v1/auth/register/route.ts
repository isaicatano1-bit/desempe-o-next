import { NextResponse } from 'next/server';

import { registerSchema } from '@/features/auth/schemas/auth.schema';
import { AuthError, authService } from '@/features/auth/services/auth.service';

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

    const user = await authService.register(parsed.data);

    return NextResponse.json(
      {
        message: 'User registered successfully.',
        user,
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
