import type { Prisma } from '@prisma/client';

import {
  safeUserSelect,
  userWithPasswordSelect,
  type SafeUserRecord,
  type UserWithPasswordRecord,
} from '@/features/auth/types/user';
import { prisma } from '@/lib/db/prisma';

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
