
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
        name: 'OneStep',
        exact: true,
      })
    ).toBeVisible();

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('login password can be shown and hidden', async ({ page }) => {
    await page.goto('/auth/login');

    const password = page.getByLabel(/^Password/);
    await password.fill('sample-secret');
    await page.getByRole('button', { name: 'Show password' }).click();

    await expect(password).toHaveAttribute('type', 'text');
    await expect(password).toHaveValue('sample-secret');
    await page.getByRole('button', { name: 'Hide password' }).click();
    await expect(password).toHaveAttribute('type', 'password');
    await expect(password).toHaveValue('sample-secret');
  });

  test('signup passwords can be shown independently', async ({ page }) => {
    await page.goto('/auth/signup');

    const password = page.getByLabel(/^Password/);
    const confirmation = page.getByLabel(/^Confirm Password/);
    await password.fill('sample-secret');
    await confirmation.fill('confirmation-secret');

    await page.getByRole('button', { name: 'Show password' }).first().click();

    await expect(password).toHaveAttribute('type', 'text');
    await expect(password).toHaveValue('sample-secret');
    await expect(confirmation).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: 'Show password' }).click();

    await expect(confirmation).toHaveAttribute('type', 'text');
    await expect(confirmation).toHaveValue('confirmation-secret');
  });

  test('login rejects empty required fields', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByRole('button', {
      name: 'Continue',
      exact: true,
    }).click();

    const email = page.locator('input[type="email"]');
    const password = page.locator('input[type="password"]');

    await expect(email).toHaveAttribute('required', '');
    await expect(password).toHaveAttribute('required', '');
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/auth/forgot-password');

    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('signup rejects passwords that do not match', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.getByLabel(/^Full Name/).fill('Test User');
    await page.getByLabel(/^Email Address/).fill('test@example.com');
    await page.getByLabel(/^Password/).fill('password123');
    await page.getByLabel(/^Confirm Password/).fill('different123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Passwords do not match.')).toBeVisible();
  });
});
