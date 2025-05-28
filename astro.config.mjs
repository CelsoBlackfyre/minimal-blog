// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  // This will be overridden by the VERCEL_URL environment variable in production
  site: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:4321',
  
  integrations: [mdx(), sitemap()],
  
  // Enable server-side rendering for API routes
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  
  server: {
    port: 4321,
    host: true,
    // Ensure environment variables are available in development
    setup: (server) => {
      if (!process.env.TMDB_API_KEY) {
        console.warn('TMDB_API_KEY is not set in environment variables');
        // Try to load from .env file in development
        require('dotenv').config();
      }
    },
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
      // Make TMDB API key available server-side
      'import.meta.env.TMDB_API_KEY': JSON.stringify(process.env.TMDB_API_KEY || ''),
      // Set NODE_ENV for server-side code
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VERCEL_URL': JSON.stringify(process.env.VERCEL_URL || '')
    }
  }
});
