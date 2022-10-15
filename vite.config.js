import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'

return defineConfig({
    plugins: [vue()],
    base: "/events/",
    envDir: "/app",
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });

