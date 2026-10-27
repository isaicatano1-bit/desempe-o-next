import { createHash } from 'node:crypto';

import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

import {
  createUser,
  findUserByEmail,
  createRefreshToken,
  findRefreshTokenByHash,
  findUserById,
  revokeRefreshToken,
} from '@/features/auth/repositories/auth.repository';
import type { LoginInput, RegisterInput } from '@/features/auth/schemas/auth.schema';
import type { SafeUserRecord } from '@/features/auth/types/user';
import { createAccessToken, createRefreshToken as createRefreshJwt, hashToken, verifyRefreshToken } from '@/lib/auth/tokens';
import { prisma } from '@/lib/db/prisma';
import type { AuthResult, SafeUser } from '@/types';

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export async function registerUser(input: RegisterInput): Promise<SafeUser> {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AuthError('Email already in use.', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    return await createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AuthError('Email already in use.', 409);
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AuthError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AuthError('Invalid email or password.', 401);
  }

  const accessToken = await createAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshTokenResult = await createRefreshJwt(user.id);

  await createRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenResult.tokenHash,
    expiresAt: refreshTokenResult.expiresAt,
  });

  const { passwordHash: _passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken: refreshTokenResult.token,
  };
}

export async function refreshSession(refreshTokenValue: string): Promise<AuthResult> {
  const payload = await verifyRefreshToken(refreshTokenValue);

  if (!payload.sub) {
    throw new AuthError('Invalid refresh token.', 401);
  }

  const tokenHash = hashToken(refreshTokenValue);
  const existingToken = await findRefreshTokenByHash(tokenHash);

  if (!existingToken || existingToken.userId !== payload.sub) {
    throw new AuthError('Invalid refresh token.', 401);
  }

  if (existingToken.revokedAt || existingToken.expiresAt <= new Date()) {
    throw new AuthError('Refresh token has been revoked or expired.', 401);
  }

  const user = await findUserById(payload.sub);

  if (!user) {
    throw new AuthError('Invalid refresh token.', 401);
  }

  return prisma.$transaction(async (tx) => {
    const tokenRecord = await tx.refreshToken.findUnique({
      where: { id: existingToken.id },
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt <= new Date()) {
      throw new AuthError('Refresh token has been revoked or expired.', 401);
    }

    await tx.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    const newRefreshToken = await createRefreshJwt(user.id);

    await tx.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: newRefreshToken.tokenHash,
        expiresAt: newRefreshToken.expiresAt,
      },
    });

    const accessToken = await createAccessToken({
      id: user.id,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken: newRefreshToken.token,
    };
  });
}

export async function logoutSession(refreshTokenValue?: string): Promise<void> {
  if (!refreshTokenValue) {
    return;
  }

  try {
    const payload = await verifyRefreshToken(refreshTokenValue);

    if (!payload.sub) {
      return;
    }

    const tokenHash = createHash('sha256').update(refreshTokenValue).digest('hex');
    const tokenRecord = await findRefreshTokenByHash(tokenHash);

    if (tokenRecord && tokenRecord.userId === payload.sub && !tokenRecord.revokedAt) {
      await revokeRefreshToken(tokenRecord.id);
    }
  } catch {
    // Ignore invalid or expired refresh tokens during logout and just clear cookies.
  }
}

export const authService = {
  register: registerUser,
  login: loginUser,
  refresh: refreshSession,
  logout: logoutSession,
};
