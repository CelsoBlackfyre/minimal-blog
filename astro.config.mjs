// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // This will be overridden by the VERCEL_URL environment variable in production
  site: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:4321',
  
  integrations: [mdx(), sitemap()],
  
  // For Vercel deployment
  output: 'static',
  adapter: vercel({
    // Vercel serverless function configuration
    webAnalytics: {
      enabled: true,
    },
  }),
  
  vite: {
    define: {
      // Make environment variables available to the client
      'import.meta.env.PUBLIC_API_URL': JSON.stringify(
        process.env.PUBLIC_API_URL || 'http://localhost:8080'
      )
    }
  }
});
