import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('shows welcome heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome to Sync Countdown')).toBeVisible();
  });

  test('has Get Started and Browse Rooms buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Get Started')).toBeVisible();
    await expect(page.getByText('Browse Rooms')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('login page shows sign in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Sign In')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('signup page shows sign up form', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login form shows validation errors', async ({ page }) => {
    await page.goto('/login');
    // Type invalid email then blur to trigger validation
    await page.locator('input[type="email"]').fill('not-an-email');
    await page.locator('input[type="password"]').focus();
    await expect(page.getByText('valid email address')).toBeVisible({ timeout: 5000 });
  });

  test('navigation from homepage to login works', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('404 Page', () => {
  test('shows 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByText('404')).toBeVisible();
  });
});
