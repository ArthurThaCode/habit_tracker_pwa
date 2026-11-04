import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';

const KEYS = {
  USERS: 'habit-tracker-users',
  SESSION: 'habit-tracker-session',
  HABITS: 'habit-tracker-habits',
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

export const storage = {
  // Lets React subscribe to changes made in this tab and in other tabs.
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    window.addEventListener('storage', listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', listener);
    };
  },

  // Raw JSON strings: useSyncExternalStore needs snapshots that stay identical until the data changes.
  getSessionSnapshot: () => localStorage.getItem(KEYS.SESSION),
  getHabitsSnapshot: () => localStorage.getItem(KEYS.HABITS),

  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getSession: (): Session | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },

  setSession: (session: Session | null) => {
    if (session === null) {
      localStorage.removeItem(KEYS.SESSION);
    } else {
      localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
    }
    notify();
  },

  getHabits: (): Habit[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  },

  setHabits: (habits: Habit[]) => {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    notify();
  },
};
