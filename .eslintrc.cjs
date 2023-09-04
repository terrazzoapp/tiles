/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'esnext',
		extraFileExtensions: ['.svelte'],
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/strict', 'plugin:svelte/recommended', 'prettier'],
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'@typescript-eslint/no-non-null-assertion': 'off', // better than "any"
		'@typescript-eslint/no-unused-vars': 'off', // handled by TS
		curly: 'error',
		'import/order': [
			'error',
			{
				alphabetize: {
					order: 'asc',
					orderImportKind: 'asc',
					caseInsensitive: true,
				},
				groups: [['builtin', 'external'], 'internal', 'parent', 'index', 'sibling'],
			},
		],
		'no-console': 'error',
		'no-fallthrough': 'error',
		'no-undef': 'off', // handled by TS
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
		{
			// relax linting in tests
			files: ['*.test.*'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
};
