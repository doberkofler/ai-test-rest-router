import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
	{
		ignores: ['dist', 'node_modules', 'eslint.config.js', 'vite.config.ts', 'coverage'],
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
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2022,
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		settings: {
			react: {
				version: 'detect',
			},
			'import-x/resolver': {
				typescript: true,
				node: true,
			},
		},
		rules: {
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
			'indent': ['error', 'tab'],
			'no-tabs': 'off',
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-null': 'off',
			'jsdoc/require-returns': 'off',
			'jsdoc/require-param-description': 'off',
			'jsdoc/require-jsdoc': 'off',
			'@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
			'unicorn/filename-case': ['error', {case: 'kebabCase'}],
			'react/prop-types': 'off',
			'import-x/no-unresolved': 'error',
			'import-x/default': 'off',
			'import-x/no-named-as-default-member': 'off',
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'unicorn/no-nested-ternary': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-deprecated': 'off',
			'@typescript-eslint/no-unnecessary-condition': 'off',
			'@typescript-eslint/require-await': 'off',
			'unicorn/consistent-function-scoping': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'unicorn/no-useless-undefined': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'unicorn/numeric-separators-style': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
		},
	},
);
