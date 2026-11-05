import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { storage } from '@/lib/storage';
import { Habit } from '@/types/habit';

// Like the real hook, the mock returns the same router object on every render.
const router = vi.hoisted(() => ({ push: () => {} }));
vi.mock('next/navigation', () => ({
  useRouter: () => router,
}));

const existingHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Old Name',
  description: 'Old description',
  frequency: 'daily',
  createdAt: '2026-04-01T00:00:00.000Z',
  completions: ['2026-04-28'],
};

function renderDashboard(habits: Habit[] = []) {
  storage.setHabits(habits);
  render(<DashboardPage />);
  return userEvent.setup();
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.setSession({ userId: 'user-1', email: 'user@example.com' });
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = renderDashboard();

    await user.click(await screen.findByTestId('create-habit-button'));
    await user.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByText('Habit name is required')).toBeInTheDocument();
    expect(storage.getHabits()).toEqual([]);
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = renderDashboard();

    await user.click(await screen.findByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByTestId('habit-card-drink-water')).toHaveTextContent('Drink Water');
    expect(screen.queryByTestId('habit-form')).not.toBeInTheDocument();
    expect(storage.getHabits()).toHaveLength(1);
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = renderDashboard([existingHabit]);

    await user.click(await screen.findByTestId('habit-edit-old-name'));
    const input = screen.getByTestId('habit-name-input');
    await user.clear(input);
    await user.type(input, 'New Name');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByTestId('habit-card-new-name')).toBeInTheDocument();
    expect(screen.queryByTestId('habit-card-old-name')).not.toBeInTheDocument();
    expect(storage.getHabits()).toEqual([{ ...existingHabit, name: 'New Name' }]);
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const user = renderDashboard([existingHabit]);

    await user.click(await screen.findByTestId('habit-delete-old-name'));

    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('habit-card-old-name')).toBeInTheDocument();
    expect(storage.getHabits()).toHaveLength(1);

    await user.click(screen.getByTestId('confirm-delete-button'));

    expect(screen.queryByTestId('habit-card-old-name')).not.toBeInTheDocument();
    expect(storage.getHabits()).toEqual([]);
  });

  it('toggles completion and updates the streak display', async () => {
    const user = renderDashboard([{ ...existingHabit, completions: [] }]);

    expect(await screen.findByTestId('habit-streak-old-name')).toHaveTextContent('0 day streak');

    await user.click(screen.getByTestId('habit-complete-old-name'));
    expect(screen.getByTestId('habit-streak-old-name')).toHaveTextContent('1 day streak');

    await user.click(screen.getByTestId('habit-complete-old-name'));
    expect(screen.getByTestId('habit-streak-old-name')).toHaveTextContent('0 day streak');
  });
});
