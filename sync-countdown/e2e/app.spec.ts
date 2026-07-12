import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('shows welcome heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome to Sync Countdown')).toBeVisible();
  });

  test('has Get Started button linking to signup', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Get Started')).toBeVisible();
  });

  test('has Browse Rooms button linking to rooms', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Browse Rooms')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('login page shows sign in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Sign In')).toBeVisible();
    // Should have email and password fields
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('signup page shows sign up form', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByText('Sign Up')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('navigation from homepage to login works', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@user.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // Should show error message after failed login
    await expect(page.locator('text=Invalid')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Navigation', () => {
  test('navigates from home to rooms', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Browse Rooms');
    await expect(page).toHaveURL(/\/rooms/);
  });

  test('404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByText('404')).toBeVisible();
  });
});
