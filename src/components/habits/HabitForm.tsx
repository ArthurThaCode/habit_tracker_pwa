'use client';

import React, { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

interface HabitFormProps {
  initialData?: Habit;
  onSubmit: (data: Partial<Habit>) => void;
  onCancel: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSubmit({
      name: validation.value,
      description,
      frequency: 'daily',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="habit-form"
      className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <h3 className="text-lg font-semibold">{initialData ? 'Edit Habit' : 'New Habit'}</h3>
      
      <div>
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      <div>
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          disabled
          value="daily"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
        >
          Save Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HabitForm;
