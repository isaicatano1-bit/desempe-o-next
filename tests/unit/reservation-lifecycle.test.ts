import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cancelHold, confirmHold, createHoldForUser } from '@/features/reservations/services/reservation-hold.service';
import { prisma } from '@/lib/db/prisma';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    reservation: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    space: {
      findUnique: vi.fn(),
    },
  },
}));

describe('reservation lifecycle rules', () => {
  const txSpy = vi.mocked(prisma.$transaction);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a valid hold when the time window is free', async () => {
    const startAt = new Date('2026-10-27T09:00:00.000Z');
    const endAt = new Date('2026-10-27T10:00:00.000Z');

    txSpy.mockImplementation(async (callback) => {
      const tx = {
        $executeRaw: vi.fn(),
        space: { findUnique: vi.fn().mockResolvedValue({ id: 'space-1', isActive: true }) },
        reservation: {
          findFirst: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockResolvedValue({
            id: 'hold-1',
            userId: 'user-1',
            spaceId: 'space-1',
            startAt,
            endAt,
            status: 'IN_PROCESS',
            expiresAt: new Date('2026-10-27T09:10:00.000Z'),
          }),
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
        idempotencyKey: 'hold-req-1',
      }),
    ).resolves.toMatchObject({
      userId: 'user-1',
      spaceId: 'space-1',
      status: 'IN_PROCESS',
    });
  });

  it('rejects overlapping active holds', async () => {
    const startAt = new Date('2026-10-27T10:00:00.000Z');
    const endAt = new Date('2026-10-27T12:00:00.000Z');

    txSpy.mockImplementation(async (callback) => {
      const tx = {
        $executeRaw: vi.fn(),
        space: { findUnique: vi.fn().mockResolvedValue({ id: 'space-1', isActive: true }) },
        reservation: {
          findFirst: vi
            .fn()
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
              id: 'hold-2',
              spaceId: 'space-1',
              status: 'IN_PROCESS',
              startAt,
              endAt,
              expiresAt: new Date('2026-10-27T12:30:00.000Z'),
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
      createHoldForUser('user-2', {
        spaceId: 'space-1',
        startAt,
        endAt,
        idempotencyKey: 'hold-req-2',
      }),
    ).rejects.toThrow('The selected time slot is already reserved or on temporary hold.');
  });

  it('rejects confirmation of an expired hold', async () => {
    txSpy.mockImplementation(async (callback) => {
      const tx = {
        $executeRaw: vi.fn(),
        reservation: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'hold-3',
            userId: 'user-1',
            spaceId: 'space-1',
            startAt: new Date('2026-10-27T09:00:00.000Z'),
            endAt: new Date('2026-10-27T10:00:00.000Z'),
            status: 'IN_PROCESS',
            expiresAt: new Date('2026-10-27T08:59:00.000Z'),
          }),
          findFirst: vi.fn().mockResolvedValue(null),
          update: vi.fn(),
          create: vi.fn(),
          updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        },
        space: {
          findUnique: vi.fn(),
        },
      };

      return callback(tx as any);
    });

    await expect(confirmHold('user-1', 'hold-3', false)).rejects.toThrow('This hold has expired and can no longer be confirmed.');
  });

  it('rejects unauthorized users when cancelling a hold', async () => {
    txSpy.mockImplementation(async (callback) => {
      const tx = {
        $executeRaw: vi.fn(),
        reservation: {
          findUnique: vi.fn().mockResolvedValue({
            id: 'hold-4',
            userId: 'user-1',
            spaceId: 'space-1',
            status: 'IN_PROCESS',
            expiresAt: new Date('2026-10-27T12:00:00.000Z'),
          }),
          update: vi.fn(),
          create: vi.fn(),
          findFirst: vi.fn(),
          updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        },
        space: {
          findUnique: vi.fn(),
        },
      };

      return callback(tx as any);
    });

    await expect(cancelHold('user-2', 'hold-4', false)).rejects.toThrow('Forbidden.');
  });

  it('reuses a valid idempotent retry for the same request payload', async () => {
    const startAt = new Date('2026-10-27T15:00:00.000Z');
    const endAt = new Date('2026-10-27T16:00:00.000Z');

    txSpy.mockImplementation(async (callback) => {
      const tx = {
        $executeRaw: vi.fn(),
        space: { findUnique: vi.fn().mockResolvedValue({ id: 'space-9', isActive: true }) },
        reservation: {
          findFirst: vi
            .fn()
            .mockResolvedValueOnce({
              id: 'hold-9',
              userId: 'user-9',
              spaceId: 'space-9',
              startAt,
              endAt,
              status: 'IN_PROCESS',
            })
            .mockResolvedValueOnce(null),
          create: vi.fn(),
          findUnique: vi.fn(),
          update: vi.fn(),
          updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        },
      };

      return callback(tx as any);
    });

    await expect(
      createHoldForUser('user-9', {
        spaceId: 'space-9',
        startAt,
        endAt,
        idempotencyKey: 'same-key',
      }),
    ).resolves.toMatchObject({
      id: 'hold-9',
      userId: 'user-9',
    });
  });
});
