import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
	mode: "production",
	plugins: [svelte()],
	build: {
		outDir: "dist",
		lib: {
			name: "@terrazzo/glass",
		},
	},
	rollupOptions: {
		external: ["svelte", "svelte-check"],
	},
});
