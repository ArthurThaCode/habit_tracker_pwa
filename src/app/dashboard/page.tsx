'use client';

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Habit } from '@/types/habit';
import { Session } from '@/types/auth';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';

export default function DashboardPage() {
  const router = useRouter();
  // The server has no localStorage, so its snapshot is "no session" and its HTML matches the first client render.
  const sessionJson = useSyncExternalStore(storage.subscribe, storage.getSessionSnapshot, () => null);
  const habitsJson = useSyncExternalStore(storage.subscribe, storage.getHabitsSnapshot, () => null);
  const session = useMemo<Session | null>(() => (sessionJson ? JSON.parse(sessionJson) : null), [sessionJson]);
  const habits = useMemo<Habit[]>(
    () => (session && habitsJson ? JSON.parse(habitsJson).filter((h: Habit) => h.userId === session.userId) : []),
    [session, habitsJson]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    // Reads storage directly: during hydration the snapshot above is still the server's "no session".
    if (!storage.getSession()) router.push('/login');
  }, [router, sessionJson]);

  const handleLogout = () => {
    storage.setSession(null);
  };

  const handleCreateOrUpdate = (data: Partial<Habit>) => {
    const allHabits = storage.getHabits();
    let updatedHabits: Habit[];

    if (editingHabit) {
      updatedHabits = allHabits.map((h) =>
        h.id === editingHabit.id ? { ...h, ...data } : h
      );
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session!.userId,
        name: data.name!,
        description: data.description || '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      };
      updatedHabits = [...allHabits, newHabit];
    }

    storage.setHabits(updatedHabits);
    setIsAdding(false);
    setEditingHabit(null);
  };

  const handleToggle = (updatedHabit: Habit) => {
    const allHabits = storage.getHabits();
    const updatedAllHabits = allHabits.map((h) =>
      h.id === updatedHabit.id ? updatedHabit : h
    );
    storage.setHabits(updatedAllHabits);
  };

  const handleDelete = (id: string) => {
    const allHabits = storage.getHabits();
    const updatedAllHabits = allHabits.filter((h) => h.id !== id);
    storage.setHabits(updatedAllHabits);
  };

  if (!session) return null;

  return (
    <main data-testid="dashboard-page" className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">Habits</h1>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-red-600"
        >
          Logout
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Daily Habits</h2>
          <button
            data-testid="create-habit-button"
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
          >
            Add Habit
          </button>
        </div>

        {(isAdding || editingHabit) && (
          <HabitForm
            initialData={editingHabit || undefined}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setIsAdding(false);
              setEditingHabit(null);
            }}
          />
        )}

        {habits.length === 0 ? (
          <div data-testid="empty-state" className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">You haven&apos;t added any habits yet.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 text-blue-600 font-medium hover:underline"
            >
              Start by creating your first habit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                onEdit={(h) => setEditingHabit(h)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
