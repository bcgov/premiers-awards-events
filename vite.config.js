import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    envPrefix: 'PA_EVENTS_',
    plugins: [vue()],
    base: env.baseSlug,
    envDir: env.envDir,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

//
// export default defineConfig({
//   plugins: [vue()],
//   base: "/events/",
//   envDir: "/app",
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })
