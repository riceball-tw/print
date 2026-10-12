import { expect, test } from '@playwright/test';

test('home page renders through the base layout', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle('Print');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', 'width=device-width');
	await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'A minimal Astro site.');
	await expect(page.getByRole('main')).toContainText('A minimal Astro site.');
});
