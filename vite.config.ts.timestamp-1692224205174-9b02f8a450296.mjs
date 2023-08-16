// vite.config.ts
import { sveltekit } from "file:///Users/drew/Sites/terrazzoapp/tiles/node_modules/.pnpm/@sveltejs+kit@1.22.6_svelte@4.2.0_vite@4.4.9/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig } from "file:///Users/drew/Sites/terrazzoapp/tiles/node_modules/.pnpm/vitest@0.34.1_jsdom@22.1.0_sass@1.65.1/node_modules/vitest/dist/config.js";
var vite_config_default = defineConfig({
  mode: "production",
  plugins: [sveltekit()],
  build: {
    target: "esnext"
  },
  server: {
    fs: {
      allow: ["."]
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZHJldy9TaXRlcy90ZXJyYXp6b2FwcC90aWxlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2RyZXcvU2l0ZXMvdGVycmF6em9hcHAvdGlsZXMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2RyZXcvU2l0ZXMvdGVycmF6em9hcHAvdGlsZXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdG1vZGU6ICdwcm9kdWN0aW9uJyxcblx0cGx1Z2luczogW3N2ZWx0ZWtpdCgpXSxcblx0YnVpbGQ6IHtcblx0XHR0YXJnZXQ6ICdlc25leHQnLFxuXHR9LFxuXHRzZXJ2ZXI6IHtcblx0XHRmczoge1xuXHRcdFx0YWxsb3c6IFsnLiddLFxuXHRcdH0sXG5cdH0sXG5cdHRlc3Q6IHtcblx0XHRlbnZpcm9ubWVudDogJ2pzZG9tJyxcblx0XHRzZXR1cEZpbGVzOiBbJy4vdml0ZXN0LnNldHVwLnRzJ10sXG5cdH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlIsU0FBUyxpQkFBaUI7QUFDclQsU0FBUyxvQkFBb0I7QUFFN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLFVBQVUsQ0FBQztBQUFBLEVBQ3JCLE9BQU87QUFBQSxJQUNOLFFBQVE7QUFBQSxFQUNUO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDSCxPQUFPLENBQUMsR0FBRztBQUFBLElBQ1o7QUFBQSxFQUNEO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDTCxhQUFhO0FBQUEsSUFDYixZQUFZLENBQUMsbUJBQW1CO0FBQUEsRUFDakM7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
