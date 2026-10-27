import { createHash, randomBytes } from 'node:crypto';

import { SignJWT, jwtVerify } from 'jose';

import type { UserRole } from '@prisma/client';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

export type AccessTokenPayload = {
  sub?: string;
  role?: UserRole;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
};

export type RefreshTokenPayload = {
  sub?: string;
  jti?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
};

export function resolveJwtSecret(name: string): string {
  const secret = process.env[name] ?? '';

  if (!secret || secret === 'REPLACE_WITH_A_RANDOM_SECRET' || secret === 'REPLACE_WITH_A_DIFFERENT_RANDOM_SECRET') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`${name} is not set. Add a secure secret to your local environment.`);
    }

    return `dev-${name}-fallback-secret-32-bytes`;
  }

  if (secret.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`${name} must be at least 32 characters long.`);
    }

    return secret.padEnd(32, 'x');
  }

  return secret;
}

function getRequiredSecret(name: string): Uint8Array {
  return new TextEncoder().encode(resolveJwtSecret(name));
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createAccessToken(user: {
  id: string;
  role: UserRole;
}): Promise<string> {
  const secret = getRequiredSecret('JWT_ACCESS_SECRET');

  return new SignJWT({
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('cospace')
    .setAudience('cospace-app')
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(secret);
}

export async function createRefreshToken(userId: string): Promise<{
  token: string;
  tokenHash: string;
  expiresAt: Date;
}> {
  const secret = getRequiredSecret('JWT_REFRESH_SECRET');
  const jti = randomBytes(16).toString('hex');
  const token = await new SignJWT({
    jti,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('cospace')
    .setAudience('cospace-refresh')
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(secret);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return {
    token,
    tokenHash: hashToken(token),
    expiresAt,
  };
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const secret = getRequiredSecret('JWT_ACCESS_SECRET');

  const { payload } = await jwtVerify(token, secret, {
    issuer: 'cospace',
    audience: 'cospace-app',
    algorithms: ['HS256'],
  });

  if (!payload.sub) {
    throw new Error('Access token is missing subject.');
  }

  if (!payload.role) {
    throw new Error('Access token is missing role.');
  }

  return payload as AccessTokenPayload;
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
  const secret = getRequiredSecret('JWT_REFRESH_SECRET');

  const { payload } = await jwtVerify(token, secret, {
    issuer: 'cospace',
    audience: 'cospace-refresh',
    algorithms: ['HS256'],
  });

  if (!payload.sub) {
    throw new Error('Refresh token is missing subject.');
  }

  if (!payload.jti) {
    throw new Error('Refresh token is missing identifier.');
  }

  return payload as RefreshTokenPayload;
}
