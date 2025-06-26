import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      setupFiles: ['./test/setup.ts'],
      environment: 'jsdom',// 'happy-dom'
    },
  }),
)
