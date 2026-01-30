import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';

export default tseslint.config(
	{
		ignores: [
			'**/dist/**',
			'**/coverage/**',
			'**/node_modules/**',
			'eslint.config.mjs',
			'vitest.config.ts',
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	jsdoc.configs['flat/recommended-typescript-error'],
	regexp.configs['flat/recommended'],
	unicorn.configs['flat/recommended'],
	{
		files: ['src/**/*.ts', 'src/**/*.test.ts'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.node,
			},
		},
		plugins: {
			'import-x': importX,
		},
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-null': 'off',
			'jsdoc/require-jsdoc': ['error', { publicOnly: true }],
		},
	},
	{
		files: ['src/**/*.test.ts'],
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
);
