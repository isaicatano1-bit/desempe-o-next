import type { Prisma } from '@prisma/client';

export const userWithPasswordSelect = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type SafeUserRecord = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;

export type UserWithPasswordRecord = Prisma.UserGetPayload<{
  select: typeof userWithPasswordSelect;
}>;
