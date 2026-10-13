
import { test, expect } from '@playwright/test';

test.describe('OneStep landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the landing page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/OneStep/);

    await expect(
      page.getByRole('heading', {
        name: 'Slow down, relax, and focus on one task at a time.',
        exact: true,
      })
    ).toBeVisible();
  });

  test('displays the Get Started link', async ({ page }) => {
    const signupLink = page.getByRole('link', {
      name: 'Get Started',
      exact: true,
    });

    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', '/auth/signup');
  });

  test('navigates to signup when Get Started is clicked', async ({ page }) => {
    await page.getByRole('link', {
      name: 'Get Started',
      exact: true,
    }).click();

    await expect(page).toHaveURL(/\/auth\/signup\/?$/);

    await expect(
      page.getByRole('heading', {
        name: 'Create Account',
        exact: true,
      })
    ).toBeVisible();
  });

  test('has no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto('/');

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));

    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth
    );
  });
});
