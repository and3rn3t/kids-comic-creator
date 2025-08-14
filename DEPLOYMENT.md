# Cloudflare Pages Deployment Setup

This project is configured to automatically deploy to Cloudflare Pages via GitHub Actions.

## ⚠️ Important Note

The `@github/spark` dependency has been temporarily removed from `package.json` to enable successful builds. This is a private GitHub package that's not available in the public npm registry. You may need to:

1. Set up access to GitHub's private npm registry if you need Spark features
2. Or replace Spark functionality with alternative solutions
3. Or contact your GitHub team for access to the Spark package

## Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account with Pages enabled
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **GitHub Secrets**: Configure the following secrets in your GitHub repository

## Required GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

### `CLOUDFLARE_API_TOKEN`

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template or create custom token with:
   - Account: Your account (`Account:read`)
   - Zone: Your zone (`Zone:read`) if using custom domain
   - Page: All pages (`Cloudflare Pages:edit`)

### `CLOUDFLARE_ACCOUNT_ID`

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Copy your Account ID from the right sidebar

### `CLOUDFLARE_PROJECT_NAME`

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Create a new project or use existing one
3. Use the project name (not the domain)

## Setup Steps

### Option 1: GitHub Actions (Recommended)

1. **Set up secrets** as described above
2. **Push to main branch** - deployment will trigger automatically
3. **Check deployment** in GitHub Actions tab

### Option 2: Direct Connection (Alternative)

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Connect to your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)
   - **Node.js version**: `20`

## Build Configuration

The project includes optimized build settings in `vite.config.ts`:

- Code splitting for better caching
- Terser minification for smaller bundles
- Source maps disabled in production
- Manual chunk optimization for vendor libraries

## Environment Variables

If you need environment variables in production:

1. Add them to `.env.example` (for documentation)
2. In Cloudflare Pages dashboard → Settings → Environment variables
3. Add your production variables (must start with `VITE_` to be available in the app)

## Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Add your domain
4. Update DNS settings as instructed

## Performance Features

- ✅ Automatic code splitting
- ✅ Asset optimization
- ✅ Brotli compression
- ✅ Global CDN
- ✅ HTTP/3 support
- ✅ Security headers
- ✅ SPA routing support

## Monitoring

- **Build logs**: Available in GitHub Actions
- **Analytics**: Cloudflare Web Analytics (free tier available)
- **Performance**: Cloudflare Speed tab in dashboard
