import { getLocalDate } from '@/lib/date';

export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (completions.length === 0) return 0;

  const referenceDate = today || getLocalDate();
  
  // Remove duplicates and sort descending
  const uniqueDates = Array.from(new Set(completions)).sort((a, b) => b.localeCompare(a));

  if (uniqueDates[0] !== referenceDate) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(referenceDate);

  for (const dateStr of uniqueDates) {
    const date = new Date(dateStr);
    const diffTime = Math.abs(currentDate.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      streak++;
    } else if (diffDays === 1) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }

  return streak;
}
