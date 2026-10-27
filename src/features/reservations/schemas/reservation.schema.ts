import { z } from 'zod';

export const reservationStatusSchema = z.enum(['CONFIRMED', 'IN_PROCESS', 'CANCELLED']);

export const reservationKindSchema = z.enum(['RESERVATION', 'HOLD']);

export const createReservationSchema = z.object({
  spaceId: z.string().trim().min(1, 'Space ID is required.'),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  type: reservationKindSchema.optional().default('RESERVATION'),
  idempotencyKey: z.string().trim().min(1, 'Idempotency key is required.').max(128, 'Idempotency key is too long.').optional(),
  holdDurationMinutes: z.coerce.number().int('Hold duration must be an integer.').min(1, 'Hold duration must be at least 1 minute.').max(1440, 'Hold duration must be at most 1440 minutes.').optional(),
}).refine((data) => data.endAt.getTime() > data.startAt.getTime(), {
  message: 'End time must be after start time.',
  path: ['endAt'],
});

export const updateReservationSchema = z.object({
  status: reservationStatusSchema.optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  holdDurationMinutes: z.coerce.number().int('Hold duration must be an integer.').min(1, 'Hold duration must be at least 1 minute.').max(1440, 'Hold duration must be at most 1440 minutes.').optional(),
}).refine((data) => {
  if (data.startAt && data.endAt) {
    return data.endAt.getTime() > data.startAt.getTime();
  }

  return true;
}, {
  message: 'End time must be after start time.',
  path: ['endAt'],
});

export const reservationIdSchema = z.string().trim().min(1, 'Reservation identifier is required.');

export const confirmationSchema = z.object({
  holdId: reservationIdSchema,
});

export const listReservationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: reservationStatusSchema.optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type ListReservationsQuery = z.infer<typeof listReservationsQuerySchema>;
