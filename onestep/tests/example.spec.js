import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('OneStep');
  await expect(
    page.getByRole('heading', {
      name: 'Slow down, relax, and focus on one task at a time.',
    })
  ).toBeVisible();
});

test('landing page links to signup', async ({ page }) => {
  await page.goto('/');

  const signupLink = page.getByRole('link', { name: 'Get Started' });
  await expect(signupLink).toHaveAttribute('href', '/auth/signup');

  await page.goto('/auth/signup');
  await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
});
