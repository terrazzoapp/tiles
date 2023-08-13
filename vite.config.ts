import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	mode: 'production',
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['./docs'],
		},
	},
});
