'use client';

import React, { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onEdit, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  const handleToggle = () => {
    const updatedHabit = toggleHabitCompletion(habit, today);
    onToggle(updatedHabit);
  };

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{habit.name}</h3>
          {habit.description && <p className="text-gray-600 text-sm">{habit.description}</p>}
        </div>
        <div className="text-right">
          <p data-testid={`habit-streak-${slug}`} className="text-lg font-semibold text-blue-600">
            {streak} day streak
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            isCompletedToday
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCompletedToday ? 'Completed Today' : 'Mark Complete'}
        </button>
        
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="p-2 text-gray-500 hover:text-blue-600 border border-gray-200 rounded-md"
          aria-label="Edit Habit"
        >
          Edit
        </button>

        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setShowConfirmDelete(true)}
          className="p-2 text-gray-500 hover:text-red-600 border border-gray-200 rounded-md"
          aria-label="Delete Habit"
        >
          Delete
        </button>
      </div>

      {showConfirmDelete && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
          <p className="text-sm text-red-700 font-medium">Are you sure you want to delete this habit?</p>
          <div className="mt-2 flex space-x-2">
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
