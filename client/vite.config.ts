import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@shared': path.resolve(__dirname, './src/shared'),
		},
	},
	define: {
		__BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
	},
	test: {
		globals: true,
		browser: {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			headless: true,
		},
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				lines: 90,
				functions: 90,
				branches: 90,
				statements: 90,
			},
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/shared/**', 'src/vite-env.d.ts', 'src/main.tsx'],
		},
	},
});
