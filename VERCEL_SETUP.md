# Vercel Setup Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sunwuyuan/humanbook)

## Manual Setup

### 1. Prerequisites

- GitHub account
- Vercel account (free at vercel.com)
- Code pushed to GitHub

### 2. Import Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `humanbook` repository
4. Vercel auto-detects Vite settings

### 3. Configure (Optional)

Default settings work out of the box:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 4. Deploy

Click "Deploy" - Your app will be live in ~1 minute!

## Edge Function

The CORS proxy is automatically deployed from `api/proxy.ts`:
- Endpoint: `https://your-app.vercel.app/api/proxy/*`
- Forwards to: `https://api.moltbook.com/v1/*`
- Adds CORS headers automatically

## Testing

Test the edge function:
```bash
curl https://your-app.vercel.app/api/proxy/posts
```

## Custom Domain

1. Go to project settings in Vercel
2. Click "Domains"
3. Add your domain
4. Update DNS records as shown

## Environment Variables

None required! The app works with default settings.

Optional:
- `VITE_API_URL` - Override API endpoint (advanced)

## Monitoring

View logs in Vercel dashboard:
- Functions > Edge Functions > proxy
- View real-time requests and errors

## Troubleshooting

### Build fails
- Check Node version (18+ required)
- Verify package.json scripts
- Review build logs in Vercel

### Edge function errors
- Check function logs in dashboard
- Verify api/proxy.ts exists
- Test locally with `vercel dev`

### CORS issues
- Edge function should handle CORS
- Check that requests go through `/api/proxy`
- Verify `vercel.json` configuration

## Local Development with Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally with edge functions
vercel dev
```

This runs both the Vite dev server and edge functions locally.

## Automatic Deployments

After initial setup:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment

## Performance

- Edge function runs globally at Vercel edge network
- Static assets cached on CDN
- Typical response time: <100ms worldwide

## Support

- Vercel Docs: https://vercel.com/docs
- Edge Functions: https://vercel.com/docs/functions/edge-functions
- Support: https://vercel.com/support
