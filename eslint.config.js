import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';
import react from 'eslint-plugin-react';

export default tseslint.config(
	{
		ignores: ['**/dist/**', '**/node_modules/**', 'eslint.config.js', '**/vite.config.ts', 'server/vitest.config.ts'],
	},
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	jsdoc.configs['flat/recommended-typescript-error'],
	regexp.configs['flat/recommended'],
	unicorn.configs['flat/recommended'],
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			'import-x/resolver': {
				typescript: true,
				node: true,
			},
		},
		rules: {
			indent: ['error', 'tab'],
			'no-tabs': 'off',
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-null': 'off',
			'jsdoc/require-returns': 'off',
			'jsdoc/require-param-description': 'off',
			'jsdoc/require-jsdoc': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
			'unicorn/filename-case': ['error', {case: 'kebabCase'}],
			'import-x/no-unresolved': 'error',
			'@typescript-eslint/no-deprecated': 'off',
			'import-x/default': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'unicorn/consistent-function-scoping': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'unicorn/no-useless-undefined': 'off',
			'unicorn/numeric-separators-style': 'off',
			'import-x/no-named-as-default-member': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
		},
	},
	{
		files: ['client/**/*.{ts,tsx}'],
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			react,
		},
		languageOptions: {
			globals: globals.browser,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
		},
	},
);
