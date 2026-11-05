import { describe, it, expect } from 'vitest';
import { getLocalDate } from '@/lib/date';

describe('getLocalDate', () => {
  it('uses the local calendar day shortly after midnight', () => {
    expect(getLocalDate(new Date(2026, 5, 11, 0, 30))).toBe('2026-06-11');
  });

  it('uses the local calendar day shortly before midnight', () => {
    expect(getLocalDate(new Date(2026, 5, 11, 23, 30))).toBe('2026-06-11');
  });

  it('pads single digit months and days', () => {
    expect(getLocalDate(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });
});
