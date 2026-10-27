import { describe, expect, it } from 'vitest';

import { resolveAuthRedirect } from './proxy';

describe('resolveAuthRedirect', () => {
  it('redirects unauthenticated private routes to login with next param', () => {
    expect(
      resolveAuthRedirect({
        pathname: '/dashboard',
        hasAccessToken: false,
        hasRefreshToken: false,
        role: undefined,
      }),
    ).toEqual({
      type: 'redirect',
      destination: '/login?next=%2Fdashboard',
    });
  });

  it('redirects non-admin users away from admin routes', () => {
    expect(
      resolveAuthRedirect({
        pathname: '/admin',
        hasAccessToken: true,
        hasRefreshToken: false,
        role: 'USER',
      }),
    ).toEqual({
      type: 'redirect',
      destination: '/dashboard',
    });
  });

  it('keeps access to dashboard when a refresh token is available and the session can be renewed', () => {
    expect(
      resolveAuthRedirect({
        pathname: '/dashboard',
        hasAccessToken: false,
        hasRefreshToken: true,
        role: undefined,
        canRefresh: true,
      }),
    ).toEqual({
      type: 'refresh',
    });
  });

  it('redirects admin users away from dashboard to admin overview when they are not on the admin group', () => {
    expect(
      resolveAuthRedirect({
        pathname: '/dashboard',
        hasAccessToken: true,
        hasRefreshToken: false,
        role: 'ADMIN',
      }),
    ).toEqual({
      type: 'redirect',
      destination: '/admin',
    });
  });

  it('redirects authenticated admin users away from login routes to the admin panel', () => {
    expect(
      resolveAuthRedirect({
        pathname: '/login',
        hasAccessToken: true,
        hasRefreshToken: false,
        role: 'ADMIN',
      }),
    ).toEqual({
      type: 'redirect',
      destination: '/admin',
    });
  });

  it('blocks admin users from public user routes', () => {
    expect(
      resolveAuthRedirect({
        pathname: '/explorar',
        hasAccessToken: true,
        hasRefreshToken: false,
        role: 'ADMIN',
      }),
    ).toEqual({
      type: 'redirect',
      destination: '/admin',
    });
  });
});
