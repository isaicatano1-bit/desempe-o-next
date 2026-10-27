import type { Prisma } from '@prisma/client';

export const SLOT_UNAVAILABLE = 'SLOT_UNAVAILABLE';
export const HOLD_EXPIRED = 'HOLD_EXPIRED';

export class ReservationAvailabilityError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 409,
  ) {
    super(message);
    this.name = 'ReservationAvailabilityError';
  }
}

export function isRangeConflict(startAt: Date, endAt: Date, candidateStart: Date, candidateEnd: Date): boolean {
  return candidateStart.getTime() < endAt.getTime() && candidateEnd.getTime() > startAt.getTime();
}

export function buildBlockingReservationWhere(
  spaceId: string,
  startAt: Date,
  endAt: Date,
  now = new Date(),
  excludeReservationId?: string,
): Prisma.ReservationWhereInput {
  return {
    spaceId,
    ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    OR: [
      {
        status: 'CONFIRMED',
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
      {
        status: 'IN_PROCESS',
        expiresAt: { gt: now },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
    ],
  };
}

export async function expireStaleReservationHolds(
  tx: Prisma.TransactionClient,
  spaceId: string,
  now = new Date(),
): Promise<void> {
  await tx.reservation.updateMany({
    where: {
      spaceId,
      status: 'IN_PROCESS',
      expiresAt: { not: null, lte: now },
    },
    data: {
      expiresAt: now,
    },
  });
}

export async function findBlockingReservation(
  tx: Prisma.TransactionClient,
  spaceId: string,
  startAt: Date,
  endAt: Date,
  now = new Date(),
  excludeReservationId?: string,
) {
  return tx.reservation.findFirst({
    where: buildBlockingReservationWhere(spaceId, startAt, endAt, now, excludeReservationId),
  });
}
