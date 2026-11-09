
import { test, expect } from '@playwright/test';

test.describe('OneStep focus timer', () => {
  test('redirects to login when no authenticated session is established', async ({ page }) => {
    await page.goto('/focus');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
