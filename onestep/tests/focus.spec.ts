
import { test, expect } from '@playwright/test';

test.describe('OneStep focus timer', () => {
  test('focus page loads for an authenticated user', async ({ page }) => {
    // Replace this navigation with your authenticated test setup.
    await page.goto('/focus');

    // This assertion assumes authenticated users can access /focus.
    await expect(page).toHaveURL(/\/focus/);
  });

  test('shows timer controls', async ({ page }) => {
    // Requires a valid authenticated test session.
    await page.goto('/focus');

    await expect(
      page.getByRole('button', { name: /start/i })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /reset/i })
    ).toBeVisible();
  });

  test('timer displays readable numbers', async ({ page }) => {
    // Requires a valid authenticated test session.
    await page.goto('/focus');

    const timer = page.getByTestId('focus-timer');

    await expect(timer).toBeVisible();
    await expect(timer).toContainText(/\d{1,2}:\d{2}/);
  });
});
