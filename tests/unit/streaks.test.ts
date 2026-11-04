import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], '2026-04-29')).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak(['2026-04-28'], '2026-04-29')).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(calculateCurrentStreak(['2026-04-29', '2026-04-28', '2026-04-27'], '2026-04-29')).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    expect(calculateCurrentStreak(['2026-04-29', '2026-04-29', '2026-04-28'], '2026-04-29')).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak(['2026-04-29', '2026-04-27'], '2026-04-29')).toBe(1);
  });
});
