import { Prisma, type Reservation, type ReservationStatus } from '@prisma/client';

import {
  countReservations,
  createReservation,
  deleteReservationById,
  findOverlappingReservations,
  findReservationById,
  findReservations,
  updateReservationById,
} from '@/features/reservations/repositories/reservation.repository';
import type {
  CreateReservationInput,
  ListReservationsQuery,
  UpdateReservationInput,
} from '@/features/reservations/schemas/reservation.schema';
import { ReservationAvailabilityError, SLOT_UNAVAILABLE, buildBlockingReservationWhere, expireStaleReservationHolds, findBlockingReservation } from '@/features/reservations/services/availability';
import type { ReservationListResult } from '@/features/reservations/types/reservation';
import { prisma } from '@/lib/db/prisma';

async function withSpaceLock<T>(spaceId: string, callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT id FROM "Space" WHERE id = ${spaceId} FOR UPDATE`;
    return callback(tx);
  });
}

export async function listReservationsForUser(userId: string, input: ListReservationsQuery): Promise<ReservationListResult> {
  const page = input.page;
  const pageSize = input.pageSize;
  const skip = (page - 1) * pageSize;

  const filters = {
    userId,
    status: input.status as ReservationStatus | undefined,
  };

  const [items, totalCount] = await Promise.all([
    findReservations({ skip, take: pageSize, filters }),
    countReservations(filters),
  ]);

  return {
    items,
    totalCount,
    totalPages: totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  };
}

export async function listReservationsAdmin(input: ListReservationsQuery): Promise<ReservationListResult> {
  const page = input.page;
  const pageSize = input.pageSize;
  const skip = (page - 1) * pageSize;

  const filters = {
    status: input.status as ReservationStatus | undefined,
  };

  const [items, totalCount] = await Promise.all([
    findReservations({ skip, take: pageSize, filters }),
    countReservations(filters),
  ]);

  return {
    items,
    totalCount,
    totalPages: totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  };
}

export async function getReservationById(id: string) {
  return findReservationById(id);
}

export async function createReservationRecord(userId: string, input: CreateReservationInput): Promise<Reservation> {
  const durationInMs = input.endAt.getTime() - input.startAt.getTime();
  const durationInHours = durationInMs / (60 * 60 * 1000);

  if (durationInHours <= 0) {
    throw new Error('Reservation length must be greater than zero.');
  }

  return withSpaceLock(input.spaceId, async (tx) => {
    const space = await tx.space.findUnique({
      where: { id: input.spaceId },
    });

    if (!space || !space.isActive) {
      throw new Error('Selected space is not available.');
    }

    await expireStaleReservationHolds(tx, input.spaceId);

    const conflict = await findBlockingReservation(tx, input.spaceId, input.startAt, input.endAt);
    if (conflict) {
      throw new ReservationAvailabilityError(SLOT_UNAVAILABLE, 'The selected time slot is already booked or temporarily held.');
    }

    const totalPrice = new Prisma.Decimal((Number(space.hourlyPrice) * durationInHours).toFixed(2));

    return tx.reservation.create({
      data: {
        userId,
        spaceId: input.spaceId,
        startAt: input.startAt,
        endAt: input.endAt,
        totalPrice,
        status: 'CONFIRMED',
      },
      include: {
        space: true,
        user: true,
      },
    });
  });
}

export async function updateReservationRecord(id: string, input: UpdateReservationInput): Promise<Reservation> {
  const current = await prisma.reservation.findUnique({ where: { id } });

  if (!current) {
    throw new Error('Reservation not found.');
  }

  const updateData: Prisma.ReservationUpdateInput = {};

  if (input.status) {
    updateData.status = input.status as ReservationStatus;
  }

  if (input.startAt) {
    updateData.startAt = input.startAt;
  }

  if (input.endAt) {
    updateData.endAt = input.endAt;
  }

  return withSpaceLock(current.spaceId, async (tx) => {
    const latest = await tx.reservation.findUnique({ where: { id } });

    if (!latest) {
      throw new Error('Reservation not found.');
    }

    const nextStart = input.startAt ?? latest.startAt;
    const nextEnd = input.endAt ?? latest.endAt;
    await expireStaleReservationHolds(tx, latest.spaceId);
    const conflict = await findBlockingReservation(tx, latest.spaceId, nextStart, nextEnd, undefined, latest.id);

    if (conflict) {
      throw new ReservationAvailabilityError(SLOT_UNAVAILABLE, 'This interval is no longer available.');
    }

    return tx.reservation.update({
      where: { id },
      data: updateData,
      include: {
        space: true,
        user: true,
      },
    });
  });
}

export async function deleteReservationRecord(id: string): Promise<Reservation> {
  return deleteReservationById(id);
}

export async function cancelReservationRecord(id: string): Promise<Reservation> {
  const current = await prisma.reservation.findUnique({ where: { id } });

  if (!current) {
    throw new Error('Reservation not found.');
  }

  return withSpaceLock(current.spaceId, async (tx) => {
    const latest = await tx.reservation.findUnique({ where: { id } });

    if (!latest) {
      throw new Error('Reservation not found.');
    }

    return tx.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        space: true,
        user: true,
      },
    });
  });
}

export const reservationService = {
  listForUser: listReservationsForUser,
  listForAdmin: listReservationsAdmin,
  getById: getReservationById,
  create: createReservationRecord,
  update: updateReservationRecord,
  remove: deleteReservationRecord,
  cancel: cancelReservationRecord,
};
