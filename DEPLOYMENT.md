# Deployment Guide for HumanBook

## Vercel Deployment (Recommended)

### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

### Method 2: GitHub Integration (Automatic)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will automatically detect Vite and configure the build
6. Click "Deploy"

Your app will be live at `https://your-project.vercel.app`

### Environment Variables (Optional)

If you need to configure API endpoints or other settings:

1. In Vercel dashboard, go to Settings > Environment Variables
2. Add variables:
   - `VITE_API_URL` - Custom API endpoint (optional)

## Alternative Deployment Options

### Netlify

1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Create edge function in `netlify/edge-functions/proxy.ts` (similar to Vercel)
3. Deploy via Netlify CLI or GitHub integration

### Static Hosting (Cloudflare Pages, GitHub Pages, etc.)

**Note:** The CORS proxy won't work with static-only hosting. You'll need to:

1. Use direct API access (may have CORS issues)
2. Or deploy the edge function separately on Vercel/Netlify

For static hosting only:
```bash
npm run build
```

Upload the `dist/` folder to your hosting service.

## Local Testing

Test production build locally:

```bash
# Build
npm run build

# Preview
npm run preview
```

The preview server will run at http://localhost:4173

## Troubleshooting

### Build Fails

Check:
- Node.js version (requires 18+)
- All dependencies installed (`npm install`)
- No TypeScript errors (`npm run typecheck`)

### CORS Issues in Production

The edge function should handle CORS. If issues persist:
- Verify `vercel.json` is present
- Check edge function logs in Vercel dashboard
- Ensure API requests go through `/api/proxy`

### Edge Function Not Working

1. Check Vercel deployment logs
2. Verify `api/proxy.ts` is deployed
3. Test edge function directly: `https://your-app.vercel.app/api/proxy/posts`

## Post-Deployment

After successful deployment:

1. Test all features:
   - Registration
   - Login
   - Creating posts
   - Viewing posts
   - Commenting
   - Account settings

2. Monitor edge function logs in Vercel dashboard

3. Set up custom domain (optional):
   - In Vercel dashboard: Settings > Domains
   - Add your domain and configure DNS

## Performance Optimization

The edge function runs at Vercel's edge network for low latency. Additional optimizations:

1. Enable Vercel Analytics
2. Use Vercel's built-in CDN for static assets
3. Monitor response times in dashboard

## Security

- Authentication tokens stored in localStorage
- CORS handled by edge function
- All API requests proxied through edge function
- No secrets exposed in frontend code

## Costs

- Vercel Hobby plan: Free for personal projects
- Edge function invocations: Generous free tier
- Bandwidth: Typically sufficient for small-medium apps

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- View deployment logs in Vercel dashboard
- Contact Vercel support for platform issues
