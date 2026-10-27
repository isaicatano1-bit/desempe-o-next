import { Prisma, type Reservation, type ReservationStatus } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';

export type ReservationFilters = {
  userId?: string;
  spaceId?: string;
  status?: ReservationStatus | 'IN_PROCESS';
};

export type ReservationListOptions = {
  skip: number;
  take: number;
  filters?: ReservationFilters;
};

export async function findReservations({ skip, take, filters }: ReservationListOptions) {
  const where: Prisma.ReservationWhereInput = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.spaceId) {
    where.spaceId = filters.spaceId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  return prisma.reservation.findMany({
    where,
    orderBy: { startAt: 'desc' },
    skip,
    take,
    include: {
      space: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function countReservations(filters?: ReservationFilters) {
  const where: Prisma.ReservationWhereInput = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }

  if (filters?.spaceId) {
    where.spaceId = filters.spaceId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  return prisma.reservation.count({ where });
}

export async function findReservationById(id: string) {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      space: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function createReservation(data: Prisma.ReservationCreateInput): Promise<Reservation> {
  return prisma.reservation.create({
    data,
    include: {
      space: true,
      user: true,
    },
  });
}

export async function updateReservationById(id: string, data: Prisma.ReservationUpdateInput): Promise<Reservation> {
  return prisma.reservation.update({
    where: { id },
    data,
    include: {
      space: true,
      user: true,
    },
  });
}

export async function deleteReservationById(id: string): Promise<Reservation> {
  return prisma.reservation.delete({
    where: { id },
    include: {
      space: true,
      user: true,
    },
  });
}

export async function findOverlappingReservations(spaceId: string, startAt: Date, endAt: Date, excludeReservationId?: string) {
  return prisma.reservation.findMany({
    where: {
      spaceId,
      status: { not: 'CANCELLED' },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });
}
