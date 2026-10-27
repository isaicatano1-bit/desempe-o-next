import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createReservationSchema, listReservationsQuerySchema } from '@/features/reservations/schemas/reservation.schema';
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

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest();
    const url = new URL(request.url);
    const query = {
      page: url.searchParams.get('page') ?? '1',
      pageSize: url.searchParams.get('pageSize') ?? '20',
      status: url.searchParams.get('status') ?? undefined,
    };

    const parsed = listReservationsQuerySchema.safeParse(query);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = hasRequiredRole(user, UserRole.ADMIN)
      ? await reservationService.listForAdmin(parsed.data)
      : await reservationService.listForUser(user.id, parsed.data);

    return NextResponse.json({ message: 'Reservations retrieved successfully.', data: result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest();
    const body = await request.json().catch(() => {
      throw new SyntaxError('Malformed JSON.');
    });

    const parsed = createReservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const reservation = await reservationService.create(user.id, parsed.data);

    return NextResponse.json({ message: 'Reservation created successfully.', data: reservation }, { status: 201 });
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
