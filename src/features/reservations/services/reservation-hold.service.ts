import { Prisma } from '@prisma/client';

import { createReservationSchema } from '@/features/reservations/schemas/reservation.schema';
import { prisma } from '@/lib/db/prisma';
import { getReservationHoldDurationMinutes } from '@/lib/config/reservation-hold';

export type ReservationHoldInput = {
  spaceId: string;
  startAt: Date;
  endAt: Date;
  idempotencyKey?: string;
  holdDurationMinutes?: number;
};

function hasSameInterval(a: { spaceId: string; startAt: Date; endAt: Date }, b: { spaceId: string; startAt: Date; endAt: Date }) {
  return a.spaceId === b.spaceId
    && a.startAt.getTime() === b.startAt.getTime()
    && a.endAt.getTime() === b.endAt.getTime();
}

async function withLockedSpace<T>(spaceId: string, callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT id FROM "Space" WHERE id = ${spaceId} FOR UPDATE`;
    return callback(tx);
  });
}

async function findBlockingReservation(tx: Prisma.TransactionClient, spaceId: string, startAt: Date, endAt: Date, excludeReservationId?: string) {
  return tx.reservation.findFirst({
    where: {
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
          expiresAt: { gt: new Date() },
          startAt: { lt: endAt },
          endAt: { gt: startAt },
        },
      ],
    },
  });
}

export async function createHoldForUser(userId: string, input: ReservationHoldInput) {
  const parsed = createReservationSchema.safeParse({
    ...input,
    type: 'HOLD',
  });

  if (!parsed.success) {
    throw new Error('Validation failed.');
  }

  const finalKey = parsed.data.idempotencyKey?.trim();
  const holdDurationMinutes = getReservationHoldDurationMinutes(parsed.data.holdDurationMinutes);
  const expiresAt = new Date(parsed.data.startAt.getTime() + holdDurationMinutes * 60 * 1000);

  return withLockedSpace(parsed.data.spaceId, async (tx) => {
    const space = await tx.space.findUnique({
      where: { id: parsed.data.spaceId },
    });

    if (!space || !space.isActive) {
      throw new Error('Selected space is not available.');
    }

    if (finalKey) {
      const existing = await tx.reservation.findFirst({
        where: {
          userId,
          idempotencyKey: finalKey,
        },
      });

      if (existing) {
        if (hasSameInterval(existing, { spaceId: parsed.data.spaceId, startAt: parsed.data.startAt, endAt: parsed.data.endAt })) {
          return existing;
        }

        throw new Error('This idempotency key has already been used for a different reservation request.');
      }
    }

    const conflict = await findBlockingReservation(tx, parsed.data.spaceId, parsed.data.startAt, parsed.data.endAt);

    if (conflict) {
      throw new Error('The selected time slot is already reserved or on temporary hold.');
    }

    try {
      return await tx.reservation.create({
        data: {
          userId,
          spaceId: parsed.data.spaceId,
          startAt: parsed.data.startAt,
          endAt: parsed.data.endAt,
          totalPrice: new Prisma.Decimal('0.00'),
          status: 'IN_PROCESS',
          expiresAt,
          idempotencyKey: finalKey ?? undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('This hold request has already been processed.');
      }

      throw error;
    }
  });
}

export async function confirmHold(userId: string, reservationId: string, adminOverride = false) {
  return withLockedSpaceForReservation(reservationId, async (tx, hold) => {
    if (!hold) {
      throw new Error('Reservation not found.');
    }

    if (hold.status !== 'IN_PROCESS') {
      throw new Error('Only active holds can be confirmed.');
    }

    if (hold.expiresAt && new Date(hold.expiresAt) <= new Date()) {
      throw new Error('This hold has expired and can no longer be confirmed.');
    }

    if (!adminOverride && hold.userId !== userId) {
      throw new Error('Forbidden.');
    }

    const conflict = await findBlockingReservation(tx, hold.spaceId, hold.startAt, hold.endAt, hold.id);

    if (conflict) {
      throw new Error('This interval is no longer available.');
    }

    return tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CONFIRMED',
        expiresAt: null,
      },
    });
  });
}

export async function cancelHold(userId: string, reservationId: string, adminOverride = false) {
  return withLockedSpaceForReservation(reservationId, async (tx, hold) => {
    if (!hold) {
      throw new Error('Reservation not found.');
    }

    if (!adminOverride && hold.userId !== userId) {
      throw new Error('Forbidden.');
    }

    if (hold.status === 'CANCELLED') {
      return hold;
    }

    return tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CANCELLED',
        expiresAt: null,
      },
    });
  });
}

async function withLockedSpaceForReservation<T>(reservationId: string, callback: (tx: Prisma.TransactionClient, hold: Awaited<ReturnType<typeof prisma.reservation.findUnique>> | null) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    const hold = await tx.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!hold) {
      return callback(tx, null);
    }

    await tx.$executeRaw`SELECT id FROM "Space" WHERE id = ${hold.spaceId} FOR UPDATE`;
    return callback(tx, hold);
  });
}
