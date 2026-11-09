import { expect, test } from '@playwright/test';

test.describe('Mobile UI', () => {
  test('public pages fit common mobile widths', async ({ page }) => {
    const routes = [
      '/',
      '/auth/login',
      '/auth/signup',
      '/auth/forgot-password',
      '/auth/reset-password?email=test%40example.com',
      '/privacy',
      '/terms',
    ];

    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 812 });

      for (const route of routes) {
        await page.goto(route);

        const dimensions = await page.evaluate(() => ({
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
        }));

        expect(
          dimensions.documentWidth,
          `${route} overflows at ${width}px`
        ).toBeLessThanOrEqual(dimensions.viewportWidth);
      }
    }

    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        name: 'Slow down, relax, and focus on one task at a time.',
        exact: true,
      })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Get Started', exact: true })
    ).toBeVisible();
  });

  test('signup form fits the viewport and exposes its primary action', async ({
    page,
  }) => {
    await page.goto('/auth/signup');

    await expect(
      page.getByRole('heading', { name: 'Create Account', exact: true })
    ).toBeVisible();

    for (const label of [
      'Full Name',
      'Email Address',
      'Password',
      'Confirm Password',
    ]) {
      await expect(page.getByLabel(new RegExp(`^${label}`))).toBeVisible();
    }

    const submitButton = page.getByRole('button', {
      name: 'Create Account',
      exact: true,
    });
    await expect(submitButton).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    const buttonBounds = await submitButton.boundingBox();

    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth
    );
    expect(buttonBounds?.width).toBeGreaterThan(0);
    expect(buttonBounds?.height).toBeGreaterThanOrEqual(44);
  });
});
