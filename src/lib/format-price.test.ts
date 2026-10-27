import { describe, expect, it } from 'vitest';

import { formatPrice } from '@/lib/format-price';

describe('formatPrice', () => {
  it('formats decimal strings as euro values without decimals when integer', () => {
    expect(formatPrice('18.00')).toBe('18 €');
    expect(formatPrice('18.50')).toBe('18,50 €');
  });

  it('accepts numeric values and rounds to two decimals for display', () => {
    expect(formatPrice(24)).toBe('24 €');
    expect(formatPrice(24.75)).toBe('24,75 €');
  });
});
