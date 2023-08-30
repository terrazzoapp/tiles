import sass from '@cobalt-ui/plugin-sass';

/** @type import('@cobalt-ui/core').Config */
export default {
	tokens: './tokens.yaml',
	output: './dist/tokens',
	plugins: [
		sass({
			cssVars: true,
			pluginCSS: {
				modeSelectors: [
					{ mode: 'light', selectors: ['@media (prefers-color-scheme: light)', '[data-color-mode="light"]'] },
					{ mode: 'dark', selectors: ['@media (prefers-color-scheme: dark)', '[data-color-mode="dark"]'] },
				],
			},
		}),
	],
};
