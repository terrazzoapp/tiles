import sass from '@cobalt-ui/plugin-sass';

/** @type import('@cobalt-ui/core').Config */
export default {
	tokens: './tokens.yaml',
	output: './dist/tokens',
	plugins: [
		sass({
			cssVars: true,
			pluginCSS: true,
		}),
	],
};
