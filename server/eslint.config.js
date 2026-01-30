import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
	{
		ignores: ['dist', 'node_modules', 'eslint.config.js'],
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
			'import-x/no-unresolved': 'error',
		},
	},
);
