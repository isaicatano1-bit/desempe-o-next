import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { reservationIdSchema } from '@/features/reservations/schemas/reservation.schema';
import { reservationService } from '@/features/reservations/services/reservation.service';
import { authCookieNames, getAuthenticatedUserFromAccessToken, hasRequiredRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';

async function getUserFromRequest() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    throw new Error('Unauthorized.');
  }

  return getAuthenticatedUserFromAccessToken(accessToken);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest();
    const { id } = await params;
    const parsedId = reservationIdSchema.safeParse(id);

    if (!parsedId.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsedId.error.flatten().fieldErrors }, { status: 400 });
    }

    const reservation = await reservationService.getById(parsedId.data);

    if (!reservation) {
      return NextResponse.json({ message: 'Reservation not found.' }, { status: 404 });
    }

    if (!hasRequiredRole(user, UserRole.ADMIN) && reservation.userId !== user.id) {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    const cancelledReservation = await reservationService.cancel(parsedId.data);

    return NextResponse.json({ message: 'Reservation cancelled successfully.', data: cancelledReservation }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
