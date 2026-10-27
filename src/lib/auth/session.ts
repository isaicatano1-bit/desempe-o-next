import type { UserRole } from '@prisma/client';

import type { AuthenticatedUser } from '@/types';
import { verifyAccessToken } from './tokens';

export const authCookieNames = {
  accessToken: 'cospace_access',
  refreshToken: 'cospace_refresh',
} as const;

export async function getAuthenticatedUserFromAccessToken(token: string): Promise<AuthenticatedUser> {
  const payload = await verifyAccessToken(token);

  if (!payload.sub) {
    throw new Error('Access token is missing subject.');
  }

  if (!payload.role) {
    throw new Error('Access token is missing role.');
  }

  return {
    id: payload.sub,
    role: payload.role as UserRole,
  };
}

export function hasRequiredRole(user: AuthenticatedUser, requiredRole: UserRole | UserRole[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

export async function requireRole(requiredRole: UserRole | UserRole[], token: string): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUserFromAccessToken(token);

  if (!hasRequiredRole(user, requiredRole)) {
    throw new Error('User does not have required permissions.');
  }

  return user;
}
