import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { reservationIdSchema, updateReservationSchema } from '@/features/reservations/schemas/reservation.schema';
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    return NextResponse.json({ message: 'Reservation retrieved successfully.', data: reservation }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest();
    const { id } = await params;
    const parsedId = reservationIdSchema.safeParse(id);

    if (!parsedId.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsedId.error.flatten().fieldErrors }, { status: 400 });
    }

    const currentReservation = await reservationService.getById(parsedId.data);

    if (!currentReservation) {
      return NextResponse.json({ message: 'Reservation not found.' }, { status: 404 });
    }

    if (!hasRequiredRole(user, UserRole.ADMIN) && currentReservation.userId !== user.id) {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    const body = await request.json().catch(() => {
      throw new SyntaxError('Malformed JSON.');
    });

    const parsed = updateReservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const updatedReservation = await reservationService.update(parsedId.data, parsed.data);

    return NextResponse.json({ message: 'Reservation updated successfully.', data: updatedReservation }, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Malformed JSON body.' }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest();
    const { id } = await params;
    const parsedId = reservationIdSchema.safeParse(id);

    if (!parsedId.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsedId.error.flatten().fieldErrors }, { status: 400 });
    }

    const currentReservation = await reservationService.getById(parsedId.data);

    if (!currentReservation) {
      return NextResponse.json({ message: 'Reservation not found.' }, { status: 404 });
    }

    if (!hasRequiredRole(user, UserRole.ADMIN) && currentReservation.userId !== user.id) {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    const deletedReservation = await reservationService.remove(parsedId.data);

    return NextResponse.json({ message: 'Reservation deleted successfully.', data: deletedReservation }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
