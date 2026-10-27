import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { listReservationsQuerySchema } from '@/features/reservations/schemas/reservation.schema';
import { reservationService } from '@/features/reservations/services/reservation.service';
import { authCookieNames, getAuthenticatedUserFromAccessToken } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const user = await getAuthenticatedUserFromAccessToken(accessToken);
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

    const result = await reservationService.listForUser(user.id, parsed.data);

    return NextResponse.json({ message: 'User reservations retrieved successfully.', data: result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
