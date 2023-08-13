import cloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: cloudflare({
			routes: {
				include: ['/*'],
				exclude: ['<all>'],
			},
		}),
		files: {
			assets: 'docs/static',
			appTemplate: 'docs/src/app.html',
			lib: 'docs/src/lib',
			routes: 'docs/src/routes',
		},
	},
};

export default config;
