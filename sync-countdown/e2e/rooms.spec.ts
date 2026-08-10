import { test, expect } from '@playwright/test';

test.describe('Room Management (requires backend)', () => {
  test('room listing page redirects to home when not authenticated', async ({ page }) => {
    await page.goto('/rooms');
    // AuthGuard should redirect to home since no JWT token
    await expect(page).toHaveURL('/');
  });
});
