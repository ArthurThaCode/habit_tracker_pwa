import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    // Need to set localStorage before navigating
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@example.com' }));
    });
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ id: 'u1', email: 'user@example.com', password: 'password123', createdAt: '' }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'h1', userId: 'u1', name: 'User 1 Habit', description: '', frequency: 'daily', createdAt: '', completions: [] }]));
    });
    await page.getByTestId('auth-login-email').fill('user@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('User 1 Habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ id: 'u1', email: 'user@example.com', password: 'password123', createdAt: '' }]));
    });
    await page.getByTestId('auth-login-email').fill('user@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Read Book');
    await page.getByTestId('habit-save-button').click();
    
    await expect(page.getByTestId('habit-card-read-book')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([{ id: 'u1', email: 'user@example.com', password: 'password123', createdAt: '' }]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'h1', userId: 'u1', name: 'Workout', description: '', frequency: 'daily', createdAt: '', completions: [] }]));
    });
    await page.getByTestId('auth-login-email').fill('user@example.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    
    await expect(page.getByTestId('habit-streak-workout')).toHaveText('0 day streak');
    await page.getByTestId('habit-complete-workout').click();
    await expect(page.getByTestId('habit-streak-workout')).toHaveText('1 day streak');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@example.com' }));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([{ id: 'h1', userId: 'u1', name: 'Persisted Habit', description: '', frequency: 'daily', createdAt: '', completions: [] }]));
    });
    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-persisted-habit')).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('habit-card-persisted-habit')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'test@example.com' }));
    });
    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();
    await expect(page).toHaveURL(/\/login/);
    const session = await page.evaluate(() => localStorage.getItem('habit-tracker-session'));
    expect(session).toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    // Wait for the app shell to cache
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Wait for service worker to take control
    await page.evaluate(async () => {
      if (!navigator.serviceWorker.controller) {
        await new Promise((resolve) => {
          navigator.serviceWorker.addEventListener('controllerchange', resolve);
        });
      }
    });
    
    // Simulate offline
    await context.setOffline(true);
    
    // Reload and check if it still renders (no network crash)
    await page.reload();
    await expect(page.getByTestId('auth-login-submit')).toBeVisible();
  });
});
