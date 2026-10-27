import type { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authService } from '@/features/auth/services/auth.service';
import { authCookieNames } from '@/lib/auth/session';
import { verifyAccessToken, verifyRefreshToken } from '@/lib/auth/tokens';

type AuthRedirectInput = {
  pathname: string;
  hasAccessToken: boolean;
  hasRefreshToken: boolean;
  role?: UserRole;
  canRefresh?: boolean;
};

type AuthRedirectResult =
  | { type: 'redirect'; destination: string }
  | { type: 'refresh' }
  | null;

export function resolveAuthRedirect({
  pathname,
  hasAccessToken,
  hasRefreshToken,
  role,
  canRefresh = false,
}: AuthRedirectInput): AuthRedirectResult {
  const isAuthRoute = pathname === '/login' || pathname === '/registro' || pathname === '/register';
  const isPrivateRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isPublicUserRoute =
    pathname === '/' ||
    pathname === '/explorar' ||
    pathname.startsWith('/explorar/') ||
    pathname === '/espacios' ||
    pathname.startsWith('/espacios/') ||
    pathname === '/spaces' ||
    pathname.startsWith('/spaces/') ||
    pathname === '/catalogo' ||
    pathname.startsWith('/catalogo/') ||
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/');

  if (isAuthRoute) {
    if (hasAccessToken) {
      return { type: 'redirect', destination: role === 'ADMIN' ? '/admin' : '/explorar' };
    }

    if (hasRefreshToken && canRefresh) {
      return { type: 'refresh' };
    }

    return null;
  }

  if (hasAccessToken && role === 'ADMIN' && !isAdminRoute) {
    return { type: 'redirect', destination: '/admin' };
  }

  if (isPrivateRoute) {
    if (!hasAccessToken) {
      if (hasRefreshToken && canRefresh) {
        return { type: 'refresh' };
      }

      return {
        type: 'redirect',
        destination: `/login?next=${encodeURIComponent(pathname)}`,
      };
    }

    if (role === 'ADMIN') {
      return { type: 'redirect', destination: '/admin' };
    }

    return null;
  }

  if (isAdminRoute) {
    if (!hasAccessToken) {
      if (hasRefreshToken && canRefresh) {
        return { type: 'refresh' };
      }

      return {
        type: 'redirect',
        destination: `/login?next=${encodeURIComponent(pathname)}`,
      };
    }

    if (role !== 'ADMIN') {
      return { type: 'redirect', destination: '/dashboard' };
    }

    return null;
  }

  if (isPublicUserRoute && !hasAccessToken && hasRefreshToken && canRefresh) {
    return { type: 'refresh' };
  }

  return null;
}

function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string): NextResponse {
  response.cookies.set(authCookieNames.accessToken, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });

  response.cookies.set(authCookieNames.refreshToken, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get(authCookieNames.accessToken)?.value ?? '';
  const refreshToken = request.cookies.get(authCookieNames.refreshToken)?.value ?? '';

  let role: UserRole | undefined;
  let hasAccessToken = false;

  if (accessToken) {
    try {
      const payload = await verifyAccessToken(accessToken);
      role = payload.role as UserRole | undefined;
      hasAccessToken = true;
    } catch {
      hasAccessToken = false;
    }
  }

  const hasRefreshToken = Boolean(refreshToken);
  let canRefresh = false;

  if (!hasAccessToken && hasRefreshToken) {
    try {
      await verifyRefreshToken(refreshToken);
      canRefresh = true;
    } catch {
      canRefresh = false;
    }
  }

  const decision = resolveAuthRedirect({
    pathname,
    hasAccessToken,
    hasRefreshToken,
    role,
    canRefresh,
  });

  if (!decision) {
    return NextResponse.next();
  }

  if (decision.type === 'redirect') {
    return NextResponse.redirect(new URL(decision.destination, request.url));
  }

  if (!hasRefreshToken) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url));
  }

  try {
    const refreshedSession = await authService.refresh(refreshToken);
    const response = NextResponse.next();
    return setAuthCookies(response, refreshedSession.accessToken, refreshedSession.refreshToken);
  } catch {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|map)$).*)',
  ],
};
