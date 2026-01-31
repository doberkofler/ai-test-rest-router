import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env['CI'],
	retries: process.env['CI'] ? 2 : 0,
	workers: process.env['CI'] ? 1 : undefined,
	reporter: 'html',
	timeout: 30 * 1000, // 30 seconds
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: {...devices['Desktop Chrome']},
		},
	],
	webServer: [
		{
			command: 'npm run start -w server',
			url: 'http://localhost:3000/api/health',
			reuseExistingServer: !process.env['CI'],
			timeout: 60 * 1000, // 60 seconds
		},
		{
			command: 'VITE_API_URL=http://localhost:3000 npm run dev -w client',
			url: 'http://localhost:5173',
			reuseExistingServer: !process.env['CI'],
			timeout: 60 * 1000, // 60 seconds
		},
	],
});
