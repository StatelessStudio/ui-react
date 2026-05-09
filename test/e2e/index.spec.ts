import { test, expect } from '@playwright/test';

test('homepage has expected title', async ({ page }) => {
	await page.goto('/');

	// Adjust this according to your actual index.html title
	await expect(page).toHaveTitle(/.*@stateless-studio\/ui-react.*/);
});
