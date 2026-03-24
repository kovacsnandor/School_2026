//régi tartalom

// import { fileURLToPath } from 'node:url'
// import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
// import viteConfig from './vite.config'

// export default mergeConfig(
//   viteConfig,
//   defineConfig({
//     test: {
//       environment: 'jsdom',
//       exclude: [...configDefaults.exclude, 'e2e/**'],
//       root: fileURLToPath(new URL('./', import.meta.url)),
//     },
//   }),
// )


// AI által javasolt tartalom

import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    // Ez szimulálja a böngészőt (fontos a DOM műveletekhez)
    environment: 'jsdom',
    // Így nem kell minden fájlba importálni a describe, it, expect függvényeket
    globals: true,
    // Kizárjuk az E2E teszteket a unit tesztek közül
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
  resolve: {
    alias: {
      // Ez oldja fel a @/ hivatkozásokat a tesztekben
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})