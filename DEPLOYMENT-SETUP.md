# 🚀 Deployment Setup Guide

## GitHub Actions + Cloudflare Pages Configuration

### ✅ Already Configured

- [x] GitHub Actions workflow (`.github/workflows/deploy.yml`)
- [x] Cloudflare Pages config (`_routes.toml`)
- [x] Git user configuration
- [x] GitHub CLI authentication

### 🔧 Required Setup Steps

#### 1. **Cloudflare Account Setup**

1. Create a [Cloudflare account](https://dash.cloudflare.com/sign-up) if you don't have one
2. Go to **Cloudflare Pages** dashboard
3. Create a new project or connect your GitHub repository

#### 2. **Get Cloudflare Credentials**

**API Token:**

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Create a **Custom Token** with:
   - **Permissions**: `Cloudflare Pages:Edit`, `Account:Read`, `Zone:Read`
   - **Account Resources**: Include your account
   - **Zone Resources**: Include all zones (or specific zones)

**Account ID:**

1. Go to your [Cloudflare dashboard](https://dash.cloudflare.com)
2. On the right sidebar, copy your **Account ID**

**Project Name:**

- The name you gave your Cloudflare Pages project (or will give it)

#### 3. **Add GitHub Repository Secrets**

Go to: `https://github.com/and3rn3t/kids-comic-creator/settings/secrets/actions`

Add these three secrets:

```text
CLOUDFLARE_API_TOKEN     → Your API token from step 2
CLOUDFLARE_ACCOUNT_ID    → Your account ID from step 2
CLOUDFLARE_PROJECT_NAME  → Your project name (e.g., "kids-comic-creator")
```

#### 4. **Test Deployment**

Once secrets are added:

1. Push any commit to the `main` branch
2. Check the **Actions** tab in your GitHub repository
3. Watch the deployment workflow run
4. Your site will be available at: `https://kids-comic-creator.pages.dev` (or similar)

### 🛠️ Additional Git Configuration Added

```bash
# Automatic remote tracking for new branches
git config --global push.autoSetupRemote true

# VS Code as default git editor
git config --global core.editor "code --wait"
```

### 🎯 Quick Commands

```bash
# Check deployment status
gh run list --workflow=deploy

# View deployment logs
gh run view --log

# Trigger manual deployment
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### 📱 Build Output Info

- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Build Size**: ~665KB (optimized with Terser)
- **Framework**: React 19 + Vite + TypeScript

---

#### Last updated: August 14, 2025
