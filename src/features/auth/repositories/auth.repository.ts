import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';

const userWithPasswordSelect = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const safeUserSelect = {
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

export async function findUserByEmail(email: string): Promise<UserWithPasswordRecord | null> {
  return prisma.user.findUnique({
    where: { email },
    select: userWithPasswordSelect,
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<SafeUserRecord> {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: 'USER',
    },
    select: safeUserSelect,
  });
}

export async function createRefreshToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    },
  });
}

export async function findUserById(id: string): Promise<SafeUserRecord | null> {
  return prisma.user.findUnique({
    where: { id },
    select: safeUserSelect,
  });
}

export async function findRefreshTokenByHash(tokenHash: string) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userId: true,
      tokenHash: true,
      expiresAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });
}

export async function revokeRefreshToken(id: string): Promise<void> {
  await prisma.refreshToken.update({
    where: { id },
    data: { revokedAt: new Date() },
  });
}
