import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'u1',
    name: 'Test',
    description: '',
    frequency: 'daily',
    createdAt: '2026-04-01T12:00:00Z',
    completions: ['2026-04-28'],
  };

  it('adds a completion date when the date is not present', () => {
    const updated = toggleHabitCompletion(mockHabit, '2026-04-29');
    expect(updated.completions).toContain('2026-04-29');
  });

  it('removes a completion date when the date already exists', () => {
    const updated = toggleHabitCompletion(mockHabit, '2026-04-28');
    expect(updated.completions).not.toContain('2026-04-28');
  });

  it('does not mutate the original habit object', () => {
    toggleHabitCompletion(mockHabit, '2026-04-29');
    expect(mockHabit.completions).toEqual(['2026-04-28']);
  });

  it('does not return duplicate completion dates', () => {
    const habitWithDupes = { ...mockHabit, completions: ['2026-04-28', '2026-04-28'] };
    const updated = toggleHabitCompletion(habitWithDupes, '2026-04-29');
    expect(updated.completions.filter(d => d === '2026-04-28').length).toBe(1);
  });
});
