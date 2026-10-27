import { afterEach, describe, expect, it } from 'vitest';

import { resolveJwtSecret } from '@/lib/auth/tokens';

describe('resolveJwtSecret', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns a deterministic dev fallback when the JWT secret is still a placeholder', () => {
    process.env.JWT_ACCESS_SECRET = 'REPLACE_WITH_A_RANDOM_SECRET';

    expect(resolveJwtSecret('JWT_ACCESS_SECRET')).toBe('dev-JWT_ACCESS_SECRET-fallback-secret-32-bytes');
  });
});
