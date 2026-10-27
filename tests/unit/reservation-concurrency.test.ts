import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createHoldForUser } from '@/features/reservations/services/reservation-hold.service';
import { createReservationRecord } from '@/features/reservations/services/reservation.service';
import { prisma } from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    reservation: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    space: {
      findUnique: vi.fn(),
    },
  },
}));

describe('reservation concurrency guards', () => {
  const transactionSpy = vi.mocked(prisma.$transaction);
  const spaceFindUnique = vi.mocked(prisma.space.findUnique);
  const reservationFindFirst = vi.mocked(prisma.reservation.findFirst);
  const reservationCreate = vi.mocked(prisma.reservation.create);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks a hold when the same space already has a conflicting active interval', async () => {
    const startAt = new Date('2026-10-27T10:00:00.000Z');
    const endAt = new Date('2026-10-27T12:00:00.000Z');

    transactionSpy.mockImplementation(async (callback) => {
      const tx = {
        $executeRaw: vi.fn(),
        space: {
          findUnique: vi.fn().mockResolvedValue({ id: 'space-1', isActive: true }),
        },
        reservation: {
          findFirst: vi
            .fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
              id: 'conflict-1',
              spaceId: 'space-1',
              startAt,
              endAt,
              status: 'CONFIRMED',
            }),
          create: vi.fn(),
          findUnique: vi.fn(),
          update: vi.fn(),
          updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        },
      };

      return callback(tx as any);
    });

    await expect(
      createHoldForUser('user-1', {
        spaceId: 'space-1',
        startAt,
        endAt,
        idempotencyKey: 'hold-1',
      }),
    ).rejects.toThrow('The selected time slot is already reserved or on temporary hold.');

    expect(transactionSpy).toHaveBeenCalledTimes(1);
  });

  it('locks the space row before creating a confirmed reservation', async () => {
    const startAt = new Date('2026-10-28T14:00:00.000Z');
    const endAt = new Date('2026-10-28T16:00:00.000Z');

    transactionSpy.mockImplementation(async (callback) => {
      const tx = {
        $executeRaw: vi.fn(),
        space: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'space-2',
            isActive: true,
            hourlyPrice: '25.00',
          }),
        },
        reservation: {
          findFirst: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockResolvedValue({
            id: 'reservation-1',
            userId: 'user-2',
            spaceId: 'space-2',
            startAt,
            endAt,
            status: 'CONFIRMED',
          }),
          findUnique: vi.fn(),
          update: vi.fn(),
          updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        },
      };

      return callback(tx as any);
    });

    await expect(
      createReservationRecord('user-2', {
        spaceId: 'space-2',
        startAt,
        endAt,
        type: 'RESERVATION',
      }),
    ).resolves.toMatchObject({
      spaceId: 'space-2',
      status: 'CONFIRMED',
    });

    expect(transactionSpy).toHaveBeenCalledTimes(1);
  });
});
