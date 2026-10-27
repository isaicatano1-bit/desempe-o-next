import { z } from 'zod';

export const spaceTypeSchema = z.enum(['DESK', 'MEETING_ROOM', 'PHONE_BOOTH']);

export const createSpaceSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long.').max(100, 'Name must be at most 100 characters long.'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters long.').max(2000, 'Description must be at most 2000 characters long.'),
  type: spaceTypeSchema,
  capacity: z.number().int('Capacity must be an integer.').min(1, 'Capacity must be at least 1.').max(100, 'Capacity must be at most 100.'),
  hourlyPrice: z.number().min(0, 'Hourly price must be greater than or equal to 0.').max(10000, 'Hourly price must be at most 10000.'),
  isActive: z.boolean().optional().default(true),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export const spaceIdSchema = z.string().trim().min(1, 'Space identifier is required.');

export const listSpacesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: spaceTypeSchema.optional(),
  includeInactive: z.coerce.boolean().optional(),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;
export type ListSpacesQuery = z.infer<typeof listSpacesQuerySchema>;
