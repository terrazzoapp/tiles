import sass from '@cobalt-ui/plugin-sass';

/** @type import('@cobalt-ui/core').Config */
export default {
	tokens: './tokens.yaml',
	output: './dist/tokens',
	plugins: [
		sass({
			cssVars: true,
			pluginCSS: {
				modeSelectors: {
					'color#light': ['@media (prefers-color-scheme: light)', '[data-color-mode="light"]'],
					'color#dark': ['@media (prefers-color-scheme: dark)', '[data-color-mode="dark"]'],
				},
			},
		}),
	],
};
