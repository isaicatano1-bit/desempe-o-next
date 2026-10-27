import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { confirmationSchema } from '@/features/reservations/schemas/reservation.schema';
import { confirmHold } from '@/features/reservations/services/reservation-hold.service';
import { authCookieNames, getAuthenticatedUserFromAccessToken, hasRequiredRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const user = await getAuthenticatedUserFromAccessToken(accessToken);
    const { id } = await params;
    const parsed = confirmationSchema.safeParse({ holdId: id });

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const isAdmin = hasRequiredRole(user, UserRole.ADMIN);
    const hold = await confirmHold(user.id, parsed.data.holdId, isAdmin);

    return NextResponse.json({ message: 'Reservation hold confirmed successfully.', data: hold }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
