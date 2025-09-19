// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://blackfyre-codex.xyz',
  output: 'static',
  integrations: [mdx(), sitemap()],
})
