// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  site: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:4321',

  integrations: [mdx(), sitemap()],

  // Use static output for Vercel
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  build: {
    // Ensure static assets are properly handled
    format: 'directory',
  },

  server: {
    port: 4321,
    host: true,
  },

  vite: {
    server: {
      host: '0.0.0.0',
      port: 4321,
    },
    define: {
      // Make environment variables available to the client
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(
        process.env.PUBLIC_API_URL || 'http://localhost:4321'
      ),
      // Set NODE_ENV for server-side code
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VERCEL_URL': JSON.stringify(process.env.VERCEL_URL || ''),
    },
    build: {
      // Ensure proper module resolution for Vercel
      target: 'es2020',
      rollupOptions: {
        output: {
          // Ensure proper handling of dynamic imports
          manualChunks: undefined,
        },
      },
    },
  },
})
