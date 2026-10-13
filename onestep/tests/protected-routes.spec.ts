
import { test, expect } from '@playwright/test';

const protectedRoutes = [
  '/dashboard',
  '/mood',
  '/task',
  '/focus',
  '/history',
  '/settings',
];

test.describe('Protected routes', () => {
  for (const route of protectedRoutes) {
    test(`redirects logged-out users away from ${route}`, async ({ page }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/auth\/login/);
    });
  }
});
