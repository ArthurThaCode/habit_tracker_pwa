export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmedValue = name.trim();

  if (trimmedValue.length === 0) {
    return {
      valid: false,
      value: trimmedValue,
      error: 'Habit name is required',
    };
  }

  if (trimmedValue.length > 60) {
    return {
      valid: false,
      value: trimmedValue,
      error: 'Habit name must be 60 characters or fewer',
    };
  }

  return {
    valid: true,
    value: trimmedValue,
    error: null,
  };
}
