import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authCookieNames } from '@/lib/auth/session';
import { verifyAccessToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db/prisma';

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    if (!payload.sub) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
