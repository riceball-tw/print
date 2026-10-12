import { expect, test } from '@playwright/test';

test('home page displays the testing demo', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle('Print | Testing demo');
	await expect(page.getByRole('heading', { name: 'Testing is ready' })).toBeVisible();
});
