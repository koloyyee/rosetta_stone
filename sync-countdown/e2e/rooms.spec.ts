import { test, expect } from '@playwright/test';

test.describe('Room Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@sync.room');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    // Wait for redirect to rooms
    await page.waitForURL(/\/rooms/, { timeout: 10000 });
  });

  test('room listing page is accessible after login', async ({ page }) => {
    await expect(page.getByText('Browse Rooms')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Timer Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@sync.room');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/rooms/, { timeout: 10000 });
  });

  test('can navigate into a room', async ({ page }) => {
    // Click on first room in the list
    const roomLink = page.locator('a[href^="/rooms/"]').first();
    if (await roomLink.isVisible()) {
      await roomLink.click();
      // Should navigate to room detail page
      await expect(page).toHaveURL(/\/rooms\//);
    }
  });
});
