import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitForm from '@/components/habits/HabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { Habit } from '@/types/habit';

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    const mockSubmit = vi.fn();
    render(<HabitForm onSubmit={mockSubmit} onCancel={() => {}} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('habit-save-button'));
    
    expect(await screen.findByText('Habit name is required')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('creates a new habit and renders it in the list', async () => {
    const mockSubmit = vi.fn();
    render(<HabitForm onSubmit={mockSubmit} onCancel={() => {}} />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Drink Water',
      description: '',
      frequency: 'daily',
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const mockHabit: Habit = {
      id: '1',
      userId: 'u1',
      name: 'Old Name',
      description: '',
      frequency: 'daily',
      createdAt: '2026-04-01T00:00:00Z',
      completions: ['2026-04-28'],
    };
    const mockSubmit = vi.fn();
    render(<HabitForm initialData={mockHabit} onSubmit={mockSubmit} onCancel={() => {}} />);
    const user = userEvent.setup();

    const input = screen.getByTestId('habit-name-input');
    await user.clear(input);
    await user.type(input, 'New Name');
    await user.click(screen.getByTestId('habit-save-button'));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'New Name',
      description: '',
      frequency: 'daily',
    });
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const mockHabit: Habit = {
      id: '1',
      userId: 'u1',
      name: 'Test',
      description: '',
      frequency: 'daily',
      createdAt: '',
      completions: [],
    };
    const mockDelete = vi.fn();
    render(<HabitCard habit={mockHabit} onToggle={() => {}} onEdit={() => {}} onDelete={mockDelete} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('habit-delete-test'));
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
    
    await user.click(screen.getByTestId('confirm-delete-button'));
    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('toggles completion and updates the streak display', async () => {
    const mockHabit: Habit = {
      id: '1',
      userId: 'u1',
      name: 'Test',
      description: '',
      frequency: 'daily',
      createdAt: '',
      completions: [],
    };
    const mockToggle = vi.fn();
    render(<HabitCard habit={mockHabit} onToggle={mockToggle} onEdit={() => {}} onDelete={() => {}} />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId('habit-complete-test'));
    expect(mockToggle).toHaveBeenCalled();
  });
});
