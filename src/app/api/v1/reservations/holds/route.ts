import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createReservationSchema } from '@/features/reservations/schemas/reservation.schema';
import { createHoldForUser } from '@/features/reservations/services/reservation-hold.service';
import { authCookieNames, getAuthenticatedUserFromAccessToken } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const user = await getAuthenticatedUserFromAccessToken(accessToken);
    const body = await request.json().catch(() => {
      throw new SyntaxError('Malformed JSON.');
    });

    const parsed = createReservationSchema.safeParse({ ...body, type: 'HOLD' });

    if (!parsed.success) {
      return NextResponse.json({ message: 'Validation failed.', errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const hold = await createHoldForUser(user.id, {
      spaceId: parsed.data.spaceId,
      startAt: parsed.data.startAt,
      endAt: parsed.data.endAt,
      idempotencyKey: parsed.data.idempotencyKey,
      holdDurationMinutes: parsed.data.holdDurationMinutes,
    });

    return NextResponse.json({ message: 'Reservation hold created successfully.', data: hold }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Malformed JSON body.' }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'Unauthorized.') {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
