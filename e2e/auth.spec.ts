import {test, expect} from '@playwright/test';

test.describe('Authentication Flow', () => {
	test('should login successfully and navigate through the app', async ({page}) => {
		// Start at login page
		await page.goto('/login');
		
		// Perform login with correct credentials from users.json
		await page.locator('#username').fill('admin');
		await page.locator('#password').fill('most-secret');
		
		const signInButton = page.locator('button:has-text("Sign In")');
		await signInButton.click();

		// Wait for landing page content
		await page.waitForURL('http://localhost:5173/', {timeout: 10000});
		await expect(page.getByText('Welcome to the SPA demonstration')).toBeVisible();

		// Navigate to About
		await page.locator('a[href="/about"]').click();
		await expect(page.getByText('Client Information')).toBeVisible();

		// Navigate to Settings
		await page.locator('a[href="/settings"]').click();
		await expect(page.getByText('Appearance')).toBeVisible();

		// Perform logout
		await page.locator('button[aria-label="Logout"]').click();
		await expect(page.getByText('Login', {exact: true})).toBeVisible();
	});

	test('should redirect unauthenticated users to login', async ({page}) => {
		await page.goto('/settings');
		await expect(page).toHaveURL(/.*login/);
	});
});
