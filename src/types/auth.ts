import type { UserRole } from '@prisma/client';

export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

export type AuthenticatedUser = {
  id: string;
  role: UserRole;
};

export type AuthResult = {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
};
