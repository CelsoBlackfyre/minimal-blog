Codex Blackfyre – Content Aggregator & Blog

A dark, unique, and feature-rich blog built on Astro, designed to keep you up to date with the latest movies, series, games, and comics.
Includes original reviews, tech posts, and a personalized, lore-rich interface themed after House Blackfyre.

<!-- Replace with actual screenshot if desired -->
✨ Features

    🔥 Content Aggregation: Automatically fetches and displays the latest movies (via TMDB), popular TV shows, and more.

    🧙 Original Lore & Theming: Unique Blackfyre sigil, color palette, and world-building flourishes.

    🎨 Minimal & Immersive UI: Custom backgrounds, card layouts, and seamless experience.

    📰 MDX/Markdown Blogging: Write posts with images, code, or media embeds.

    ⚡ Performance: Blazing fast, SEO-friendly, and responsive.

    🌐 OpenGraph, RSS, Sitemap: Ready for search engines and sharing.

🗂️ Project Structure

├── public/
│   └── dragon-sigil.png      # Your custom Blackfyre sigil
├── src/
│   ├── components/           # Astro components (cards, lists, header, etc)
│   ├── content/              # Blog posts and MDX collections
│   ├── layouts/              # Page & post layouts
│   └── pages/                # Routes
├── astro.config.mjs
├── package.json
└── tsconfig.json

    /components/: UI blocks (movie cards, headers, footers, etc.)

    /content/: Markdown/MDX posts (with optional categories for "Movies", "TV Shows", etc.)

    /public/: Static assets (images, SVGs, favicon, etc.)

## 🚀 Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ☁️ Vercel Deployment

### Prerequisites
- A Vercel account (free tier available)
- Your project pushed to a GitHub, GitLab, or Bitbucket repository
- Your Go backend API deployed (e.g., on Railway, Render, or Vercel Serverless Functions)

### Deployment Steps

1. **Prepare Your Repository**
   - Make sure all changes are committed and pushed to your repository
   - Note: Your Astro project should be in the `src` directory

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com/new)
   - Click "Import Project" and select your repository
   - In the configuration:
     - Set the root directory to `/src`
     - Set the build command: `npm install && npm run build`
     - Set the output directory: `dist`
     - Set the Node.js version: 18.x
   
3. **Configure Environment Variables**
   In your Vercel project settings, add these environment variables:
   ```
   NODE_ENV=production
   PUBLIC_API_URL=your-backend-api-url.com
   SITE_URL=https://your-vercel-app.vercel.app
   ```

4. **Deploy!**
   - Click "Deploy" and wait for the deployment to complete
   - Your site will be live at `your-project-name.vercel.app`

### Custom Domain (Optional)
1. Go to your Vercel project settings
2. Click on "Domains"
3. Add your custom domain and follow the verification steps

### Backend Deployment
For the Go backend, consider deploying to:
- [Railway.app](https://railway.app/) (recommended for Go)
- [Render.com](https://render.com/)
- Vercel Serverless Functions (if you convert your Go code to a serverless function)

Open your browser at localhost:4321.

    To add a new blog post, create a .md or .mdx file in src/content/blog/.

    Latest movies/series/games are pulled dynamically via API.

    Edit global styling in src/styles/global.css.

🛠️ Customization

    Update the site theme or sigil in /public/dragon-sigil.png.

    Adjust background patterns and color scheme in global.css.

    Movie and TV data are fetched via TMDB—add your API key in environment variables.

🧞 Useful Commands
Command	Action
npm install	Install dependencies
npm run dev	Start local dev server
npm run build	Build production site to ./dist/
npm run preview	Preview build locally before deploying
🤝 Contributing

PRs and suggestions are welcome!
You can use this as your own template for a modern media blog or aggregator.
Built with Astro + Custom Code by Imperator Blackfyre

Credit for original Astro theme: Bear Blog.