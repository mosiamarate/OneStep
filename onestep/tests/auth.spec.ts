
import { test, expect } from '@playwright/test';

test.describe('OneStep authentication pages', () => {
  test('signup page loads', async ({ page }) => {
    await page.goto('/auth/signup');

    await expect(
      page.getByRole('heading', {
        name: 'Create Account',
        exact: true,
      })
    ).toBeVisible();

    await expect(page.getByRole('button', {
      name: /create account|sign up|register/i,
    })).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/auth/login');

    await expect(
      page.getByRole('heading', {
        name: /log in|sign in|welcome back/i,
      })
    ).toBeVisible();

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login rejects empty required fields', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByRole('button', {
      name: /log in|sign in/i,
    }).click();

    const email = page.locator('input[type="email"]');
    const password = page.locator('input[type="password"]');

    await expect(email).toHaveAttribute('required', '');
    await expect(password).toHaveAttribute('required', '');
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/auth/forgot');

    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
