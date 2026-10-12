import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	use: {
		baseURL: 'http://127.0.0.1:4322',
		...devices['Desktop Chrome'],
	},
	webServer: {
		command: 'pnpm preview --host 127.0.0.1 --port 4322 --ignore-lock',
		url: 'http://127.0.0.1:4322',
		reuseExistingServer: !process.env.CI,
	},
});
