import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	mode: 'production',
	plugins: [sveltekit()],
	build: {
		target: 'esnext',
	},
	server: {
		fs: {
			allow: ['.'],
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
	},
});
