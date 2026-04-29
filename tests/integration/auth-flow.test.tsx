import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import { storage } from '@/lib/storage';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
  });

  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    expect(storage.getUsers().length).toBe(1);
    expect(storage.getSession()?.email).toBe('test@example.com');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', async () => {
    storage.setUsers([{ id: '1', email: 'test@example.com', password: 'pwd', createdAt: '' }]);
    render(<SignupForm />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    expect(await screen.findByText('User already exists')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('submits the login form and stores the active session', async () => {
    storage.setUsers([{ id: '1', email: 'test@example.com', password: 'password123', createdAt: '' }]);
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('auth-login-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'password123');
    await user.click(screen.getByTestId('auth-login-submit'));

    expect(storage.getSession()?.userId).toBe('1');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId('auth-login-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrong');
    await user.click(screen.getByTestId('auth-login-submit'));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    expect(storage.getSession()).toBeNull();
  });
});
