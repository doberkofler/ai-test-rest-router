import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {playwright} from '@vitest/browser-playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@shared/logic': path.resolve(__dirname, '../shared/src/index.ts'),
			'@client': path.resolve(__dirname, './src'),
		},
	},
	define: {
		__BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
		},
	},
	build: {
		chunkSizeWarningLimit: 1000,
	},
	test: {
		globals: true,
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [{browser: 'chromium'}],
		},
		setupFiles: ['./src/test/setup.ts'],
		testTimeout: 30000,
		hookTimeout: 30000,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				lines: 75,
				functions: 75,
				branches: 75,
				statements: 75,
			},
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['**/node_modules/**', 'src/**/*.test.{ts,tsx}', 'src/test/**', 'src/shared/**', 'src/vite-env.d.ts', 'src/main.tsx', '**/*.d.ts', '**/*.css'],
		},
	},
});
