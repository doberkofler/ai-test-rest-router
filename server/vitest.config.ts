import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 55,
				statements: 80,
			},
			exclude: ['src/**/*.test.ts', 'dist/**', 'src/session-cleanup.test.ts'],
		},
	},
});
