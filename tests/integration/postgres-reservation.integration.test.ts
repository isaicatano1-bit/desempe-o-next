import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaClient, UserRole } from '@prisma/client';

import { createHoldForUser } from '@/features/reservations/services/reservation-hold.service';
import { createReservationRecord } from '@/features/reservations/services/reservation.service';

const hasTestDatabase = Boolean(process.env.TEST_DATABASE_URL);
const prisma = hasTestDatabase ? new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL }) : null;

function buildInterval(base: Date, startHour: number, endHour: number) {
  const start = new Date(base);
  start.setUTCHours(startHour, 0, 0, 0);

  const end = new Date(base);
  end.setUTCHours(endHour, 0, 0, 0);

  return { start, end };
}

describe.runIf(hasTestDatabase)('PostgreSQL reservation integration checks', () => {
  beforeAll(async () => {
    if (!prisma) {
      return;
    }

    await prisma.reservation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.space.deleteMany();
  });

  afterAll(async () => {
    if (!prisma) {
      return;
    }

    await prisma.reservation.deleteMany();
    await prisma.user.deleteMany();
    await prisma.space.deleteMany();
    await prisma.$disconnect();
  });

  it('prevents overlapping confirmed reservations for the same space', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-15T00:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        name: 'User A',
        email: `user-a-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 1',
        description: 'Desk near the window',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '25.00',
        isActive: true,
      },
    });

    const interval = buildInterval(base, 10, 12);
    await createReservationRecord(user.id, {
      spaceId: space.id,
      startAt: interval.start,
      endAt: interval.end,
      type: 'RESERVATION',
    });

    await expect(
      createReservationRecord(user.id, {
        spaceId: space.id,
        startAt: new Date(interval.start.getTime() + 60 * 60 * 1000),
        endAt: new Date(interval.end.getTime() + 60 * 60 * 1000),
        type: 'RESERVATION',
      }),
    ).rejects.toThrow('The selected time slot is already booked.');
  });

  it('prevents overlapping holds for the same space', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-16T00:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        name: 'User B',
        email: `user-b-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 2',
        description: 'Desk in the quiet area',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '20.00',
        isActive: true,
      },
    });

    const interval = buildInterval(base, 13, 14);

    await createHoldForUser(user.id, {
      spaceId: space.id,
      startAt: interval.start,
      endAt: interval.end,
      idempotencyKey: `hold-${Date.now()}`,
    });

    await expect(
      createHoldForUser(user.id, {
        spaceId: space.id,
        startAt: interval.start,
        endAt: interval.end,
        idempotencyKey: `hold-${Date.now() + 1}`,
      }),
    ).rejects.toThrow('The selected time slot is already reserved or on temporary hold.');
  });

  it('allows non-overlapping reservations for the same space', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-17T00:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        name: 'User C',
        email: `user-c-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 3',
        description: 'Desk near the meeting room',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '30.00',
        isActive: true,
      },
    });

    const first = buildInterval(base, 9, 10);
    const second = buildInterval(base, 11, 12);

    const firstReservation = await createReservationRecord(user.id, {
      spaceId: space.id,
      startAt: first.start,
      endAt: first.end,
      type: 'RESERVATION',
    });

    const secondReservation = await createReservationRecord(user.id, {
      spaceId: space.id,
      startAt: second.start,
      endAt: second.end,
      type: 'RESERVATION',
    });

    expect(firstReservation.spaceId).toBe(space.id);
    expect(secondReservation.spaceId).toBe(space.id);
  });

  it('ignores expired holds when evaluating availability', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-18T00:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        name: 'User D',
        email: `user-d-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 4',
        description: 'Desk by the lounge',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '18.00',
        isActive: true,
      },
    });

    const interval = buildInterval(base, 15, 16);
    const expiredHold = await prisma.reservation.create({
      data: {
        userId: user.id,
        spaceId: space.id,
        startAt: interval.start,
        endAt: interval.end,
        totalPrice: '0.00',
        status: 'IN_PROCESS',
        expiresAt: new Date(Date.now() - 60_000),
        idempotencyKey: `expired-${Date.now()}`,
      },
    });

    await expect(
      createReservationRecord(user.id, {
        spaceId: space.id,
        startAt: interval.start,
        endAt: interval.end,
        type: 'RESERVATION',
      }),
    ).resolves.toMatchObject({ id: expect.any(String), status: 'CONFIRMED' });

    await prisma.reservation.update({
      where: { id: expiredHold.id },
      data: { status: 'CANCELLED', expiresAt: null },
    });
  });

  it('rejects expired holds during confirmation', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-19T00:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        name: 'User E',
        email: `user-e-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 5',
        description: 'Desk near the window',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '22.00',
        isActive: true,
      },
    });

    const interval = buildInterval(base, 8, 9);
    const hold = await createHoldForUser(user.id, {
      spaceId: space.id,
      startAt: interval.start,
      endAt: interval.end,
      idempotencyKey: `confirm-expired-${Date.now()}`,
      holdDurationMinutes: 1,
    });

    const expiredTime = new Date(hold.expiresAt ?? Date.now());
    expiredTime.setTime(expiredTime.getTime() - 60_000);

    await prisma.reservation.update({
      where: { id: hold.id },
      data: { expiresAt: expiredTime },
    });

    await expect(
      import('@/features/reservations/services/reservation-hold.service').then(({ confirmHold }) =>
        confirmHold(user.id, hold.id),
      ),
    ).rejects.toThrow('This hold has expired and can no longer be confirmed.');
  });

  it('supports successful confirmation of a valid hold and subsequent cancellation', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-20T00:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        name: 'User F',
        email: `user-f-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 6',
        description: 'Desk with a monitor arm',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '24.00',
        isActive: true,
      },
    });

    const interval = buildInterval(base, 17, 18);
    const hold = await createHoldForUser(user.id, {
      spaceId: space.id,
      startAt: interval.start,
      endAt: interval.end,
      idempotencyKey: `hold-confirm-${Date.now()}`,
      holdDurationMinutes: 15,
    });

    const confirmed = await import('@/features/reservations/services/reservation-hold.service').then(({ confirmHold }) =>
      confirmHold(user.id, hold.id),
    );

    expect(confirmed.status).toBe('CONFIRMED');

    const cancelled = await import('@/features/reservations/services/reservation-hold.service').then(({ cancelHold }) =>
      cancelHold(user.id, confirmed.id),
    );

    expect(cancelled.status).toBe('CANCELLED');
  });

  it('enforces ownership and authorization for hold confirmation', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-21T00:00:00.000Z');
    const owner = await prisma.user.create({
      data: {
        name: 'Owner',
        email: `owner-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });
    const otherUser = await prisma.user.create({
      data: {
        name: 'Other',
        email: `other-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 7',
        description: 'Desk in a corner',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '28.00',
        isActive: true,
      },
    });

    const interval = buildInterval(base, 12, 13);
    const hold = await createHoldForUser(owner.id, {
      spaceId: space.id,
      startAt: interval.start,
      endAt: interval.end,
      idempotencyKey: `hold-owner-${Date.now()}`,
    });

    await expect(
      import('@/features/reservations/services/reservation-hold.service').then(({ confirmHold }) =>
        confirmHold(otherUser.id, hold.id),
      ),
    ).rejects.toThrow('Forbidden.');
  });

  it('preserves idempotency for repeated hold requests', async () => {
    if (!prisma) {
      return;
    }

    const base = new Date('2026-11-22T00:00:00.000Z');
    const user = await prisma.user.create({
      data: {
        name: 'User G',
        email: `user-g-${Date.now()}@example.com`,
        passwordHash: 'hash',
        role: UserRole.USER,
      },
    });

    const space = await prisma.space.create({
      data: {
        name: 'Desk 8',
        description: 'Desk by the exterior wall',
        type: 'DESK',
        capacity: 1,
        hourlyPrice: '27.00',
        isActive: true,
      },
    });

    const interval = buildInterval(base, 14, 15);
    const first = await createHoldForUser(user.id, {
      spaceId: space.id,
      startAt: interval.start,
      endAt: interval.end,
      idempotencyKey: `idempotent-${Date.now()}`,
    });

    const second = await createHoldForUser(user.id, {
      spaceId: space.id,
      startAt: interval.start,
      endAt: interval.end,
      idempotencyKey: first.idempotencyKey ?? 'missing',
    });

    expect(second.id).toBe(first.id);
  });
});
