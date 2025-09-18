// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  // This will be overridden by the VERCEL_URL environment variable in production
  site: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:4321',

  integrations: [mdx(), sitemap()],

  // For Vercel deployment - static output for frontend-only
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  // Backend removed - no need for API URL configuration
})
